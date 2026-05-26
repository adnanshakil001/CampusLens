export interface ApiErrorOptions {
  message: string;
  status: number;
  details?: any;
}

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor({ message, status, details }: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, token, headers: customHeaders, ...customOptions } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Set headers
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (typeof window !== 'undefined') {
    // Attempt to retrieve token from local storage (if stored there) or session
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      headers.set('Authorization', `Bearer ${storedToken}`);
    }
  }

  const response = await fetch(url, {
    headers,
    ...customOptions,
  });

  if (!response.ok) {
    let errorDetails: any = null;
    let errorMessage = 'An error occurred while fetching the data.';
    
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.error || errorMessage;
      errorDetails = errorJson.details || null;
    } catch {
      // Handle non-JSON responses
    }

    throw new ApiError({
      message: errorMessage,
      status: response.status,
      details: errorDetails,
    });
  }

  // Handle empty/204 responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}
