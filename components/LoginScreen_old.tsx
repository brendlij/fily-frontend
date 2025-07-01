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

const colorOptions: {
  value: CustomColorScheme;
  label: { de: string; en: string };
  color: string;
}[] = [
  { value: "blue", label: { de: "Blau", en: "Blue" }, color: "#339af0" },
  { value: "green", label: { de: "Grün", en: "Green" }, color: "#51cf66" },
  { value: "red", label: { de: "Rot", en: "Red" }, color: "#ff6b6b" },
  { value: "grape", label: { de: "Lila", en: "Purple" }, color: "#cc5de8" },
  { value: "orange", label: { de: "Orange", en: "Orange" }, color: "#ff922b" },
  { value: "teal", label: { de: "Türkis", en: "Teal" }, color: "#20c997" },
  { value: "pink", label: { de: "Rosa", en: "Pink" }, color: "#f06595" },
  { value: "cyan", label: { de: "Cyan", en: "Cyan" }, color: "#22b8cf" },
];

export function LoginScreen({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    colorScheme,
    customColor,
    language,
    toggleColorScheme,
    setCustomColor,
    setLanguage,
    t,
  } = useTheme();

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
      <Container size={420} my={40} className="animate-fade-in">
        {/* Settings Bar */}
        <Group justify="flex-end" mb="md">
          <Tooltip
            label={
              showSettings
                ? language === "de"
                  ? "Einstellungen schließen"
                  : "Close settings"
                : language === "de"
                ? "Einstellungen öffnen"
                : "Open settings"
            }
            position="bottom"
          >
            <ActionIcon
              variant="light"
              size="lg"
              onClick={() => setShowSettings(!showSettings)}
              style={{ transition: "all 0.2s ease" }}
            >
              <IconSettings size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Settings Panel */}
        {showSettings && (
          <Card
            withBorder
            p="md"
            mb="lg"
            className="animate-slide-up"
            style={{ transition: "all 0.3s ease" }}
          >
            <Stack gap="md">
              {/* Language Selection */}
              <Group justify="space-between" align="center">
                <Group>
                  <IconLanguage size={16} />
                  <Text size="sm" fw={500}>
                    {t("language")}
                  </Text>
                </Group>
                <Select
                  value={language}
                  onChange={(value) =>
                    value && setLanguage(value as "de" | "en")
                  }
                  data={[
                    { value: "de", label: t("german") },
                    { value: "en", label: t("english") },
                  ]}
                  size="xs"
                  style={{ maxWidth: 120 }}
                />
              </Group>

              <Divider />

              {/* Theme Toggle */}
              <Group justify="space-between" align="center">
                <Group>
                  {colorScheme === "dark" ? (
                    <IconMoon size={16} />
                  ) : (
                    <IconSun size={16} />
                  )}
                  <Text size="sm" fw={500}>
                    {t("theme")}
                  </Text>
                </Group>
                <Switch
                  checked={colorScheme === "dark"}
                  onChange={toggleColorScheme}
                  size="sm"
                  onLabel="🌙"
                  offLabel="☀️"
                />
              </Group>

              <Divider />

              {/* Color Selection */}
              <Group justify="space-between" align="center">
                <Group>
                  <IconPalette size={16} />
                  <Text size="sm" fw={500}>
                    {t("accentColor")}
                  </Text>
                </Group>
                <Group gap="xs">
                  {colorOptions.map((option) => (
                    <Tooltip
                      key={option.value}
                      label={option.label[language]}
                      position="top"
                    >
                      <ColorSwatch
                        color={option.color}
                        size={20}
                        style={{
                          cursor: "pointer",
                          transform:
                            customColor === option.value
                              ? "scale(1.2)"
                              : "scale(1)",
                          transition: "all 0.2s ease",
                          border:
                            customColor === option.value
                              ? "2px solid #000"
                              : "none",
                        }}
                        onClick={() => setCustomColor(option.value)}
                      />
                    </Tooltip>
                  ))}
                </Group>
              </Group>
            </Stack>
          </Card>
        )}

        <Title ta="center" mb="xl" className="animate-slide-up">
          <Group justify="center" align="center" gap="md">
            <FilyLogo size={60} />
            <Text
              size="xl"
              fw={700}
              style={{ color: "var(--mantine-primary-color-6)" }}
            >
              {t("title")}
            </Text>
          </Group>
        </Title>

        <Paper
          withBorder
          shadow="lg"
          p={30}
          mt={30}
          radius="md"
          className="animate-slide-up"
          style={{
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
            border: "1px solid #e9ecef",
            transition: "all 0.3s ease",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label={language === "de" ? "Benutzername" : "Username"}
                placeholder={
                  language === "de" ? "Ihr Benutzername" : "Your username"
                }
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                style={{ transition: "all 0.2s ease" }}
              />

              <PasswordInput
                label={language === "de" ? "Passwort" : "Password"}
                placeholder={
                  language === "de" ? "Ihr Passwort" : "Your password"
                }
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                style={{ transition: "all 0.2s ease" }}
              />

              <Button
                type="submit"
                fullWidth
                mt="xl"
                loading={loading}
                size="md"
                style={{
                  transition: "all 0.2s ease",
                  background:
                    "linear-gradient(45deg, #339af0 0%, #228be6 100%)",
                }}
              >
                {language === "de" ? "Anmelden" : "Login"}
              </Button>

              <Text size="sm" ta="center" mt="md" c="dimmed">
                💡 Demo: admin / admin
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>
    </ClientOnly>
  );
}
