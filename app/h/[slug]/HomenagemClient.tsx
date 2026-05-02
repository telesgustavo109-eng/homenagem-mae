"use client";

import CarrosselInfinito3D from "./Carrossel3D";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Playfair_Display,
  Dancing_Script,
  Cinzel,
  Poppins,
  Cormorant_Garamond,
  Great_Vibes,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

type Estilo =
  | "romantico"
  | "floral"
  | "elegante"
  | "aniversario"
  | "namoro"
  | "avo";

type Props = {
  nomeMae: string;
  nomeComprador: string;
  mensagem: string;
  estilo: Estilo;
  fotos: string[];
  videoUrl: string | null;
  musicaUrl: string | null;
  musicaNome: string | null;
};

function getTema(estilo: Estilo) {
  if (estilo === "floral") {
    return {
      pageBg: "from-rose-100 via-pink-50 to-white",
      cardBg: "bg-white/90 border border-rose-100",
      titleColor: "text-rose-600",
      badgeColor: "text-rose-400",
      softBox: "bg-rose-50",
      assinaturaBg: "bg-rose-100",
      button: "bg-rose-500 hover:bg-rose-600",
      accent: "rose",
      emoji: "🌷",
      particles: ["🌸", "🌷", "🌹", "🌼"],
      titleFont: greatVibes.className,
      subtitleFont: cormorant.className,
      messageFont: cormorant.className,
      signFont: dancing.className,
    };
  }

  if (estilo === "elegante") {
    return {
      pageBg: "from-zinc-200 via-zinc-100 to-white",
      cardBg: "bg-white/95 border border-zinc-200",
      titleColor: "text-zinc-800",
      badgeColor: "text-zinc-500",
      softBox: "bg-zinc-50",
      assinaturaBg: "bg-zinc-100",
      button: "bg-zinc-800 hover:bg-zinc-900",
      accent: "zinc",
      emoji: "✨",
      particles: ["✦", "✧", "⋆", "✨"],
      titleFont: cinzel.className,
      subtitleFont: cormorant.className,
      messageFont: cormorant.className,
      signFont: cinzel.className,
    };
  }

  if (estilo === "aniversario") {
    return {
      pageBg: "from-orange-100 via-pink-50 to-white",
      cardBg: "bg-white/95 border border-orange-100",
      titleColor: "text-orange-600",
      badgeColor: "text-orange-400",
      softBox: "bg-orange-50",
      assinaturaBg: "bg-orange-100",
      button: "bg-orange-500 hover:bg-orange-600",
      accent: "orange",
      emoji: "🎉",
      particles: ["🎉", "🎈", "🎊", "✨"],
      titleFont: poppins.className,
      subtitleFont: poppins.className,
      messageFont: poppins.className,
      signFont: poppins.className,
    };
  }

  if (estilo === "namoro") {
    return {
      pageBg: "from-fuchsia-100 via-pink-50 to-white",
      cardBg: "bg-white/95 border border-fuchsia-100",
      titleColor: "text-fuchsia-600",
      badgeColor: "text-fuchsia-400",
      softBox: "bg-fuchsia-50",
      assinaturaBg: "bg-fuchsia-100",
      button: "bg-fuchsia-500 hover:bg-fuchsia-600",
      accent: "fuchsia",
      emoji: "💘",
      particles: ["💘", "💕", "💞", "💖"],
      titleFont: dancing.className,
      subtitleFont: cormorant.className,
      messageFont: cormorant.className,
      signFont: greatVibes.className,
    };
  }

  if (estilo === "avo") {
    return {
      pageBg: "from-violet-100 via-pink-50 to-white",
      cardBg: "bg-white/95 border border-violet-100",
      titleColor: "text-violet-600",
      badgeColor: "text-violet-400",
      softBox: "bg-violet-50",
      assinaturaBg: "bg-violet-100",
      button: "bg-violet-500 hover:bg-violet-600",
      accent: "violet",
      emoji: "💜",
      particles: ["💜", "🌸", "✨", "🫶"],
      titleFont: cormorant.className,
      subtitleFont: cormorant.className,
      messageFont: cormorant.className,
      signFont: greatVibes.className,
    };
  }

  return {
    pageBg: "from-pink-100 via-pink-50 to-white",
    cardBg: "bg-white/95 border border-pink-100",
    titleColor: "text-pink-600",
    badgeColor: "text-pink-400",
    softBox: "bg-pink-50",
    assinaturaBg: "bg-pink-100",
    button: "bg-pink-500 hover:bg-pink-600",
    accent: "pink",
    emoji: "💖",
    particles: ["💖", "💕", "💗", "💞"],
    titleFont: playfair.className,
    subtitleFont: cormorant.className,
    messageFont: cormorant.className,
    signFont: dancing.className,
  };
}

