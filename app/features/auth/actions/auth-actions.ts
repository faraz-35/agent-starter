"use server";

import { createSupabaseServerClient } from "@/common/lib/supabase-server";
import { action } from "@/common/lib/safe-action";
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
export const loginUser = action(loginSchema, async ({ email, password }) => {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
});

/**
 * Registers a new user
 */
export const registerUser = action(
  registerSchema,
  async ({ email, password }) => {
    const supabase = createSupabaseServerClient();

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
export const logoutUser = action.action(async () => {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
});

/**
 * Updates user profile information
 */
export const updateProfile = action(profileUpdateSchema, async (data) => {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email!,
    ...data,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
});
