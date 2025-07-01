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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
}

export function LoginScreen({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      notifications.show({
        title: "Fehler",
        message: "Bitte füllen Sie alle Felder aus",
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
          title: "Erfolgreich",
          message: "Anmeldung erfolgreich!",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Fehler",
          message: "Ungültige Anmeldedaten",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: "Anmeldung fehlgeschlagen",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40} className="animate-fade-in">
      <Title ta="center" mb="xl" className="animate-slide-up">
        🗂️ Fily - File Browser
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
              label="Benutzername"
              placeholder="Ihr Benutzername"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
              style={{ transition: "all 0.2s ease" }}
            />

            <PasswordInput
              label="Passwort"
              placeholder="Ihr Passwort"
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
                background: "linear-gradient(45deg, #339af0 0%, #228be6 100%)",
              }}
            >
              Anmelden
            </Button>

            <Text size="sm" ta="center" mt="md" c="dimmed">
              💡 Demo: admin / admin
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
