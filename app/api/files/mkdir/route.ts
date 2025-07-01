import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedPath = body.path;

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
    const dirPath = path.join(BASE_DIR, safePath);

    if (!dirPath.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    await fs.mkdir(dirPath, { recursive: true });

    return NextResponse.json({
      success: true,
      message: "Ordner wurde erfolgreich erstellt",
    });
  } catch (error) {
    console.error("Fehler beim Erstellen des Ordners:", error);
    return NextResponse.json(
      { error: "Ordner konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
