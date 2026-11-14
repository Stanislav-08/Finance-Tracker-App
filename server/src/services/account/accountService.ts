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
export async function getAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    select: { id: true, name: true, currency: true, balance: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    select: { id: true, name: true, type: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

export async function createTransaction(
  userId: string,
  data: {
    accountId: string;
    categoryId?: string | null;
    amount: number;
    type: "income" | "expense";
    merchant?: string | null;
    description?: string | null;
    date: Date;
  }
) {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: { id: data.accountId, userId },
    });

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    const transaction = await tx.transaction.create({
      data: {
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId || null,
        amount: data.amount,
        type: data.type,
        merchant: data.merchant || null,
        description: data.description || null,
        date: data.date,
      },
    });

    await tx.account.update({
      where: { id: data.accountId },
      data: {
        balance: {
          [data.type === "income" ? "increment" : "decrement"]: data.amount,
        },
      },
    });

    return transaction;
  });
}

export async function updateMonthlyContribution(
  userId: string,
  amount: number
) {
  await prisma.user.update({
    where: { id: userId },
    data: { monthlyContribution: amount },
  });

  return amount;
}

export async function getBudgets(userId: string, month: number, year: number) {
  return prisma.budget.findMany({
    where: { userId, month, year },
    select: { id: true, categoryId: true, amount: true, month: true, year: true },
  });
}

export async function upsertBudget(
  userId: string, categoryId: string, month: number, year: number, amount: number
) {
  const existing = await prisma.budget.findFirst({ where: { userId, categoryId, month, year } });
  if (existing) {
    return prisma.budget.update({ where: { id: existing.id }, data: { amount } });
  }
  return prisma.budget.create({ data: { userId, categoryId, month, year, amount } });
}

export async function depositToGoal(userId: string, goalId: string, amount: number) {
  const result = await prisma.savingsGoal.updateMany({
    where: { id: goalId, userId },
    data: { current: { increment: amount } },
  });
  return result.count > 0;
}

export async function createAccount(userId: string, name: string, currency: string) {
  return prisma.account.create({ data: { userId, name, currency, balance: 0 } });
}

export async function deleteTransaction(userId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const t = await tx.transaction.findFirst({ where: { id, userId } });
    if (!t) return false;
    await tx.account.update({
      where: { id: t.accountId },
      data: { balance: { [t.type === "income" ? "decrement" : "increment"]: t.amount } },
    });
    await tx.transaction.delete({ where: { id } });
    return true;
  });
}

export async function getSubscriptions(userId: string) {
  return prisma.subscription.findMany({ where: { userId }, orderBy: { nextPaymentDate: "asc" } });
}

export async function createSubscription(userId: string, d: {
  name: string; amount: number; currency: string; billingCycle: string; nextPaymentDate: Date;
}) {
  return prisma.subscription.create({ data: { userId, status: "active", ...d } });
}

export async function deleteSubscription(userId: string, id: string) {
  const r = await prisma.subscription.deleteMany({ where: { id, userId } });
  return r.count > 0;
}
