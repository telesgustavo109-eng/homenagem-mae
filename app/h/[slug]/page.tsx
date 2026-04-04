import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function HomenagemPage({ params }: PageProps) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("homenagens")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const url = `http://localhost:3000/h/${slug}`;
  const qrCode = await QRCode.toDataURL(url);

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 text-center">
        <p className="text-sm text-zinc-500 mb-2">Link da homenagem:</p>
        <p className="text-pink-600 font-semibold mb-6 break-all">{slug}</p>

        <h1 className="text-4xl font-bold text-pink-600 mb-4">
          Para {data.nome_mae} 💖
        </h1>

        {data.imagem_url && (
          <img
            src={data.imagem_url}
            alt="Foto especial"
            className="w-full h-64 object-cover rounded-2xl mb-6"
          />
        )}

        <p className="text-lg text-zinc-700 mb-6">{data.mensagem}</p>

        <div className="bg-pink-100 rounded-2xl p-4 mb-8">
          <p className="text-zinc-700">
            Com amor, <span className="font-bold">{data.nome_comprador}</span>
          </p>
        </div>

        <div className="mt-8">
          <p className="text-sm text-zinc-500 mb-2">
            Escaneie para abrir essa surpresa 💖
          </p>

          <img
            src={qrCode}
            alt="QR Code"
            className="mx-auto w-40 h-40"
          />
        </div>
      </div>
    </main>
  );
}