"use client";

import { useState } from "react";

type Props = {
  fotos: string[];
  tema: {
    titleColor: string;
    badgeColor: string;
    particles: string[];
  };
};

export default function CarrosselInfinito3D({ fotos, tema }: Props) {
  const [atual, setAtual] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!fotos || fotos.length === 0) return null;

  function irPara(index: number) {
    const total = fotos.length;
    setAtual((index + total) % total);
  }

  function proxima() {
    irPara(atual + 1);
  }

  function anterior() {
    irPara(atual - 1);
  }

  function getFoto(offset: number) {
    const total = fotos.length;
    return fotos[(atual + offset + total) % total];
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    setTouchStartX(e.changedTouches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;

    if (diff > 40) proxima();
    if (diff < -40) anterior();

    setTouchStartX(null);
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-pink-900/80 via-pink-600/60 to-pink-300/60 p-6 shadow-2xl">
      <style>{`
        @keyframes float3d {
          0% { transform: translateY(0px) rotate(0deg); opacity: .85; }
          50% { transform: translateY(-18px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: .85; }
        }

        .float3d {
          animation: float3d 4.5s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 opacity-60">
        {tema.particles.map((p, i) => (
          <span
            key={i}
            className="float3d absolute text-3xl md:text-4xl"
            style={{
              left: `${10 + i * 22}%`,
              top: `${12 + (i % 2) * 48}%`,
              animationDelay: `${i * 0.45}s`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="relative z-10 mb-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
          Momentos especiais
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Galeria de memórias
        </h2>
        <p className="mt-1 text-sm text-white/75">
          Arraste para o lado ou toque nas setas
        </p>
      </div>

      <div
        className="relative z-10 mx-auto flex h-[300px] max-w-4xl items-center justify-center md:h-[430px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {fotos.length > 1 && (
          <>
            <img
              src={getFoto(-2)}
              className="absolute left-0 hidden h-44 w-36 rounded-2xl object-cover opacity-25 blur-[1px] md:block"
              style={{
                transform: "perspective(900px) rotateY(45deg) scale(.78)",
              }}
            />

            <img
              src={getFoto(-1)}
              className="absolute left-[7%] h-52 w-40 rounded-2xl object-cover opacity-70 shadow-xl md:h-72 md:w-56"
              style={{
                transform: "perspective(900px) rotateY(35deg) scale(.88)",
              }}
            />

            <img
              src={getFoto(1)}
              className="absolute right-[7%] h-52 w-40 rounded-2xl object-cover opacity-70 shadow-xl md:h-72 md:w-56"
              style={{
                transform: "perspective(900px) rotateY(-35deg) scale(.88)",
              }}
            />

            <img
              src={getFoto(2)}
              className="absolute right-0 hidden h-44 w-36 rounded-2xl object-cover opacity-25 blur-[1px] md:block"
              style={{
                transform: "perspective(900px) rotateY(-45deg) scale(.78)",
              }}
            />
          </>
        )}

        <img
          src={fotos[atual]}
          className="relative z-20 h-64 w-[85%] max-w-xl rounded-3xl border-4 border-white object-cover shadow-2xl md:h-[390px]"
        />

        {fotos.length > 1 && (
          <>
            <button
              onClick={anterior}
              className="absolute left-2 z-30 rounded-full bg-white/90 px-4 py-3 text-3xl font-bold text-pink-600 shadow-lg backdrop-blur"
            >
              ‹
            </button>

            <button
              onClick={proxima}
              className="absolute right-2 z-30 rounded-full bg-white/90 px-4 py-3 text-3xl font-bold text-pink-600 shadow-lg backdrop-blur"
            >
              ›
            </button>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <div className="relative z-10 mt-5 flex justify-center gap-2">
          {fotos.map((_, index) => (
            <button
              key={index}
              onClick={() => irPara(index)}
              className={`h-3 w-3 rounded-full ${
                index === atual ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}