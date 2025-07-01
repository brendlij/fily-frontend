import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const requestedPath = (formData.get("path") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei gefunden" },
        { status: 400 }
      );
    }

    // Sicherheitscheck
    const safePath = path
      .normalize(requestedPath)
      .replace(/^(\.\.[\/\\])+/, "");
    const targetDir = path.join(BASE_DIR, safePath);

    if (!targetDir.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    // Stelle sicher, dass das Zielverzeichnis existiert
    await fs.mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: `${file.name} wurde erfolgreich hochgeladen`,
    });
  } catch (error) {
    console.error("Upload-Fehler:", error);
    return NextResponse.json(
      { error: "Upload fehlgeschlagen" },
      { status: 500 }
    );
  }
}
