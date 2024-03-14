import { logger } from "../../../logger";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const loans = await prisma.loan.findMany({
    include: {
      user: true,
      book: true,
    },
    orderBy: {
      borrowedAt: "desc",
    },
  });
  const id = searchParams.get("id");
  if (id) {
    const data = await prisma.loan.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        book: true,
      },
    });
    if (data) {
      const modifiedData = {
        ...data,
        borrowedAt: data.borrowedAt.toLocaleDateString(),
        returnedAt: data.returnedAt?.toLocaleDateString(),
      };
      return NextResponse.json({
        status: 200,
        message: "success",
        loan: modifiedData,
      });
    }
    return NextResponse.json({
      status: 400,
      message: "data not found",
    });
  }
  const modifiedData = loans.map((item) => {
    return {
      ...item,
      borrowedAt: item.borrowedAt.toLocaleDateString(),
      returnedAt: item.returnedAt?.toLocaleDateString(),
    };
  });
  return NextResponse.json({ loan: modifiedData });
};

// Existing imports and setup

// Existing imports and setup

export const POST = async (req: NextRequest) => {
  const { user_id, book_id, returnedAt } = await req.json();
  try {
    const user = await prisma.user.findUnique({
      where: { externalId: user_id },
    });
    const book = await prisma.book.findUnique({ where: { id: book_id } });
    if (!user || !book) {
      return NextResponse.json({
        status: 400,
        message: "Invalid user_id or book_id",
      });
    }
    if (book.quantity === 0) {
      return NextResponse.json({
        status: 400,
        message: "Book not available",
      });
    }
    const loan = await prisma.loan.create({
      data: {
        user: { connect: { externalId: user_id } },
        book: { connect: { id: book_id } },
        returnedAt: new Date(returnedAt),
      },
    });
    logger.info(`Loan created: ${JSON.stringify(loan)}`);
    return NextResponse.json({ status: 200, message: "Loan created", loan });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "An error occurred",
      error,
    });
  }
};

export const PUT = async (req: NextRequest) => {
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
    const findLoan = await prisma.loan.findUnique({
      where: {
        id: id,
      },
    });
    if (findLoan?.status === "returned") {
      const loan = await prisma.loan.update({
        where: {
          id: id,
        },
        data: {
          status: "borrowed",
        },
      });
      return NextResponse.json({ loan });
    }
    const loan = await prisma.loan.update({
      where: {
        id: id,
      },
      data: {
        status: "returned",
      },
    });
    logger.info(`Loan updated: ${JSON.stringify(loan)}`);
    return NextResponse.json({ loan });
  } catch (error) {
    return NextResponse.json(error);
  }
};

// export const POST = async (req: NextRequest) => {
//   try {
//     const { user_id, book_id } = await req.json();

//     const user = await prisma.user.findUnique({ where: { id: user_id } });
//     const book = await prisma.book.findUnique({ where: { id: book_id } });
//     if (!user || !book) {
//       return NextResponse.json({
//         status: 400,
//         message: "Invalid user_id or book_id",
//       });
//     }

//     if (book.Loan.length > 0) {
//       return NextResponse.json({
//         status: 400,
//         message: "Book is already on loan",
//       });
//     }

//     const loan = await prisma.loan.create({
//       data: {
//         user: { connect: { id: user_id } },
//         book: { connect: { id: book_id } },
//       },
//     });

//     return NextResponse.json({ status: 200, message: "Loan created", loan });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ status: 500, message: "An error occurred" });
//   }
// };

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
    const loan = await prisma.loan.findUnique({ where: { id: id } });
    if (!loan) {
      return NextResponse.json({ status: 404, message: "Invalid loan_id" });
    }

    const deleteLoan = await prisma.loan.delete({
      where: { id: id },
    });

    return NextResponse.json({ deleteLoan });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      message: "An error occurred",
      error,
    });
  }
};