export default function HomenagemClient({
  nomeMae,
  nomeComprador,
  mensagem,
  estilo,
  fotos,
  videoUrl,
  musicaUrl,
  musicaNome,
}: Props) {
  const tema = useMemo(() => getTema(estilo), [estilo]);

  const [abriu, setAbriu] = useState(false);
  const [etapa, setEtapa] = useState<"intro" | "video" | "conteudo">("intro");
  const [tocando, setTocando] = useState(false);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (etapa !== "video" || !videoRef.current) return;

    videoRef.current
      .play()
      .then(() => {
        //
      })
      .catch(() => {
        //
      });
  }, [etapa]);

  async function iniciarMusica() {
    if (!musicRef.current || !musicaUrl) return;

    try {
      musicRef.current.volume = 0.5;
      await musicRef.current.play();
      setTocando(true);
    } catch {
      setTocando(false);
    }
  }

  async function abrirSurpresa() {
    setAbriu(true);

    if (videoUrl) {
      setEtapa("video");
    } else {
      setEtapa("conteudo");
      await iniciarMusica();
    }
  }

  async function pularVideo() {
    setEtapa("conteudo");
    await iniciarMusica();
  }

  async function onVideoEnded() {
    setEtapa("conteudo");
    await iniciarMusica();
  }

  function toggleMusica() {
    if (!musicRef.current) return;

    if (tocando) {
      musicRef.current.pause();
      setTocando(false);
    } else {
      musicRef.current
        .play()
        .then(() => setTocando(true))
        .catch(() => {
          //
        });
    }
  }

  function proximaFoto() {
    if (fotos.length <= 1) return;
    setFotoAtual((prev) => (prev + 1) % fotos.length);
  }

  function fotoAnterior() {
    if (fotos.length <= 1) return;
    setFotoAtual((prev) => (prev - 1 + fotos.length) % fotos.length);
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(e.changedTouches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;

    if (diff > 40) proximaFoto();
    if (diff < -40) fotoAnterior();

    setTouchStartX(null);
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b ${tema.pageBg} px-4 py-6 md:px-6 md:py-10`}>
      {musicaUrl && <audio ref={musicRef} src={musicaUrl} loop />}

      <style>{`
        @keyframes floatSoft {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.9; }
          50% { transform: translateY(-18px) rotate(6deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 0.9; }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 30px rgba(255,255,255,0.35); }
          100% { box-shadow: 0 0 0 rgba(255,255,255,0.2); }
        }

        .anim-float-soft {
          animation: floatSoft 4.8s ease-in-out infinite;
        }

        .anim-fade-up {
          animation: fadeUp 0.8s ease forwards;
        }

        .anim-pulse-glow {
          animation: pulseGlow 2.8s ease-in-out infinite;
        }
      `}</style>

      {etapa === "intro" && (
        <div className="mx-auto flex min-h-[88vh] max-w-3xl items-center justify-center">
          <div className={`relative w-full overflow-hidden rounded-[2rem] p-8 text-center shadow-2xl backdrop-blur ${tema.cardBg} anim-fade-up md:p-10`}>
            <div className="pointer-events-none absolute inset-0">
              {tema.particles.map((item, index) => (
                <span
                  key={index}
                  className="absolute text-4xl anim-float-soft"
                  style={{
                    left: `${10 + index * 20}%`,
                    top: `${12 + (index % 2) * 35}%`,
                    animationDelay: `${index * 0.5}s`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="relative z-10">
              <div className="mb-6 text-6xl">{tema.emoji}</div>

              <p className={`text-sm font-semibold uppercase tracking-[0.35em] ${tema.badgeColor}`}>
                Surpresa especial
              </p>

              <h1 className={`mt-4 text-4xl md:text-5xl ${tema.titleColor} ${tema.titleFont}`}>
                Você recebeu algo preparado com carinho
              </h1>

              <p className={`mx-auto mt-5 max-w-xl text-lg text-zinc-600 ${tema.subtitleFont}`}>
                Toque no botão abaixo para abrir sua surpresa.
              </p>

              <button
                onClick={abrirSurpresa}
                className={`mt-8 rounded-2xl px-8 py-4 text-lg font-semibold text-white shadow-lg transition ${tema.button} anim-pulse-glow`}
              >
                Abrir surpresa
              </button>
            </div>
          </div>
        </div>
      )}

      {etapa === "video" && (
        <div className="mx-auto max-w-4xl anim-fade-up">
          <div className={`overflow-hidden rounded-[2rem] shadow-2xl ${tema.cardBg}`}>
            <div className="p-6 md:p-8">
              <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${tema.badgeColor}`}>
                Mensagem em vídeo
              </p>

              <h2 className={`mt-3 text-3xl ${tema.titleColor} ${tema.titleFont}`}>
                Para {nomeMae} {tema.emoji}
              </h2>

              <div className="mt-6 overflow-hidden rounded-3xl bg-black shadow-xl">
                <video
                  ref={videoRef}
                  src={videoUrl || undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-auto max-h-[75vh] w-full bg-black"
                  onEnded={onVideoEnded}
                />
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row">
                <button
                  onClick={pularVideo}
                  className={`rounded-xl px-5 py-3 font-semibold text-white ${tema.button}`}
                >
                  Continuar
                </button>

                <p className="self-center text-sm text-zinc-500">
                  Depois do vídeo, a homenagem continua com fotos e mensagem.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {etapa === "conteudo" && (
        <div className="mx-auto max-w-4xl anim-fade-up">
          <div className={`overflow-hidden rounded-[2rem] shadow-2xl ${tema.cardBg}`}>
            {fotos.length > 0 && (
              <div className="p-4 md:p-6">
                <CarrosselInfinito3D fotos={fotos} tema={tema} />
              </div>
            )}

            <div className="p-6 md:p-10">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.25em] ${tema.badgeColor}`}>
                    Mensagem especial
                  </p>

                  <h2 className={`mt-2 text-2xl md:text-3xl ${tema.titleColor} ${tema.titleFont}`}>
                    Feito com carinho para um momento inesquecível
                  </h2>
                </div>

                {musicaUrl && (
                  <button
                    onClick={toggleMusica}
                    className={`rounded-xl px-5 py-3 font-semibold text-white transition ${tema.button}`}
                  >
                    {tocando ? "Pausar música" : "Tocar música"}
                  </button>
                )}
              </div>

              {musicaNome && (
                <p className="mb-6 text-sm text-zinc-500">
                  Tocando agora: {musicaNome}
                </p>
              )}

              <div className={`rounded-3xl p-6 shadow-inner md:p-8 ${tema.softBox}`}>
                <p className={`whitespace-pre-line text-lg leading-9 text-zinc-700 md:text-xl ${tema.messageFont}`}>
                  {mensagem}
                </p>
              </div>

              <div className={`mt-8 rounded-2xl p-5 shadow-sm ${tema.assinaturaBg}`}>
                <p className="text-zinc-700 text-lg">
                  Com amor,
                  <span className={`ml-2 text-2xl ${tema.titleColor} ${tema.signFont}`}>
                    {nomeComprador}
                  </span>
                </p>
              </div>

              <div className="mt-8 text-center">
                <p className={`text-lg ${tema.titleColor} ${tema.signFont}`}>
                  Feito com amor para você {tema.emoji}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}