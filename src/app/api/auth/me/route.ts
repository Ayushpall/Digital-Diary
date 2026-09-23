import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authUser = await getAuthenticatedUser();

    if (!authUser) {
      return NextResponse.json(
        {
          status: "unauthenticated",
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    const { dbUser } = authUser;

    return NextResponse.json({
      status: "ok",
      authenticated: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        imageUrl: dbUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to process user session" },
      { status: 500 }
    );
  }
}
