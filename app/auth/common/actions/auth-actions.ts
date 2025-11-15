"use server";

import { publicAction, authAction } from "@/common/lib/safe-action";
import {
  loginSchema,
  registerSchema,
  profileUpdateSchema,
} from "@/common/lib/schemas";
import type {
  LoginInput,
  RegisterInput,
  ProfileUpdateInput,
} from "@/common/lib/schemas";

/**
 * Authenticates a user with email and password
 */
export const loginUser = publicAction(
  loginSchema,
  async ({ email, password }) => {
    const { supabase } = await import("@/common/lib/supabase-server").then(
      (mod) => ({
        supabase: mod.createSupabaseServerClient(),
      }),
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },
);

/**
 * Registers a new user
 */
export const registerUser = publicAction(
  registerSchema,
  async ({ email, password }) => {
    const { supabase } = await import("@/common/lib/supabase-server").then(
      (mod) => ({
        supabase: mod.createSupabaseServerClient(),
      }),
    );

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },
);

/**
 * Signs out the current user
 */
export const logoutUser = publicAction(async () => {
  const { supabase } = await import("@/common/lib/supabase-server").then(
    (mod) => ({
      supabase: mod.createSupabaseServerClient(),
    }),
  );

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
});

/**
 * Updates user profile information (requires authentication)
 */
export const updateProfile = authAction(
  profileUpdateSchema,
  async (data, { supabase, authUser }) => {
    const { error } = await supabase.from("profiles").upsert({
      id: authUser.id,
      email: authUser.email!,
      ...data,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  },
);
