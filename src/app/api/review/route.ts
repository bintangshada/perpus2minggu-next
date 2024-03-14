import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const review = await prisma.review.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        book: true,
      },
    });
    return NextResponse.json({
      status: 200,
      message: "success",
      review,
    });
  }
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      book: true,
    },
  });
  return NextResponse.json({ status: 200, message: "success", reviews });
};

export const POST = async (req: NextRequest) => {
  const { user_id, book_id, review } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { externalId: user_id },
    });
    const book = await prisma.book.findUnique({ where: { id: book_id } });
    if (!user || !book) {
      return NextResponse.json({
        status: 404,
        message: "Invalid user_id or book_id",
      });
    }
    const reviews = await prisma.review.create({
      data: {
          user: { connect: { externalId: user_id } },
          book: { connect: { id: book_id } },
          reviews: review
      }
    });
    return NextResponse.json({ status: 201, message: "success", reviews });
  } catch (error: any) {
    return NextResponse.json({
      status: error.status,
      message: error.message,
      error,
    });
  }
};

export const PUT = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const { review } = await req.json();
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({
      status: 400,
      message: "ID parameter is missing in the request",
    });
  }
  const id = idParam;
  try {
    const findReview = await prisma.review.findUnique({
      where: {
        id: id,
      },
    });
    const reviews = await prisma.review.update({
      where: {
        id: id,
      },
      data: {
        reviews: review,
      },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json(error);
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
    const reviews = await prisma.review.findUnique({ where: { id: id } });
    if (!reviews) {
      return NextResponse.json({ status: 404, message: "Invalid review_id" });
    }

    const deleteReview = await prisma.review.delete({
      where: { id: id },
    });

    return NextResponse.json({ deleteReview });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred",
      error,
    });
  }
};