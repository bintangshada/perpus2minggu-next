import { logger } from "@/logger";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const user = await prisma.user.findUnique({
      where: {
        externalId: id,
      },
      include: {
        Loan: true
      }
    });

    if (!user) {
      return NextResponse.json({
        status: 400,
        message: "users not found",
      });
    }

    return NextResponse.json({
      status: 200,
      message: "success",
      user: user,
    });
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          Loan: {
            where: {
              status: "borrowed",
            },
          },
        },
      },
      Loan: true
    },
  });

  return NextResponse.json({ users });
};

export const PUT = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const externalId = searchParams.get("externalId"); // Anda menggunakan "externalId" sebagai parameter
    if (!externalId) {
      return NextResponse.json({
        status: 400,
        message: "External ID parameter is missing in the request",
      });
    }
    const { roles } = await req.json();

    await clerkClient.users.updateUserMetadata(externalId, {
      publicMetadata: {
        roles: [roles],
      },
    });

    await prisma.user.update({
      where: {
        externalId,
      },
      data: {
        role: roles,
      },
    });
    logger.info(`Updating user metadata`);
    return NextResponse.json({
      status: 200,
      message: "User metadata updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while updating the user metadata",
      error: error.message,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({
      status: 400,
      message: "ID parameter is missing in the request",
    });
  }
  const id = idParam;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
      });
    }
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    await clerkClient.users.deleteUser(user.externalId);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while deleting the user",
      error: error.message,
    });
  }
};
