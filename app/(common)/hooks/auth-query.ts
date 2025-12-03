import { createSupabaseClient } from "@/lib/supabase-client";
import type { User } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * Authenticated query wrapper
 * Provides automatic authentication and validation for client-side queries
 */
export function authQuery<TParams = void, TResult = any>(
  queryFn: (params: {
    supabase: any;
    user: User;
    params: TParams;
  }) => Promise<TResult>,
  options?: {
    paramsSchema?: z.ZodSchema<TParams>;
    requiredRole?: "admin" | "member" | "viewer";
  },
) {
  return async (params: TParams) => {
    const supabase = createSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized: User must be authenticated");
    }

    // Optional role check
    if (options?.requiredRole) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== options.requiredRole && profile?.role !== "admin") {
        throw new Error(
          `Insufficient permissions: Required role ${options.requiredRole}`,
        );
      }
    }

    // Optional input validation
    let validatedParams = params;
    if (options?.paramsSchema) {
      validatedParams = options.paramsSchema.parse(params);
    }

    return queryFn({ supabase, user, params: validatedParams });
  };
}

/**
 * Public query wrapper
 * For queries that don't require authentication
 */
export function publicQuery<TParams = void, TResult = any>(
  queryFn: (params: { supabase: any; params: TParams }) => Promise<TResult>,
  options?: {
    paramsSchema?: z.ZodSchema<TParams>;
  },
) {
  return async (params: TParams) => {
    const supabase = createSupabaseClient();

    // Optional input validation
    let validatedParams = params;
    if (options?.paramsSchema) {
      validatedParams = options.paramsSchema.parse(params);
    }

    return queryFn({ supabase, params: validatedParams });
  };
}

/**
 * Admin-only query wrapper
 * Automatically checks for admin permissions
 */
export function adminQuery<TParams = void, TResult = any>(
  queryFn: (params: {
    supabase: any;
    user: User;
    params: TParams;
  }) => Promise<TResult>,
  options?: {
    paramsSchema?: z.ZodSchema<TParams>;
  },
) {
  return authQuery(queryFn, {
    ...options,
    requiredRole: "admin",
  });
}
