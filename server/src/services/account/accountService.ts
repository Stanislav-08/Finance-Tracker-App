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

export async function getMonthlyContribution(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      monthlyContribution: true,
    },
  });

  return Number(user?.monthlyContribution ?? 0);
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

export async function getSavingsGoals(userId: string) {
  const savingsGoals = await prisma.savingsGoal.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      categoryId: true,
      name: true,
      target: true,
      current: true,
      deadline: true,
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      deadline: "asc",
    },
  });

  return savingsGoals;
}

export async function createSavingsGoal(
  userId: string,
  name: string,
  categoryId: string,
  target: number,
  deadline: Date
) {
  const savingsGoal = await prisma.savingsGoal.create({
    data: {
      userId,
      name,
      categoryId,
      target,
      current: 0,
      deadline,
    },
    select: {
      id: true,
      categoryId: true,
      name: true,
      target: true,
      current: true,
      deadline: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return savingsGoal;
}