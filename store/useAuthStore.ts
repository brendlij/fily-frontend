import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

// Define the shape of our JWT payload
interface JwtPayload {
  sub: string; // username
  exp: number; // expiration timestamp
  isAdmin: boolean;
  // Add other claims as needed
}

// Define our auth store state
interface AuthState {
  token: string | null;
  username: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUserFromToken: () => boolean;
  clearError: () => void;
}

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
console.log("Auth store initialized with API URL:", API_URL);

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  username: null,
  isAdmin: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      console.log("[AuthStore] Attempting login for user:", username);
      console.log("[AuthStore] Using API URL:", API_URL);
      console.log("[AuthStore] Full login URL:", `${API_URL}/auth/login`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("[AuthStore] Login response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Login fehlgeschlagen!";

        try {
          const text = await response.text();
          console.log("[AuthStore] Login error response text:", text);

          if (text) {
            try {
              const errorData = JSON.parse(text);
              if (errorData && errorData.message) {
                errorMessage = errorData.message;
                console.log("[AuthStore] Login error details:", errorData);
              }
            } catch (jsonError) {
              // Kein JSON, sondern normaler Text
              if (text.length > 0 && !text.includes("<!DOCTYPE html>")) {
                errorMessage = text;
              }
              console.log("[AuthStore] Login error text (not JSON):", text);
            }
          }
        } catch (parseError) {
          console.warn("[AuthStore] Error reading error response:", parseError);
        }

        // Fehler im Store setzen
        set({
          error: errorMessage,
          isLoading: false,
        });

        // Fehler werfen, um ihn im LoginScreen abfangen zu können
        console.log(`[AuthStore] Login failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Erfolgreich eingeloggt
      const data = await response.json();
      console.log("[AuthStore] Login successful, received token");
      const { token } = data;

      if (!token) {
        const errorMessage = "No token received from server";
        console.log(`[AuthStore] ${errorMessage}`);
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }

      try {
        // Decode token to get user info
        const payload = jwtDecode<JwtPayload>(token);
        console.log("[AuthStore] Token decoded, username:", payload.sub);

        // Store token in localStorage
        localStorage.setItem("auth_token", token);

        set({
          token,
          username: payload.sub,
          isAdmin: payload.isAdmin,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (tokenError) {
        console.warn("[AuthStore] Token decoding error:", tokenError);
        const errorMessage = "Invalid token format received from server";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.warn("[AuthStore] Login error:", error);

      // Special handling for network errors
      const errorMessage =
        error instanceof Error
          ? error.message === "Failed to fetch"
            ? "Keine Verbindung zum Server möglich. Bitte überprüfen Sie die Verbindung und den Server-Status."
            : error.message
          : "Ein unbekannter Fehler ist aufgetreten";

      // Fehler im Store setzen
      set({
        error: errorMessage,
        isLoading: false,
      });

      // Fehler werfen, damit er im LoginScreen abgefangen werden kann
      console.log(`[AuthStore] Login failed with message: ${errorMessage}`);
      throw error instanceof Error ? error : new Error(errorMessage);
    }
  },

  register: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      console.log("[AuthStore] Starting registration process for:", username);

      // Prüfen, ob es der erste Benutzer ist (über den neuen Endpunkt)
      // Cache umgehen mit mehreren Strategien
      const timestamp = Date.now();
      const url = `${API_URL}/public/users-exist?_=${timestamp}`;
      console.log(
        `[AuthStore] Checking users-exist with timestamp ${timestamp}: ${url}`
      );

      const checkResponse = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0", // RFC 1123 date format
          "X-Timestamp": timestamp.toString(),
        },
      });

      if (!checkResponse.ok) {
        console.warn(
          `[AuthStore] Failed to check users-exist: ${checkResponse.status}`
        );
        throw new Error("Failed to check if users exist");
      }

      const data = await checkResponse.json();
      console.log("[AuthStore] Users exist check response:", data);

      // Die API kann einen booleschen Wert oder ein Objekt mit usersExist zurückgeben
      let usersExist;

      if (typeof data === "boolean") {
        // API gibt direkt true/false zurück
        usersExist = data;
      } else if (data && typeof data === "object") {
        // API gibt ein Objekt mit usersExist-Feld zurück
        usersExist = data.usersExist;

        // Falls das usersExist-Feld nicht existiert, aber das Objekt selbst da ist,
        // nehmen wir an, dass das Objekt selbst den Status repräsentiert
        if (usersExist === undefined && Object.keys(data).length > 0) {
          usersExist = true;
        }
      }

      console.log("[AuthStore] Parsed users exist:", usersExist);

      // Wenn bereits Benutzer existieren, verbiete die Registrierung
      if (usersExist) {
        console.log("[AuthStore] Registration rejected - users already exist");
        throw new Error("Registration is not allowed as users already exist");
      }

      console.log(
        "[AuthStore] No users exist, proceeding with registration as admin"
      );

      // Registration request mit isAdmin=true für den ersten Benutzer
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          isAdmin: true, // Erster Benutzer wird immer Admin
        }),
      });

      if (!response.ok) {
        let errorMessage = "Registrierung fehlgeschlagen!";
        try {
          const text = await response.text();
          console.log("[AuthStore] Registration error response text:", text);

          if (text) {
            try {
              const errorData = JSON.parse(text);
              if (errorData && errorData.message) {
                errorMessage = errorData.message;
              }
              console.log("[AuthStore] Registration error details:", errorData);
            } catch (jsonError) {
              // Kein JSON, sondern normaler Text
              if (text.length > 0 && !text.includes("<!DOCTYPE html>")) {
                errorMessage = text;
              }
              console.log(
                "[AuthStore] Registration error text (not JSON):",
                text
              );
            }
          }
        } catch (e) {
          console.warn("[AuthStore] Failed to parse error response:", e);
        }

        // Fehler im Store setzen
        set({
          error: errorMessage,
          isLoading: false,
        });

        // Fehler werfen, um ihn im LoginScreen abfangen zu können
        throw new Error(errorMessage);
      }

      console.log(
        "[AuthStore] Registration successful, automatically logging in"
      );

      // Nach erfolgreicher Registrierung das localStorage-Flag setzen
      // Dies informiert auch nach Neuladen, dass ein Benutzer existiert
      localStorage.setItem("userRegistered", "true");

      try {
        // After successful registration, login automatically
        await get().login(username, password);
      } catch (loginError) {
        console.log(
          "[AuthStore] Auto-login after registration failed:",
          loginError
        );

        // Trotzdem eine Erfolgsmeldung für die Registrierung setzen
        // Da der Login-Fehler separat behandelt wird
        set({ isLoading: false });

        // Create a meaningful error message
        let errorMessage =
          "Registrierung erfolgreich, aber automatischer Login fehlgeschlagen.";
        if (loginError instanceof Error) {
          console.log(
            "[AuthStore] Auto-login error details:",
            loginError.message
          );
          // Include original error message for better debugging
          errorMessage += ` (${loginError.message})`;
        }

        // Fehler werfen, damit im UI eine entsprechende Meldung angezeigt werden kann
        console.log(
          `[AuthStore] Registration successful but auto-login failed: ${errorMessage}`
        );
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.warn("[AuthStore] Registration error:", error);

      // Fehler im Store setzen
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Ein unbekannter Fehler ist aufgetreten";

      // Include more detailed logging for debugging
      if (error instanceof Error && error.stack) {
        console.log("[AuthStore] Registration error details:", error.message);
      }

      set({
        error: errorMessage,
        isLoading: false,
      });

      // Fehler werfen, damit er im LoginScreen abgefangen werden kann
      console.log(
        `[AuthStore] Registration failed with message: ${errorMessage}`
      );
      throw error instanceof Error ? error : new Error(errorMessage);
    }
  },

  logout: () => {
    console.log("[AuthStore] Logging out user");

    // Hole Username für Logging
    const username = useAuthStore.getState().username;
    console.log(`[AuthStore] Logging out user: ${username || "unknown"}`);

    // Remove token from localStorage
    localStorage.removeItem("auth_token");

    // Clean up any registration flags
    sessionStorage.removeItem("userRegistered");

    // Reset state
    set({
      token: null,
      username: null,
      isAdmin: false,
      isAuthenticated: false,
      error: null,
    });

    // Set a flag in sessionStorage to indicate we've just logged out
    // This can be used by the LoginScreen to refresh the users-exist check
    sessionStorage.setItem("justLoggedOut", "true");
    console.log("[AuthStore] Set justLoggedOut flag in sessionStorage");

    // Logging für Debugging
    setTimeout(() => {
      const flag = sessionStorage.getItem("justLoggedOut");
      console.log(
        `[AuthStore] Verified justLoggedOut flag in sessionStorage: ${flag}`
      );
    }, 50);
  },

  loadUserFromToken: () => {
    // Only run on client-side
    if (typeof window === "undefined") {
      console.log("[AuthStore] loadUserFromToken called on server, skipping");
      return false;
    }

    console.log("[AuthStore] Attempting to load user from token");
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.log("[AuthStore] No token found in localStorage");
      return false;
    }

    try {
      // Decode and verify the token
      console.log("[AuthStore] Token found, decoding");
      const payload = jwtDecode<JwtPayload>(token);

      // Validate required token fields
      if (!payload || !payload.sub) {
        console.log("[AuthStore] Token missing required fields:", payload);
        localStorage.removeItem("auth_token");
        return false;
      }

      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        // Token is expired, remove it and return false
        console.log("[AuthStore] Token expired, removing");
        console.log(
          `[AuthStore] Token expired at: ${new Date(
            payload.exp * 1000
          ).toLocaleString()}`
        );
        localStorage.removeItem("auth_token");
        return false;
      }

      console.log(
        `[AuthStore] Valid token for user: ${payload.sub}, isAdmin: ${payload.isAdmin}`
      );
      console.log(
        `[AuthStore] Token expires: ${new Date(
          payload.exp * 1000
        ).toLocaleString()}`
      );

      // Token is valid, update state
      set({
        token,
        username: payload.sub,
        isAdmin: payload.isAdmin !== undefined ? payload.isAdmin : false,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      // If there's an error decoding the token, remove it
      console.log("[AuthStore] Error decoding token:", error);
      if (error instanceof Error) {
        console.log("[AuthStore] Token error details:", error.message);
      }
      localStorage.removeItem("auth_token");
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
