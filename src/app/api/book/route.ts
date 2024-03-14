import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parse } from 'path';
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const book = await prisma.book.findUnique({
      where: { id: String(id) },
      include: {
        category: true,
        Review: {
          include: {
            user: true
          }
        },
        Loan: true,
      }
    });
    if (book) {
      let imageBase64;
      if (book.image) {
        imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
      }
      return NextResponse.json({
        status: 200,
        message: "success",
        book: {
          ...book,
          imageData: imageBase64,
        },
      });
    }
    return NextResponse.json({
      status: 400,
      message: 'Book not found'
    });
  } else {
    const books = await prisma.book.findMany({
      include: {
        category: true
      }
    });
    const booksWithImageBase64 = books.map(book => {
      let imageBase64 = '';
      if (book.image) {
        imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
      }
      return {
        ...book,
        image: imageBase64,
      };
    });
    return NextResponse.json({ books: booksWithImageBase64 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.formData();
    const title = data.get('title') as string;
    const author = data.get('author') as string;
    const quantity = data.get('quantity') as string;
    const category = data.get('category') as string;
    const imageFile: File | null = data.get('image') as unknown as File;

    if (!imageFile) {
      return NextResponse.json({
        status: 400,
        message: "Image file is missing",
      });
    }

    const bytes = await imageFile.arrayBuffer();
    const image = Buffer.from(bytes);

    const existingCategory = await prisma.category.findUnique({
      where: {
        id: category
      }
    });

    if (!existingCategory) {
      return NextResponse.json({
        status: 400,
        message: "Invalid category",
      });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        quantity: parseInt(quantity, 10),
        category: {
          connect: {
            id: category
          }
        },
        image
      } as any
    });

    return NextResponse.json({ book });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred",
      error: error,
    });
  }
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

    const data = await req.formData();
    const title = data.get('title') as string;
    const author = data.get('author') as string;
    const quantity = data.get('quantity') as string;
    const category = data.get('category') as string;
    const imageFile: File | null = data.get('image') as unknown as File;

    let image;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      image = Buffer.from(bytes);
    }

    const updateData: any = {
      title,
      author,
      quantity: parseInt(quantity, 10),
      category: { connect: { id: category } },
    };

    if (image) {
      updateData.image = image;
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: 200,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while updating the book",
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
    const book = await prisma.book.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ book });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred while deleting the book",
      error: error.message,
    });
  }
};

