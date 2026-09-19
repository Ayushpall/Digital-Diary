import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          status: "unauthenticated",
          authenticated: false,
          user: null,
        },
        { status: 200 }
      );
    }

    // Retrieve clerk user profile details
    const clerkUser = await currentUser();
    const primaryEmail =
      clerkUser?.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress ??
      clerkUser?.emailAddresses[0]?.emailAddress ??
      "";

    const fullName =
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      clerkUser?.username ||
      null;

    // Synchronize user record in Neon database
    const dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: primaryEmail,
        name: fullName,
        imageUrl: clerkUser?.imageUrl ?? null,
      },
      create: {
        id: userId,
        email: primaryEmail,
        name: fullName,
        imageUrl: clerkUser?.imageUrl ?? null,
      },
    });

    return NextResponse.json({
      status: "ok",
      authenticated: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        imageUrl: dbUser.imageUrl,
        createdAt: dbUser.createdAt,
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
