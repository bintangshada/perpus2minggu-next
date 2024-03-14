import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const GET = async (req: NextRequest) => {
    const book = await prisma.book.count()
    const user = await prisma.user.count()
    const loan = await prisma.loan.count()
    const borrow = await prisma.loan.count({
        where: {
            status: "borrowed"
        }
    })
        const returned = await prisma.loan.count({
          where: {
            status: "returned",
          },
        });
    return NextResponse.json({ book, user, loan, borrow, returned })
}