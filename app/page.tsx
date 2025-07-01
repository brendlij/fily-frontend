"use client";

import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { FileBrowser } from "@/components/FileBrowser";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const handleLogin = (credentials: { username: string; password: string }) => {
    setUser(credentials);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <FileBrowser onLogout={handleLogout} />;
}
