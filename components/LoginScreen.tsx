"use client";

import { useState } from "react";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Group,
  Stack,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSettings } from "@tabler/icons-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ClientOnly } from "./ClientOnly";
import FilyLogo from "./FilyLogo";
import { LoginSettingsModal } from "./LoginSettingsModal";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export function LoginScreen({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { language, t } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      notifications.show({
        title: t("error"),
        message:
          language === "de"
            ? "Bitte füllen Sie alle Felder aus"
            : "Please fill in all fields",
        color: "red",
      });
      return;
    }

    setLoading(true);

    try {
      // Hier würde normalerweise die Authentifizierung stattfinden
      // Für Demo-Zwecke akzeptieren wir admin/admin
      if (username === "admin" && password === "admin") {
        onLogin({ username, password });
        notifications.show({
          title: t("success"),
          message:
            language === "de" ? "Anmeldung erfolgreich!" : "Login successful!",
          color: "green",
        });
      } else {
        notifications.show({
          title: t("error"),
          message:
            language === "de"
              ? "Ungültige Anmeldedaten"
              : "Invalid credentials",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message:
          language === "de" ? "Anmeldung fehlgeschlagen" : "Login failed",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnly>
      <div style={{ position: "relative" }}>
        <Container 
          size={420} 
          my={40} 
          className="animate-fade-in"
          style={{
            filter: showSettings ? "blur(2px)" : "none",
            transition: "filter 0.3s ease",
          }}
        >
          {/* Settings Button */}
          <Group justify="flex-end" mb="md">
            <Tooltip
              label={
                language === "de" ? "Einstellungen" : "Settings"
              }
              position="bottom"
            >
              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => setShowSettings(true)}
                style={{ transition: "all 0.2s ease" }}
              >
                <IconSettings size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {/* Login Form */}
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Group justify="center" mb="xl">
              <Stack align="center" gap="xs">
                <FilyLogo width={60} height={60} />
                <Title
                  order={2}
                  ta="center"
                  style={{
                    fontFamily: "Greycliff CF, var(--mantine-font-family)",
                    fontWeight: 900,
                    color: "var(--mantine-color-text)", // Normal text color, not accent
                  }}
                >
                  Fily - File Browser
                </Title>
                <Text c="dimmed" size="sm" ta="center">
                  {language === "de" 
                    ? "Melden Sie sich an, um fortzufahren"
                    : "Sign in to continue"
                  }
                </Text>
              </Stack>
            </Group>

            <form onSubmit={handleSubmit}>
              <Stack>
                <TextInput
                  label={language === "de" ? "Benutzername" : "Username"}
                  placeholder={language === "de" ? "Ihr Benutzername" : "Your username"}
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  required
                />
                <PasswordInput
                  label={language === "de" ? "Passwort" : "Password"}
                  placeholder={language === "de" ? "Ihr Passwort" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  mt="xl"
                  size="md"
                  style={{ transition: "all 0.2s ease" }}
                >
                  {language === "de" ? "Anmelden" : "Sign in"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>

        {/* Settings Modal */}
        <LoginSettingsModal 
          opened={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </ClientOnly>
  );
}
