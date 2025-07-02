"use client";

import { useState, useEffect } from "react";
import { Modal, Image, Textarea, Loader, Center } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../../contexts/ThemeContext";

interface FileModalProps {
  opened: boolean;
  onClose: () => void;
  content: {
    url: string;
    type: "image" | "pdf" | "text" | "markdown" | "json" | "video" | null;
    text?: string;
    name?: string;
  } | null;
}

export function FileModal({ opened, onClose, content }: FileModalProps) {
  const { t } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Reset states when content changes
  useEffect(() => {
    if (content?.text) {
      setFileContent(content.text);
    } else {
      setFileContent(null);
    }

    // Reset error when content changes
    setError(null);
  }, [content]);

  // Nur wenn das Modal unmounted wird oder geschlossen wird,
  // soll der aktuell verwendete ObjectURL revoked werden!
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
    // ACHTUNG: Leeres Dependency-Array!
    // Das läuft nur bei Unmount.
  }, []);

  useEffect(() => {
    // Don't fetch if modal is closed or no content
    if (!opened || !content || !content.url) {
      return;
    }

    // Don't fetch if we already have text content
    if (
      content.text &&
      (content.type === "text" ||
        content.type === "markdown" ||
        content.type === "json")
    ) {
      return;
    }

    const token = localStorage.getItem("auth_token");

    // Einheitlicher Ansatz für alle Dateitypen
    setIsLoading(true);
    setError(null);

    fetch(content.url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `${t("fileCouldNotLoad")} (Status: ${response.status})`
          );
        }

        // For text-based files, get content as text
        if (
          content.type === "text" ||
          content.type === "markdown" ||
          content.type === "json"
        ) {
          return response.text().then((text) => {
            setFileContent(text);
            setIsLoading(false);
          });
        }
        // For binary files (images, PDFs), get as blob
        else {
          return response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            setObjectUrl(url);
            setIsLoading(false);
          });
        }
      })
      .catch((err) => {
        console.error("Error loading file:", err);
        setError(err.message || t("fileCouldNotLoad"));
        setIsLoading(false);
      });
  }, [opened, content, t]);

  if (!content) return null;

  const modalTitle = content.name || t("fileViewer");

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center style={{ padding: "50px 0" }}>
          <Loader />
        </Center>
      );
    }

    if (error) {
      return (
        <Center style={{ padding: "50px 0", color: "red" }}>{error}</Center>
      );
    }

    switch (content.type) {
      case "image":
        return objectUrl ? (
          <Image src={objectUrl} alt={content.name} fit="contain" />
        ) : null;

      case "pdf":
        return objectUrl ? (
          <iframe
            src={objectUrl}
            style={{ width: "100%", height: "600px", border: "none" }}
            title={content.name}
          />
        ) : null;

      case "markdown":
        const markdownContent = fileContent || content.text || "";
        return (
          <div
            style={{
              maxHeight: "600px",
              overflowY: "auto",
              padding: 12,
              borderRadius: 4,
              background: "var(--mantine-color-body)",
            }}
          >
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        );

      case "json":
        const jsonContent = fileContent || content.text || "";
        let formattedJson;
        try {
          formattedJson = JSON.stringify(JSON.parse(jsonContent), null, 2);
        } catch (e) {
          formattedJson = t("invalidJsonFormat");
        }

        return (
          <pre
            style={{
              maxHeight: "600px",
              overflowY: "auto",
              background: "var(--mantine-color-gray-0)",
              padding: 12,
              borderRadius: 4,
              fontSize: "0.9rem",
              color: "var(--mantine-color-dark-9)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {formattedJson}
          </pre>
        );

      case "text":
        const textContent = fileContent || content.text || "";
        return (
          <Textarea
            value={textContent}
            readOnly
            autosize
            minRows={10}
            styles={{
              input: {
                fontFamily: "var(--font-geist-mono)",
                fontSize: "0.9rem",
              },
            }}
          />
        );

      case "video":
        return objectUrl ? (
          <video
            src={objectUrl}
            controls
            style={{ width: "100%", maxHeight: "600px", borderRadius: "8px" }}
          />
        ) : null;

      default:
        return (
          <Center style={{ padding: "50px 0" }}>
            {t("unsupportedFileType")}
          </Center>
        );
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} size="xl" title={modalTitle}>
      {renderContent()}
    </Modal>
  );
}
