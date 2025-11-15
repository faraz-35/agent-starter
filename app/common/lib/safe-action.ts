import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

/**
 * Base action client with default error handling
 */
export const action = createSafeActionClient({
  handleServerError(error) {
    console.error("Server action error:", error);

    // Don't expose sensitive error details to client
    if (process.env.NODE_ENV === "production") {
      return "An unexpected error occurred";
    }

    return error.message;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});

/**
 * Action client for public actions (no authentication required)
 */
export const publicAction = createSafeActionClient({
  handleServerError(error) {
    console.error("Public action error:", error);

    if (process.env.NODE_ENV === "production") {
      return "An unexpected error occurred";
    }

    return error.message;
  },
});
