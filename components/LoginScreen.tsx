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
  Select,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ClientOnly } from "./ClientOnly";
import FilyLogo from "./FilyLogo";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export function LoginScreen({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { language, t, colorScheme, toggleColorScheme, setLanguage } =
    useTheme();
  const theme = useMantineTheme();

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

    setLoading(true);

    try {
      if (username === "admin" && password === "admin") {
        onLogin({ username, password });
        notifications.show({
          title: t("success"),
          message: t("loginSuccessful"),
          color: "green",
        });
      } else {
        notifications.show({
          title: t("error"),
          message: t("invalidCredentials"),
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("loginFailed"),
        color: "red",
      });
    } finally {
      setLoading(false);
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
            onChange={(value) => value && setLanguage(value as "de" | "en")}
            data={[
              { value: "de", label: "🇩🇪 DE" },
              { value: "en", label: "🇺🇸 EN" },
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

        <Container size={420} my={40} className="animate-fade-in">
          <Paper withBorder shadow="md" p={30} radius="md">
            <Group justify="center" mb="xl">
              <Stack align="center" gap="xs">
                <FilyLogo width={100} height={100} />
                <Title order={2} ta="center" style={{ fontWeight: 900 }}>
                  Fily - File Browser
                </Title>
                <Text c="dimmed" size="sm" ta="center">
                  {t("signInToContinue")}
                </Text>
              </Stack>
            </Group>

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
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  mt="xl"
                  size="md"
                >
                  {t("login")}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </ClientOnly>
  );
}
