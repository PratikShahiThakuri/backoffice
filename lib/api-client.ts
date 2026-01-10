interface ApiClientOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiClient = async <T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7218';
  const url = `${apiUrl}${endpoint}`;

  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (response.status === 204) {
      return {} as T; // Return an empty object for No Content
    }

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid JSON response' }));
      throw new ApiError(errorData.message || `API error: ${response.statusText}`, response.status);
    }
    
    const text = await response.text();
    if (!text) {
        return {} as T; // Handle empty body for 200 OK
    }

    return JSON.parse(text) as T;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle network errors or other unexpected issues
    throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default apiClient;