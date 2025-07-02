"use client";

import { FileBrowser } from "@/components/FileBrowser";
import { AuthGuard } from "@/components/AuthGuard";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard requireAuth>
      <FileBrowser onLogout={handleLogout} />
    </AuthGuard>
  );
}
