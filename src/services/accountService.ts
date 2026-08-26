const API_URL = import.meta.env.VITE_API_URL;

export async function getTotalBalance(userId: string) {
  const response = await fetch(`${API_URL}/api/accounts/balance/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch total balance");
  }

  const data = await response.json();

  return data.totalBalance;
}
