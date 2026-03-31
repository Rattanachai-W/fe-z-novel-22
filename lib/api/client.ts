const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiFetchOptions = RequestInit & {
  fallbackData?: unknown;
};

export function getApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { fallbackData, headers, ...init } = options;

  try {
    const response = await fetch(getApiUrl(path), {
      ...init,
      headers: {
        Accept: "application/json",
        ...headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const payload = (await tryJson(response)) as { message?: string } | null;
      throw new ApiError(
        payload?.message || `API ${response.status} on ${path}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (fallbackData !== undefined) {
      return fallbackData as T;
    }

    throw error;
  }
}

async function tryJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
