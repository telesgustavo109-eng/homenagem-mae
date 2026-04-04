import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function HomenagemPage({ params }: PageProps) {
  const { slug } = params;

  const { data, error } = await supabase
    .from("homenagens")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const url = `${baseUrl}/h/${slug}`;
  const qrCode = await QRCode.toDataURL(url);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex items-center justify-center px-6 py-10">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center">

        {data.imagem_url && (
          <img
            src={data.imagem_url}
            className="w-full h-80 object-cover"
          />
        )}

        <div className="p-8">

          <h1 className="text-4xl font-bold text-pink-600 mb-4">
            Para {data.nome_mae} 💖
          </h1>

          <p className="text-lg text-zinc-700 mb-6 whitespace-pre-line">
            {data.mensagem}
          </p>

          <div className="bg-pink-100 rounded-xl p-4 mb-6">
            <p className="text-zinc-700">
              Com amor, <b>{data.nome_comprador}</b>
            </p>
          </div>

          <p className="text-sm text-zinc-500 mb-3">
            Escaneie o QR Code
          </p>

          <img
            src={qrCode}
            className="mx-auto w-40 h-40"
          />

        </div>
      </div>
    </main>
  );
}