"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";

type Homenagem = {
  slug: string;
  nome_mae: string;
  nome_comprador: string;
  mensagem: string;
  imagem_url: string | null;
};

export default function HomenagemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [dados, setDados] = useState<Homenagem | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [abriu, setAbriu] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [tocando, setTocando] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function carregar() {
      const resolvedParams = await params;
      const slugAtual = resolvedParams.slug;
      setSlug(slugAtual);

      const { data, error } = await supabase
        .from("homenagens")
        .select("*")
        .eq("slug", slugAtual)
        .single();

      if (!error && data) {
        setDados(data);

        const baseUrl =
          window.location.origin || "http://localhost:3000";
        const url = `${baseUrl}/h/${slugAtual}`;
        const qr = await QRCode.toDataURL(url);
        setQrCode(qr);
      }

      setCarregando(false);
    }

    carregar();
  }, [params]);

  async function abrirSurpresa() {
    setAbriu(true);

    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
        setTocando(true);
      } catch {
        setTocando(false);
      }
    }
  }

  function alternarMusica() {
    if (!audioRef.current) return;

    if (tocando) {
      audioRef.current.pause();
      setTocando(false);
    } else {
      audioRef.current.play();
      setTocando(true);
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-pink-600">
            Carregando surpresa...
          </p>
        </div>
      </main>
    );
  }

  if (!dados) {
    return (
      <main className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-lg w-full">
          <h1 className="text-3xl font-bold text-pink-600 mb-4">
            Homenagem não encontrada
          </h1>
          <p className="text-zinc-600">
            Não encontramos essa surpresa ou ela ainda não foi liberada.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white px-6 py-10">
      <audio
        ref={audioRef}
        loop
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      />

      {!abriu ? (
        <div className="mx-auto flex min-h-[85vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-[2rem] bg-white/90 backdrop-blur shadow-2xl border border-pink-100 p-10 text-center">
            <div className="mb-6 text-6xl">💖</div>

            <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
              Você recebeu uma surpresa especial
            </h1>

            <p className="text-lg md:text-xl text-zinc-600 mb-8">
              Uma homenagem cheia de carinho foi preparada para você.
            </p>

            <button
              onClick={abrirSurpresa}
              className="rounded-2xl bg-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-pink-600"
            >
              Abrir surpresa
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-pink-100">
            {dados.imagem_url && (
              <div className="relative">
                <img
                  src={dados.imagem_url}
                  alt="Foto especial"
                  className="h-[320px] w-full object-cover md:h-[420px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm uppercase tracking-[0.25em] opacity-90">
                    Uma homenagem para
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                    {dados.nome_mae}
                  </h1>
                </div>
              </div>
            )}

            <div className="p-8 md:p-12">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">
                    Mensagem especial
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold text-zinc-800">
                    Com todo meu carinho 💕
                  </h2>
                </div>

                <button
                  onClick={alternarMusica}
                  className="rounded-xl border border-pink-200 bg-pink-50 px-5 py-3 font-medium text-pink-600 transition hover:bg-pink-100"
                >
                  {tocando ? "Pausar música" : "Tocar música"}
                </button>
              </div>

              <div className="rounded-3xl bg-pink-50 p-6 md:p-8 shadow-inner mb-8">
                <p className="text-lg md:text-xl leading-9 text-zinc-700 whitespace-pre-line">
                  {dados.mensagem}
                </p>
              </div>

              <div className="mb-10 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
                <p className="text-zinc-600 text-lg">
                  Com amor,
                  <span className="ml-2 font-bold text-pink-600">
                    {dados.nome_comprador}
                  </span>
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 p-8 text-center shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400 mb-3">
                  Compartilhe essa surpresa
                </p>

                <p className="text-zinc-600 mb-5">
                  Escaneie o QR Code para abrir esta homenagem novamente.
                </p>

                {qrCode && (
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="mx-auto h-44 w-44 rounded-2xl border border-pink-100 bg-white p-3 shadow"
                  />
                )}

                <p className="mt-5 break-all text-sm text-zinc-400">
                  {window.location.origin}/h/{slug}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}