const AUTH_URL =
  process.env.TRUELAYER_AUTH_URL ??
  "https://auth.truelayer-sandbox.com";

const API_URL =
  process.env.TRUELAYER_API_URL ??
  "https://api.truelayer-sandbox.com";

const CLIENT_ID =
  process.env.TRUELAYER_CLIENT_ID;

const CLIENT_SECRET =
  process.env.TRUELAYER_CLIENT_SECRET;

const REDIRECT_URI =
  process.env.TRUELAYER_REDIRECT_URI;

const PROVIDER =
  process.env.TRUELAYER_PROVIDER ??
  "uk-cs-mock";

function requireEnv(
  value: string | undefined,
  name: string
): string {
  if (!value) {
    throw new Error(
      `${name} is not configured in server/.env`
    );
  }

  return value;
}

export function createAuthUrl(): string {
  const clientId = requireEnv(
    CLIENT_ID,
    "TRUELAYER_CLIENT_ID"
  );

  const redirectUri = requireEnv(
    REDIRECT_URI,
    "TRUELAYER_REDIRECT_URI"
  );

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope:
      "info accounts balance transactions offline_access",
    providers: PROVIDER,
  });

  return `${AUTH_URL}/?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string
) {
  const clientId = requireEnv(
    CLIENT_ID,
    "TRUELAYER_CLIENT_ID"
  );

  const clientSecret = requireEnv(
    CLIENT_SECRET,
    "TRUELAYER_CLIENT_SECRET"
  );

  const redirectUri = requireEnv(
    REDIRECT_URI,
    "TRUELAYER_REDIRECT_URI"
  );

  const response = await fetch(
    `${AUTH_URL}/connect/token`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
        Accept: "application/json",
      },

      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `TrueLayer token request failed: ${JSON.stringify(
        data
      )}`
    );
  }

  return data;
}

async function apiRequest<T>(
  endpoint: string,
  accessToken: string
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `TrueLayer API request failed: ${JSON.stringify(
        data
      )}`
    );
  }

  return data as T;
}

export function getAccounts(
  accessToken: string
) {
  return apiRequest(
    "/data/v1/accounts",
    accessToken
  );
}

export function getBalance(
  accessToken: string,
  accountId: string
) {
  return apiRequest(
    `/data/v1/accounts/${accountId}/balance`,
    accessToken
  );
}

export function getTransactions(
  accessToken: string,
  accountId: string
) {
  return apiRequest(
    `/data/v1/accounts/${accountId}/transactions`,
    accessToken
  );
}