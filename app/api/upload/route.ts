import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const tipo = (formData.get("tipo") as string | null) || "imagem";

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const resourceType = tipo === "video" ? "video" : "image";
    const folder =
      tipo === "video" ? "homenagens-maes/videos" : "homenagens-maes/imagens";

    const resultado = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Erro ao enviar arquivo"));
              return;
            }

            resolve({ secure_url: result.secure_url });
          }
        );

        stream.end(buffer);
      }
    );

    return NextResponse.json({ url: resultado.secure_url });
  } catch (error) {
    console.error("Erro no upload:", error);

    return NextResponse.json(
      { error: "Erro interno ao fazer upload." },
      { status: 500 }
    );
  }
}