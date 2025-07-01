import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Basis-Verzeichnis für den File Browser (sicherheitshalber begrenzt)
const BASE_DIR = path.join(process.cwd(), "uploads");

// Stelle sicher, dass das Upload-Verzeichnis existiert
async function ensureUploadDir() {
  try {
    await fs.access(BASE_DIR);
  } catch {
    await fs.mkdir(BASE_DIR, { recursive: true });
  }
}

// GET /api/files - Liste Dateien und Ordner
export async function GET(request: NextRequest) {
  try {
    await ensureUploadDir();

    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get("path") || "";

    // Sicherheitscheck: Verhindere Directory Traversal
    const safePath = path
      .normalize(requestedPath)
      .replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(BASE_DIR, safePath);

    // Stelle sicher, dass der Pfad innerhalb des BASE_DIR liegt
    if (!fullPath.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    const items = await fs.readdir(fullPath, { withFileTypes: true });

    const files = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(fullPath, item.name);
        const stats = await fs.stat(itemPath);

        return {
          name: item.name,
          type: item.isDirectory() ? "directory" : "file",
          size: item.isFile() ? stats.size : undefined,
          modified: stats.mtime.toISOString(),
        };
      })
    );

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Fehler beim Laden der Dateien:", error);
    return NextResponse.json(
      { error: "Dateien konnten nicht geladen werden" },
      { status: 500 }
    );
  }
}

// DELETE /api/files - Lösche Datei oder Ordner
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get("path");

    if (!requestedPath) {
      return NextResponse.json(
        { error: "Pfad ist erforderlich" },
        { status: 400 }
      );
    }

    // Sicherheitscheck
    const safePath = path
      .normalize(requestedPath)
      .replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(BASE_DIR, safePath);

    if (!fullPath.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return NextResponse.json(
      { error: "Löschen fehlgeschlagen" },
      { status: 500 }
    );
  }
}
