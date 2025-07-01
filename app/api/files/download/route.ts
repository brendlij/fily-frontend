import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BASE_DIR = path.join(process.cwd(), "uploads");

export async function GET(request: NextRequest) {
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
    const filePath = path.join(BASE_DIR, safePath);

    if (!filePath.startsWith(BASE_DIR)) {
      return NextResponse.json(
        { error: "Zugriff verweigert" },
        { status: 403 }
      );
    }

    // Prüfe ob Datei existiert
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: "Datei nicht gefunden" },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Download-Fehler:", error);
    return NextResponse.json(
      { error: "Download fehlgeschlagen" },
      { status: 500 }
    );
  }
}
