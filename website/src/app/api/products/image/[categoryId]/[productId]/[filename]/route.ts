import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ categoryId: string; productId: string; filename: string }> }
) {
  try {
    const { categoryId, productId, filename } = await props.params;
    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(process.cwd(), "../asset/products", categoryId, productId, decodedFilename);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();
    
    let contentType = "image/png";
    if (ext === ".jpg" || ext === ".jpeg") {
      contentType = "image/jpeg";
    } else if (ext === ".svg") {
      contentType = "image/svg+xml";
    } else if (ext === ".webp") {
      contentType = "image/webp";
    } else if (ext === ".gif") {
      contentType = "image/gif";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving product image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
