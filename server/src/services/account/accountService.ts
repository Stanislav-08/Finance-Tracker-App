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

export async function getTotalSavings(userId: string) {
  const savingsGoals = await prisma.savingsGoal.findMany({
    where: {
      userId,
    },
    select: {
      current: true,
    },
  });

  return savingsGoals.reduce(
    (total, goal) => total + Number(goal.current),
    0
  );
}

export async function getTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      accountId: true,
      categoryId: true,
      amount: true,
      type: true,
      merchant: true,
      description: true,
      date: true,
      createdAt: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions;
}