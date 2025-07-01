import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { oldPath, newName } = body;

    if (!oldPath || !newName) {
      return NextResponse.json(
        { error: "Alter Pfad und neuer Name sind erforderlich" },
        { status: 400 }
      );
    }

    // Sicherheitscheck für alten Pfad
    const safeOldPath = path.normalize(oldPath).replace(/^(\.\.[\/\\])+/, "");
    const fullOldPath = path.join(BASE_DIR, safeOldPath);

    if (!fullOldPath.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    // Neuer Pfad im gleichen Verzeichnis
    const parentDir = path.dirname(fullOldPath);
    const fullNewPath = path.join(parentDir, newName);

    if (!fullNewPath.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    await fs.rename(fullOldPath, fullNewPath);

    return NextResponse.json({
      success: true,
      message: "Erfolgreich umbenannt",
    });
  } catch (error) {
    console.error("Fehler beim Umbenennen:", error);
    return NextResponse.json(
      { error: "Umbenennen fehlgeschlagen" },
      { status: 500 }
    );
  }
}
