const API_URL = import.meta.env.VITE_API_URL;

export async function getTotalBalance(userId: string) {
  const response = await fetch(
    `${API_URL}/api/accounts/balance/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch total balance");
  }

  const data = await response.json();

  return data.totalBalance;
}

export async function getTotalSavings(userId: string) {
  const response = await fetch(
    `${API_URL}/api/accounts/savings/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch total savings");
  }

  const data = await response.json();

  return data.totalSavings;
}

export async function getMonthlyContribution(userId: string) {
  const response = await fetch(
    `${API_URL}/api/accounts/monthly-contribution/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch monthly contribution");
  }

  const data = await response.json();

  return data.monthlyContribution;
}

export async function getTransactions(userId: string) {
  const response = await fetch(
    `${API_URL}/api/accounts/transactions/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  const data = await response.json();

  return data.transactions;
}

export async function getSavingsGoals(userId: string) {
  const response = await fetch(
    `${API_URL}/api/accounts/savings-goals/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch savings goals");
  }

  const data = await response.json();

  return data.savingsGoals;
}
