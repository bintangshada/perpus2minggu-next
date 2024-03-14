import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const category = await prisma.category.findUnique({
      where: {
        id: id,
      },
      include: {
        Book: true,
      },
    });

    if (!category) {
      return NextResponse.json({
        status: 400,
        message: 'Category not found',
      });
    }

    return NextResponse.json({
      status: 200,
      message: 'success',
      category: category,
    });
  }

  const categories = await prisma.category.findMany({
    include: {
      Book: true,
    },
  });

  return NextResponse.json({ categories });
};


export const POST = async (req: NextRequest) => {
  const { name } = await req.json();
  const category = await prisma.category.create({
    data: {
      name
    }
  });
  return NextResponse.json({ category });
};

export const PUT = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({
        status: 400,
        message: "ID parameter is missing in the request",
      });
    }
    const id = idParam;
    const { name } = await req.json();
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while updating the category",
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
    const category = await prisma.category.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ category });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while deleting the category",
      error: error.message,
    });
  }
};
