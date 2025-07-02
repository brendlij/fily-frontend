"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Alert,
  Divider,
  Group,
  Stack,
  ActionIcon,
  Tooltip,
  Select,
  Box,
  useMantineTheme,
  Tabs,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "@/contexts/ThemeContext";
import useAuthStore from "@/store/useAuthStore";
import { Language } from "../lib/translations";
import { ClientOnly } from "./ClientOnly";
import FilyLogo from "./FilyLogo";

export function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const router = useRouter();

  const { login, register, error, isLoading, isAuthenticated, clearError } =
    useAuthStore();
  const { language, t, colorScheme, toggleColorScheme, setLanguage } =
    useTheme();
  const theme = useMantineTheme();

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a redirect URL saved
      const redirectUrl = sessionStorage.getItem("redirectUrl");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectUrl");
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, router]);

  // Check if it's a first-time setup (no users exist)
  // Diese Funktion überprüft, ob bereits Benutzer existieren, und aktualisiert den UI-Status entsprechend
  const checkUsersExist = async () => {
    console.log("[checkUsersExist] Checking if users exist...");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const usersExistUrl = `${baseUrl}/public/users-exist`;
      console.log("[checkUsersExist] Endpoint:", usersExistUrl);

      // Skip this check in development if needed
      if (
        process.env.NODE_ENV === "development" &&
        process.env.SKIP_BACKEND_CHECK === "true"
      ) {
        console.log(
          "[checkUsersExist] Skipping backend check in development mode"
        );
        setIsNewUser(true);
        return false; // Kein echter API-Aufruf gemacht
      }

      // Verwende cache: 'no-store' und mehrere Cache-Kontrollheader
      // Füge einen Timestamp als Query-Parameter hinzu, um sicherzustellen, dass wir aktuelle Daten bekommen
      const timestamp = Date.now();
      const url = `${usersExistUrl}?_=${timestamp}`;

      console.log(
        `[checkUsersExist] Fetching with timestamp ${timestamp}: ${url}`
      );

      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "X-Timestamp": timestamp.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[checkUsersExist] Response at ${timestamp}:`, data);

        // Die API gibt direkt einen booleschen Wert zurück oder hat ein usersExist-Feld
        // Wir müssen beide Fälle abdecken
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

        console.log(`[checkUsersExist] Parsed users exist: ${usersExist}`);

        // Update UI state based on whether users exist
        if (usersExist === true) {
          console.log("[checkUsersExist] Users exist, showing login screen");
          setIsNewUser(false);
        } else {
          console.log(
            "[checkUsersExist] No users exist, showing registration screen"
          );
          setIsNewUser(true);
        }

        return usersExist; // Return the API response for use in calling code
      } else {
        console.warn(
          "[checkUsersExist] Error checking if users exist:",
          response.status
        );
        // Fallback to login screen on error
        setIsNewUser(false);
        return true; // Defensive programming - assume users exist in case of API errors
      }
    } catch (error) {
      console.warn("[checkUsersExist] Connection failed:", error);
      // Show notification about connection issues
      notifications.show({
        title: t("error"),
        message: t("serverConnectionFailed"),
        color: "red",
      });

      // In development mode, we can show registration for easier testing
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[checkUsersExist] Fallback to registration in development mode"
        );
        setIsNewUser(true);
        return false;
      } else {
        // In production, default to login on error
        setIsNewUser(false);
        return true; // Defensive programming - assume users exist in case of errors
      }
    }
  };

  // Initialisierung beim Komponenten-Mount
  useEffect(() => {
    console.log(
      "[Mount] LoginScreen mounted, checking auth status and user existence"
    );

    // Der initiale Check berücksichtigt verschiedene Szenarien
    const initializeLoginScreen = async () => {
      // 0. Überprüfen, ob bereits ein Benutzer registriert wurde (persistent)
      const userRegistered = localStorage.getItem("userRegistered") === "true";
      if (userRegistered) {
        console.log(
          "[Mount] User was registered previously, forcing login screen"
        );
        setIsNewUser(false);
        // Wir könnten hier direkt zurückkehren, aber um sicherzugehen
        // prüfen wir trotzdem die API - setzen aber isNewUser auf false
      }

      // 1. Überprüfen, ob wir uns gerade ausgeloggt haben
      const justLoggedOut = sessionStorage.getItem("justLoggedOut") === "true";

      if (justLoggedOut) {
        console.log("[Mount] Just logged out flag detected, removing flag");
        // Entferne Flag sofort, um Mehrfach-Checks zu vermeiden
        sessionStorage.removeItem("justLoggedOut");

        // Nach einem Logout immer frisch prüfen, ob Benutzer existieren
        console.log("[Mount] Refreshing users existence check after logout");
        await checkUsersExist();

        // Wenn wir wissen, dass Benutzer registriert wurden, bleib im Login-Modus
        if (userRegistered) {
          setIsNewUser(false);
        }
      }
      // 2. Wenn kein Logout-Flag, versuche vorhandenes Token zu laden
      else {
        // Versuche das Token aus localStorage zu laden
        const { loadUserFromToken } = useAuthStore.getState();
        const tokenLoaded = loadUserFromToken();

        console.log(
          "[Mount] Tried to load token from localStorage:",
          tokenLoaded ? "success" : "failed"
        );

        // Wenn kein gültiges Token vorhanden, prüfe Benutzerexistenz
        if (!tokenLoaded) {
          console.log("[Mount] No valid token found, checking if users exist");
          await checkUsersExist();

          // Wenn wir wissen, dass Benutzer registriert wurden, bleib im Login-Modus
          if (userRegistered) {
            setIsNewUser(false);
          }
        }
      }
    };

    initializeLoginScreen();
  }, []);

  // Überwache Änderungen am Authentication-Status
  useEffect(() => {
    console.log(
      "[AuthState] Authentication state changed:",
      isAuthenticated ? "logged in" : "logged out"
    );

    // Wenn wir uns ausgeloggt haben, prüfe die Benutzerexistenz erneut
    if (!isAuthenticated) {
      console.log(
        "[AuthState] Not authenticated, refreshing users-exist check"
      );
      checkUsersExist();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      notifications.show({
        title: t("error"),
        message: t("fillAllFields"),
        color: "red",
      });
      return;
    }

    // For registration, check password confirmation
    if (isNewUser) {
      if (password !== confirmPassword) {
        setPasswordError(t("passwordMismatch"));
        notifications.show({
          title: t("error"),
          message: t("passwordMismatch"),
          color: "red",
        });
        return;
      }

      // Doppelter Sicherheitscheck: Prüfe nochmals, ob wirklich keine Benutzer existieren
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        // Timestamp hinzufügen um Cache zu umgehen
        const timestamp = Date.now();
        const checkResponse = await fetch(
          `${baseUrl}/public/users-exist?_=${timestamp}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              "X-Timestamp": timestamp.toString(),
            },
          }
        );

        if (checkResponse.ok) {
          const data = await checkResponse.json();
          console.log("Double-check before registration, response:", data);

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

          console.log(
            "Double-check before registration, parsed users exist:",
            usersExist
          );

          // Wenn plötzlich Benutzer existieren, verbiete die Registrierung
          if (usersExist) {
            console.log("Users already exist, preventing registration");
            setIsNewUser(false);
            notifications.show({
              title: t("error"),
              message: t("registrationNotAllowed"),
              color: "red",
            });

            // Aktualisiere den UI-Status, damit statt der Registrierungsfelder
            // der Login-Screen angezeigt wird
            await checkUsersExist();
            return;
          }
        }
      } catch (error) {
        console.warn("Failed to verify user existence:", error);
        // Im Fehlerfall abbrechen, um auf der sicheren Seite zu sein
        notifications.show({
          title: t("error"),
          message: t("serverConnectionFailed"),
          color: "red",
        });
        return;
      }
    }

    try {
      if (isNewUser) {
        console.log("[Submit] Attempting registration as first user");

        try {
          // For registration, make the first user an admin
          // This happens on the backend side for the first user
          await register(username, password);

          console.log("[Submit] Registration successful, updating UI state");

          // Nach erfolgreicher Registrierung SOFORT den UI-State aktualisieren
          // Dies ist wichtig, um zu vermeiden, dass weitere Registrierungen möglich sind
          setIsNewUser(false);

          // Speichern, dass mindestens ein Benutzer erstellt wurde
          // Dies hilft auch beim Neuladen der Seite
          localStorage.setItem("userRegistered", "true");

          notifications.show({
            title: t("success"),
            message: t("registrationSuccessful"),
            color: "green",
          });

          // Informiere den Benutzer, dass er als Admin angelegt wurde
          notifications.show({
            title: t("success"),
            message: t("createdAsAdmin"),
            color: "blue",
          });

          // Nach erfolgreicher Registrierung erneut API-Status prüfen
          // Dies stellt sicher, dass der UI-Status aktuell ist
          console.log("[Submit] Verifying user existence after registration");
          const usersExist = await checkUsersExist();
          console.log(`[Submit] Users exist after registration: ${usersExist}`);
        } catch (registrationError) {
          // Log using warn instead of error since we're handling this properly
          console.warn("[Submit] Registration failed:", registrationError);

          // Ensure we have a proper error message
          const errorMessage =
            registrationError instanceof Error
              ? registrationError.message
              : t("loginFailed");

          console.log("[Submit] Registration error message:", errorMessage);

          // Der Fehler wird bereits im Store angezeigt, aber hier können wir zusätzlich
          // eine spezifischere Benachrichtigung anzeigen
          if (
            registrationError instanceof Error &&
            registrationError.message.includes(
              "automatischer Login fehlgeschlagen"
            )
          ) {
            // Wenn nur der Auto-Login fehlgeschlagen ist, trotzdem als Erfolg behandeln
            setIsNewUser(false);
            notifications.show({
              title: t("warning"),
              message: t("registrationSuccessLoginFailed"),
              color: "orange",
              withBorder: true,
              autoClose: 7000,
            });
          } else {
            // For all other registration errors, show error notification
            notifications.show({
              title: t("error"),
              message: errorMessage,
              color: "red",
              withBorder: true,
              autoClose: 5000,
            });
          }
        }
      } else {
        console.log("[Submit] Attempting login");
        try {
          await login(username, password);
          // Nur bei erfolgreichem Login eine Erfolgsmeldung anzeigen
          notifications.show({
            title: t("success"),
            message: t("loginSuccessful"),
            color: "green",
          });
        } catch (loginError) {
          // Log using warn instead of error since we're handling it properly
          console.warn("[Submit] Login failed:", loginError);

          // Ensure we have a proper error message
          const errorMessage =
            loginError instanceof Error ? loginError.message : t("loginFailed");

          console.log("[Submit] Displaying error notification:", errorMessage);

          // Show notification with error message
          notifications.show({
            title: t("error"),
            message: errorMessage,
            color: "red",
            withBorder: true,
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.warn("[Submit] Unexpected error during submission:", error);

      // Create a meaningful error message
      let errorMessage = t("loginFailed");
      if (error instanceof Error) {
        errorMessage = error.message;
        console.warn("[Submit] Error details:", error.stack);
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }

      // Log the error message we're about to show
      console.log("[Submit] Showing error notification:", errorMessage);

      // Display a user-friendly notification
      notifications.show({
        title: t("error"),
        message: errorMessage,
        color: "red",
        withBorder: true,
        autoClose: 5000,
      });
    }
  };

  return (
    <ClientOnly>
      <Box
        style={{
          minHeight: "100vh",
          background: "var(--mantine-color-body)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* Header Controls */}
        <Group
          justify="flex-end"
          style={{ position: "absolute", top: 16, right: 16, gap: 12 }}
        >
          <Tooltip
            label={colorScheme === "dark" ? t("light") : t("dark")}
            position="bottom"
          >
            <ActionIcon
              variant="filled"
              color={`var(--mantine-primary-color-filled)`}
              onClick={toggleColorScheme}
              size="lg"
              style={{
                backgroundColor: `var(--mantine-primary-color-filled)`,
                color: "white",
              }}
            >
              {colorScheme === "dark" ? (
                <IconSun size={18} />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
          </Tooltip>

          <Select
            value={language}
            onChange={(value) => value && setLanguage(value as Language)}
            data={[
              { value: "de", label: "🇩🇪 DE" },
              { value: "en", label: "🇺🇸 EN" },
              { value: "fr", label: "🇫🇷 FR" },
            ]}
            size="sm"
            variant="filled"
            styles={{
              input: {
                backgroundColor:
                  colorScheme === "dark" ? theme.colors.dark[5] : undefined,
                color: colorScheme === "dark" ? theme.white : undefined,
              },
              dropdown: {
                zIndex: 999999,
              },
            }}
          />
        </Group>

        <Box my={40} className="animate-fade-in" style={{ width: "100%" }}>
          <Paper
            withBorder
            shadow="md"
            p={50}
            radius="md"
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            <Group justify="center" mb="xl">
              <Stack align="center" gap="xs">
                <FilyLogo width={120} height={120} />
                <Title order={2} ta="center" style={{ fontWeight: 900 }}>
                  Fily
                </Title>
                <Text size="lg" ta="center" style={{ fontWeight: 600 }}>
                  Organize with a Smile
                </Text>
                <Divider my="sm" mx="auto" w={200} />
                <Text c="dimmed" size="sm" ta="center">
                  {t("signInToContinue")}
                </Text>
              </Stack>
            </Group>

            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                title={t("error")}
                color="red"
                mb="md"
                withCloseButton
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            {!isNewUser ? (
              // Wenn Benutzer existieren, zeige nur den Login-Bereich ohne Tabs
              <Title order={3} mb="md" ta="center">
                {t("login")}
              </Title>
            ) : (
              // Wenn keine Benutzer existieren, zeige nur den Registration-Bereich
              <Title order={3} mb="md" ta="center">
                {t("create")}
              </Title>
            )}

            <form onSubmit={handleSubmit}>
              <Stack>
                <TextInput
                  label={t("username")}
                  placeholder={t("yourUsername")}
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  required
                />
                <PasswordInput
                  label={t("password")}
                  placeholder={t("yourPassword")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.currentTarget.value);
                    setPasswordError("");
                  }}
                  required
                />

                {isNewUser && (
                  <PasswordInput
                    label={t("confirmPassword")}
                    placeholder={t("confirmYourPassword")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.currentTarget.value);
                      setPasswordError("");
                    }}
                    error={passwordError}
                    required
                  />
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  mt="xl"
                  size="md"
                >
                  {isNewUser ? t("create") : t("login")}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Box>
      </Box>
    </ClientOnly>
  );
}
