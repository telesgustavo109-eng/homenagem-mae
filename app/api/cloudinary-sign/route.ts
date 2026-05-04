import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const tipo = body?.tipo === "video" ? "video" : "image";

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary não configurado no servidor." },
        { status: 500 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    const folder =
      tipo === "video"
        ? "homenagens-premium/videos"
        : "homenagens-premium/imagens";

    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      resourceType: tipo,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao gerar assinatura do upload." },
      { status: 500 }
    );
  }
}