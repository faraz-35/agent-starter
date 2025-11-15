"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/common/lib/supabase-client";
import { useAuthStore } from "@/common/store";
import type { User } from "@supabase/supabase-js";

/**
 * Custom hook to handle authentication state
 */
export function useAuth() {
  const router = useRouter();
  const { user, setUser, setLoading, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      // Redirect to dashboard on sign in
      if (_event === "SIGNED_IN" && session?.user) {
        router.push("/dashboard");
      }

      // Redirect to home on sign out
      if (_event === "SIGNED_OUT") {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, setUser, setLoading]);

  return {
    user,
    isLoading: useAuthStore((state) => state.isLoading),
    isAuthenticated,
    logout,
  };
}
