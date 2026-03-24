import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/upload/proof
 *
 * Receives a Base64 data URL (signature or photo) from the driver portal
 * and proxies it to your storage backend (CDN / S3-compatible / MinIO).
 *
 * In production: replace the placeholder below with your actual storage
 * upload logic (AWS S3 PutObject, Cloudflare R2, MinIO, etc.).
 *
 * The endpoint returns { url: string } — the public URL of the uploaded file.
 * The driver app then includes this URL in the DeliveryProofRequest body.
 *
 * Security: This endpoint requires the driver JWT via the Authorization header.
 * The gateway validates it before this handler runs.
 */
export async function POST(req: NextRequest) {
  try {
    const { dataUrl, type } = await req.json() as {
      dataUrl: string;
      type:    "signature" | "photo";
    };

    if (!dataUrl || !dataUrl.startsWith("data:")) {
      return NextResponse.json(
        { error: "Invalid data URL" },
        { status: 400 }
      );
    }

    // ── Extract the Base64 payload ──────────────────────────────────────────
    const [header, base64] = dataUrl.split(",");
    if (!header || !base64) {
      return NextResponse.json({ error: "Malformed data URL" }, { status: 400 });
    }

    const mimeType = header.replace("data:", "").replace(";base64", "");
    const buffer   = Buffer.from(base64, "base64");
    const ext      = mimeType.includes("png") ? "png" : "jpg";
    const filename = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // ── TODO: Replace this placeholder with real storage upload ─────────────
    //
    // Example for AWS S3:
    //   const s3 = new S3Client({ region: process.env.AWS_REGION });
    //   await s3.send(new PutObjectCommand({
    //     Bucket:      process.env.S3_BUCKET,
    //     Key:         `delivery-proofs/${filename}`,
    //     Body:        buffer,
    //     ContentType: mimeType,
    //     ACL:         "public-read",
    //   }));
    //   const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/delivery-proofs/${filename}`;
    //
    // Example for MinIO (local dev):
    //   const minioClient = new Client({ endPoint: "localhost", port: 9000, ... });
    //   await minioClient.putObject("delivery-proofs", filename, buffer, buffer.length, { "Content-Type": mimeType });
    //   const url = `http://localhost:9000/delivery-proofs/${filename}`;
    //
    // For now, we return a placeholder URL. Swap this line in production.
    // ────────────────────────────────────────────────────────────────────────

    const placeholderUrl = `/uploads/delivery-proofs/${filename}`;

    return NextResponse.json({ url: placeholderUrl }, { status: 200 });

  } catch (error) {
    console.error("[upload/proof] Error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
