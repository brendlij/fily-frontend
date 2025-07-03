import useAuthStore from "@/store/useAuthStore";

// Backend API URL - with Next.js rewrites, we use a relative path when empty
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
console.log("API URL in api.ts:", API_URL);

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
}

/**
 * Helper function to make authenticated API requests
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const token = useAuthStore.getState().token;
  const fullUrl = `${API_URL}${endpoint}`;

  console.log(`Making ${options.method || "GET"} request to: ${fullUrl}`);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
    console.log("Using authentication token");
  } else {
    console.log("No authentication token available");
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Add body for non-GET requests
  if (options.body && config.method !== "GET") {
    config.body = JSON.stringify(options.body);
  }

  try {
    // Only log in development mode
    if (process.env.NODE_ENV !== "production") {
      console.log(`Sending request to ${API_URL}${endpoint}`);
    }
    console.log("Current token:", token);
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (process.env.NODE_ENV !== "production") {
      console.log(`Response from ${endpoint}:`, response.status);
    }

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      console.error("Authentication failed - 401 Unauthorized");
      // Logout the user and redirect to login page
      useAuthStore.getState().logout();
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    // Handle other error responses
    if (!response.ok) {
      let errorMsg = `Request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMsg);
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API Request failed:", error);
    // Special handling for network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      console.error("Network error - could not connect to server");
      throw new Error(
        "Verbindung zum Server fehlgeschlagen. Bitte überprüfen Sie, ob der Server läuft und erreichbar ist."
      );
    }
    throw error;
  }
};

// API methods with proper types
export const api = {
  get: <T>(
    endpoint: string,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body: any,
    options: Omit<ApiOptions, "method" | "body"> = {}
  ) => apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  delete: <T>(endpoint: string, options: Omit<ApiOptions, "method"> = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),

  // Neue Funktion zum Verschieben von Dateien
  moveFile: <T>(sourcePath: string, targetPath: string) =>
    apiRequest<T>("/files/move", {
      method: "POST",
      body: { source: sourcePath, target: targetPath },
    }),
};

export default api;
