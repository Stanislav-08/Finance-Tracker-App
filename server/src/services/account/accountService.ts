import prisma from "../../lib/prisma.js";

export async function getTotalBalance(userId: string) {
  const accounts = await prisma.account.findMany({
    where: {
      userId,
    },
    select: {
      balance: true,
    },
  });

  return accounts.reduce(
    (total, account) => total + Number(account.balance),
    0
  );
}