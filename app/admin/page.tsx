"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Group,
  Title,
  Text,
  Button,
  Switch,
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Modal,
  Box,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconKey,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import useAuthStore from "@/store/useAuthStore";
import { useTheme } from "@/contexts/ThemeContext";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

export default function AdminPage() {
  const { t } = useTheme();
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<User[]>("/admin/users");
      setUsers(data);
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: "Failed to load users",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword) {
      notifications.show({
        title: t("error"),
        message: t("fillAllFields"),
        color: "red",
      });
      return;
    }

    try {
      await api.post("/admin/users", {
        username: newUsername,
        password: newPassword,
        isAdmin: newIsAdmin,
      });

      notifications.show({
        title: t("success"),
        message: "User created successfully",
        color: "green",
      });

      setNewUsername("");
      setNewPassword("");
      setNewIsAdmin(false);
      setCreateModalOpen(false);
      fetchUsers();
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: "Failed to create user",
        color: "red",
      });
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      await api.put(`/admin/users/${user.id}/role`, {
        isAdmin: !user.isAdmin,
      });

      notifications.show({
        title: t("success"),
        message: "User role updated",
        color: "green",
      });

      fetchUsers();
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: "Failed to update user role",
        color: "red",
      });
    }
  };

  // Funktion zum Ändern des Passworts eines Benutzers
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");

  const handleChangePassword = async () => {
    if (!selectedUserId || !newUserPassword) {
      notifications.show({
        title: t("error"),
        message: t("fillAllFields"),
        color: "red",
      });
      return;
    }

    try {
      await api.put(`/admin/users/${selectedUserId}/password`, {
        password: newUserPassword,
      });

      notifications.show({
        title: t("success"),
        message: "Password changed successfully",
        color: "green",
      });

      setNewUserPassword("");
      setSelectedUserId(null);
      setChangePasswordModalOpen(false);
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: "Failed to change password",
        color: "red",
      });
    }
  };

  const openChangePasswordModal = (user: User) => {
    setSelectedUserId(user.id);
    setChangePasswordModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user ${user.username}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${user.id}`);

      notifications.show({
        title: t("success"),
        message: "User deleted successfully",
        color: "green",
      });

      fetchUsers();
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: "Failed to delete user",
        color: "red",
      });
    }
  };

  return (
    <AuthGuard requireAuth requireAdmin>
      <Container size="lg" py="xl">
        <Box mb="xl">
          <Group justify="space-between" mb="md">
            <Title order={2}>User Management</Title>
            <Group>
              <Button
                leftSection={<IconArrowLeft size={16} />}
                variant="outline"
                onClick={() => router.push("/")}
              >
                Back to Files
              </Button>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create User
              </Button>
            </Group>
          </Group>
          <Divider mb="lg" />
        </Box>

        <Paper shadow="xs" p="md">
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Username</Table.Th>
                <Table.Th>Admin</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.username}</Table.Td>
                  <Table.Td>
                    <Switch
                      checked={user.isAdmin}
                      onChange={() => handleToggleAdmin(user)}
                      disabled={user.username === "admin"} // Prevent changing the main admin
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        color="blue"
                        size="xs"
                        onClick={() => openChangePasswordModal(user)}
                        disabled={user.username === "admin"} // Optional: Prevent changing main admin password
                      >
                        Change Password
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        leftSection={<IconTrash size={16} />}
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.username === "admin"} // Prevent deleting the main admin
                      >
                        Delete
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
              {users.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={3}>
                    <Text ta="center" fz="sm" fs="italic" c="dimmed">
                      No users found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Create User Modal */}
        <Modal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New User"
          centered
        >
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.currentTarget.value)}
            mb="md"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            mb="md"
            required
          />
          <Switch
            label="Admin privileges"
            checked={newIsAdmin}
            onChange={(e) => setNewIsAdmin(e.currentTarget.checked)}
            mb="xl"
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </Group>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          opened={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
          title="Change User Password"
          centered
        >
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.currentTarget.value)}
            mb="md"
            required
          />
          <Group justify="flex-end">
            <Button
              variant="outline"
              onClick={() => setChangePasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </Group>
        </Modal>
      </Container>
    </AuthGuard>
  );
}
