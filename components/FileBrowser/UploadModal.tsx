"use client";

import { Group, Modal, Progress, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

interface UploadModalProps {
  opened: boolean;
  onClose: () => void;
  onUpload: (files: any[]) => void;
  isUploading: boolean;
  uploadProgress: number;
  currentUploadFile: string;
}

export function UploadModal({
  opened,
  onClose,
  onUpload,
  isUploading,
  uploadProgress,
  currentUploadFile,
}: UploadModalProps) {
  const { t } = useTheme();

  return (
    <Modal
      opened={opened}
      onClose={() => !isUploading && onClose()}
      title={t("uploadFilesModal")}
      transitionProps={{
        transition: "slide-up",
        duration: 300,
        timingFunction: "ease-out",
      }}
      closeOnClickOutside={!isUploading}
      closeOnEscape={!isUploading}
    >
      <Stack>
        {isUploading ? (
          <Stack>
            <Text size="sm" c="dimmed" ta="center">
              {currentUploadFile && `${t("uploading")}: ${currentUploadFile}`}
            </Text>
            <Progress
              value={uploadProgress}
              size="lg"
              radius="md"
              animated
              color="blue"
              style={{ transition: "all 0.3s ease" }}
            />
            <Text size="xs" c="dimmed" ta="center">
              {uploadProgress}% {t("completed")}
            </Text>
          </Stack>
        ) : (
          <Dropzone
            onDrop={onUpload}
            multiple
            style={{
              transition: "all 0.2s ease",
              border: "2px dashed var(--mantine-primary-color-4)",
              borderRadius: "var(--mantine-radius-md)",
              backgroundColor: "var(--mantine-color-gray-0)",
              padding: "2rem",
            }}
            styles={{
              inner: {
                pointerEvents: "all",
              },
            }}
          >
            <Group justify="center" mb="md">
              <IconUpload size={32} color="var(--mantine-primary-color-6)" />
            </Group>
            <Text ta="center" size="lg" mb="md" fw={500}>
              {t("dragDropFiles")}
            </Text>
            <Text ta="center" size="sm" c="dimmed">
              {t("multipleSupported")}
            </Text>
          </Dropzone>
        )}
      </Stack>
    </Modal>
  );
}
