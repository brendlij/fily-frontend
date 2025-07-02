"use client";

import { Button } from "@mantine/core";
import { IconUserShield } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

export function AdminButton() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();

  if (!isAdmin) {
    return null;
  }

  return (
    <Button
      variant="light"
      onClick={() => router.push("/admin")}
      leftSection={<IconUserShield size={14} />}
      style={{
        transition: "all 0.2s ease",
      }}
    >
      Admin
    </Button>
  );
}
