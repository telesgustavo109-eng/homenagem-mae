import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Estilo = "romantico" | "floral" | "elegante";

function getEstiloConfig(estilo: Estilo) {
  if (estilo === "floral") {
    return {
      pageBg: "bg-gradient-to-b from-rose-100 via-pink-50 to-white",
      cardBg: "bg-white border border-rose-100",
      titleColor: "text-rose-600",
      badgeColor: "text-rose-400",
      boxBg: "bg-rose-50",
      assinaturaBg: "bg-rose-100",
      buttonBg: "bg-rose-500",
      qrText: "Compartilhe esse carinho 🌸",
      emoji: "🌷",
    };
  }

  if (estilo === "elegante") {
    return {
      pageBg: "bg-gradient-to-b from-zinc-200 via-zinc-100 to-white",
      cardBg: "bg-white border border-zinc-200",
      titleColor: "text-zinc-800",
      badgeColor: "text-zinc-500",
      boxBg: "bg-zinc-50",
      assinaturaBg: "bg-zinc-100",
      buttonBg: "bg-zinc-800",
      qrText: "Abra esta homenagem novamente ✨",
      emoji: "🤍",
    };
  }

  return {
    pageBg: "bg-gradient-to-b from-pink-100 via-pink-50 to-white",
    cardBg: "bg-white border border-pink-100",
    titleColor: "text-pink-600",
    badgeColor: "text-pink-400",
    boxBg: "bg-pink-50",
    assinaturaBg: "bg-pink-100",
    buttonBg: "bg-pink-500",
    qrText: "Escaneie para abrir essa surpresa 💖",
    emoji: "💖",
  };
}

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

  const estilo = (data.estilo || "romantico") as Estilo;
  const tema = getEstiloConfig(estilo);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const url = `${baseUrl}/h/${slug}`;
  const qrCode = await QRCode.toDataURL(url);

  return (
    <main className={`min-h-screen ${tema.pageBg} flex items-center justify-center px-6 py-10`}>
      <div className={`w-full max-w-4xl overflow-hidden rounded-[2rem] shadow-2xl ${tema.cardBg}`}>
        {data.imagem_url && (
          <div className="relative">
            <img
              src={data.imagem_url}
              alt="Foto especial"
              className="h-[320px] w-full object-cover md:h-[430px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm uppercase tracking-[0.25em] opacity-90">
                Uma homenagem para
              </p>
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                {data.nome_mae} {tema.emoji}
              </h1>
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${tema.badgeColor}`}>
              Mensagem especial
            </p>

            <h2 className={`mt-2 text-2xl md:text-3xl font-bold ${tema.titleColor}`}>
              Feito com carinho para um momento inesquecível
            </h2>
          </div>

          <div className={`rounded-3xl p-6 md:p-8 shadow-inner mb-8 ${tema.boxBg}`}>
            <p className="text-lg md:text-xl leading-9 text-zinc-700 whitespace-pre-line">
              {data.mensagem}
            </p>
          </div>

          <div className={`mb-10 rounded-2xl p-5 shadow-sm ${tema.assinaturaBg}`}>
            <p className="text-zinc-700 text-lg">
              Com amor,
              <span className={`ml-2 font-bold ${tema.titleColor}`}>
                {data.nome_comprador}
              </span>
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-zinc-100 p-8 text-center shadow-sm">
            <p className={`text-sm font-semibold uppercase tracking-[0.25em] mb-3 ${tema.badgeColor}`}>
              QR Code
            </p>

            <p className="text-zinc-600 mb-5">{tema.qrText}</p>

            <img
              src={qrCode}
              alt="QR Code"
              className="mx-auto h-44 w-44 rounded-2xl border border-zinc-100 bg-white p-3 shadow"
            />

            <p className="mt-5 break-all text-sm text-zinc-400">{url}</p>

            <div className="mt-6">
              <a
                href={url}
                className={`inline-block rounded-xl px-6 py-3 font-semibold text-white ${tema.buttonBg}`}
              >
                Abrir homenagem
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}