import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/common/lib/supabase-server";
import { loginUser, registerUser } from "../actions/auth-actions";
import { loginSchema, registerSchema } from "@/common/lib/schemas";

/**
 * GET /api/auth - Get current user session
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/auth - Handle login and registration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action: authAction, ...data } = body;

    let result;

    switch (authAction) {
      case "login":
        // Validate login data
        const loginData = loginSchema.parse(data);
        result = await loginUser(loginData);
        break;

      case "register":
        // Validate registration data
        const registerData = registerSchema.parse(data);
        result = await registerUser(registerData);
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Auth POST error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/auth - Logout user
 */
export async function DELETE(request: NextRequest) {
  try {
    const result = await logoutUser();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Auth DELETE error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Logout failed" },
      { status: 500 },
    );
  }
}
