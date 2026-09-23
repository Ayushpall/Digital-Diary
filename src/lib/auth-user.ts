import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedUserResult {
  userId: string;
  dbUser: {
    id: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
  };
}

/**
 * Ensures the requesting user is authenticated via Clerk and has an
 * existing User record in the Neon PostgreSQL database.
 * Prevents foreign key constraint errors when creating Diaries or Entries.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUserResult | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  // Check if user already exists in Neon database
  let dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      imageUrl: true,
    },
  });

  if (!dbUser) {
    let email = `${userId}@placeholder.local`;
    let name: string | null = null;
    let imageUrl: string | null = null;

    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const primary =
          clerkUser.emailAddresses.find(
            (e) => e.id === clerkUser.primaryEmailAddressId
          )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
        if (primary) email = primary;

        name =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          clerkUser.username ||
          null;
        imageUrl = clerkUser.imageUrl || null;
      }
    } catch (err) {
      console.warn("Could not retrieve Clerk currentUser details, using fallback:", err);
    }

    dbUser = await prisma.user.upsert({
      where: { id: userId },
      update: {
        ...(name ? { name } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      },
      create: {
        id: userId,
        email,
        name,
        imageUrl,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
      },
    });
  }

  return { userId, dbUser };
}
