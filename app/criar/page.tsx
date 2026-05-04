"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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

type Musica = {
  nome: string;
  url: string;
};

type CloudinaryResponse = {
  secure_url?: string;
  url?: string;
  error?: {
    message?: string;
  };
};

const MUSICAS: Musica[] = [
  {
    nome: "Romântica Suave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    nome: "Delicada Floral",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    nome: "Elegante",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    nome: "Feliz Aniversário",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  },
];

const LIMITE_FOTOS = 4;
const LIMITE_IMAGEM_MB = 10;
const LIMITE_VIDEO_MB = 80;

export default function CriarPage() {
  const router = useRouter();

  const [nomeMae, setNomeMae] = useState("");
  const [nomeComprador, setNomeComprador] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estilo, setEstilo] = useState<Estilo>("romantico");

  const [musicaUrl, setMusicaUrl] = useState(MUSICAS[0].url);
  const [musicaNome, setMusicaNome] = useState(MUSICAS[0].nome);

  const [arquivosFotos, setArquivosFotos] = useState<File[]>([]);
  const [arquivoVideo, setArquivoVideo] = useState<File | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [statusUpload, setStatusUpload] = useState("");

  function gerarSlug(texto: string) {
    const base = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const aleatorio = Math.random().toString(36).slice(2, 8);
    return `${base || "homenagem"}-${aleatorio}`;
  }

  function validarImagem(file: File) {
    const tamanhoMb = file.size / (1024 * 1024);

    if (!file.type.startsWith("image/")) {
      throw new Error(`O arquivo "${file.name}" não é uma imagem válida.`);
    }

    if (tamanhoMb > LIMITE_IMAGEM_MB) {
      throw new Error(
        `A imagem "${file.name}" tem ${tamanhoMb.toFixed(
          1
        )}MB. O limite é ${LIMITE_IMAGEM_MB}MB por foto.`
      );
    }
  }

  function validarVideo(file: File) {
    const tamanhoMb = file.size / (1024 * 1024);

    if (!file.type.startsWith("video/")) {
      throw new Error(`O arquivo "${file.name}" não é um vídeo válido.`);
    }

    if (tamanhoMb > LIMITE_VIDEO_MB) {
      throw new Error(
        `O vídeo tem ${tamanhoMb.toFixed(
          1
        )}MB. O limite atual é ${LIMITE_VIDEO_MB}MB.`
      );
    }
  }

  async function uploadDiretoCloudinary(
    arquivo: File,
    tipo: "imagem" | "video"
  ): Promise<string> {
    const respostaAssinatura = await fetch("/api/cloudinary-sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: tipo === "video" ? "video" : "image",
      }),
    });

    const assinatura = await respostaAssinatura.json();

    if (!respostaAssinatura.ok) {
      throw new Error(
        assinatura?.error || "Erro ao gerar assinatura para upload."
      );
    }

    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("api_key", assinatura.apiKey);
    formData.append("timestamp", String(assinatura.timestamp));
    formData.append("signature", assinatura.signature);
    formData.append("folder", assinatura.folder);

    const resourceType = tipo === "video" ? "video" : "image";

    const endpoint = `https://api.cloudinary.com/v1_1/${assinatura.cloudName}/${resourceType}/upload`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", endpoint);
      xhr.timeout = 300000;

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            if (data.secure_url) {
              resolve(data.secure_url);
            } else {
              reject(
                new Error("Upload feito, mas o Cloudinary não retornou URL.")
              );
            }
          } else {
            reject(
              new Error(
                data?.error?.message ||
                  `Erro no Cloudinary. Status: ${xhr.status}`
              )
            );
          }
        } catch {
          reject(new Error("Erro ao ler resposta do Cloudinary."));
        }
      };

      xhr.onerror = () => {
        reject(
          new Error("Falha de conexão com o Cloudinary durante o upload.")
        );
      };

      xhr.ontimeout = () => {
        reject(
          new Error("Tempo limite excedido ao enviar arquivo para o Cloudinary.")
        );
      };

      xhr.send(formData);
    });
  }

  async function uploadFotos(): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < arquivosFotos.length; i++) {
      const arquivo = arquivosFotos[i];

      setStatusUpload(`Enviando foto ${i + 1} de ${arquivosFotos.length}...`);
      validarImagem(arquivo);

      const url = await uploadDiretoCloudinary(arquivo, "imagem");
      urls.push(url);
    }

    return urls;
  }

  async function uploadVideo(): Promise<string> {
    if (!arquivoVideo) return "";

    setStatusUpload("Enviando vídeo...");
    validarVideo(arquivoVideo);

    const url = await uploadDiretoCloudinary(arquivoVideo, "video");
    return url;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setCarregando(true);
      setStatusUpload("Preparando homenagem...");

      if (!nomeMae.trim()) {
        throw new Error("Preencha o nome da pessoa homenageada.");
      }

      if (!nomeComprador.trim()) {
        throw new Error("Preencha seu nome.");
      }

      if (!mensagem.trim()) {
        throw new Error("Escreva uma mensagem.");
      }

      if (arquivosFotos.length === 0) {
        throw new Error("Adicione pelo menos 1 foto.");
      }

      if (arquivosFotos.length > LIMITE_FOTOS) {
        throw new Error(`Você pode enviar no máximo ${LIMITE_FOTOS} fotos.`);
      }

      const slug = gerarSlug(nomeMae);

      const fotosUrls = await uploadFotos();
      const videoUrl = await uploadVideo();

      setStatusUpload("Salvando homenagem...");

      const { error } = await supabase.from("homenagens").insert({
        slug,
        nome_mae: nomeMae,
        nome_comprador: nomeComprador,
        mensagem,
        estilo,
        foto_1_url: fotosUrls[0] || null,
        foto_2_url: fotosUrls[1] || null,
        foto_3_url: fotosUrls[2] || null,
        foto_4_url: fotosUrls[3] || null,
        imagem_url: fotosUrls[0] || null,
        video_url: videoUrl || null,
        musica_url: musicaUrl,
        musica_nome: musicaNome,
      });

      if (error) {
        throw new Error(error.message);
      }

      setStatusUpload("Homenagem criada com sucesso!");
      router.push(`/h/${slug}`);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro ao salvar homenagem.");
      }
    } finally {
      setCarregando(false);
    }
  }

  const previewFotos = useMemo(() => {
    return arquivosFotos.map((arquivo) => URL.createObjectURL(arquivo));
  }, [arquivosFotos]);

  return (
    <main className="min-h-screen bg-pink-50 px-6 py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-pink-100 bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-pink-600">
            Criar homenagem premium
          </h1>

          <p className="mb-6 text-zinc-600">
            Monte sua surpresa com estilo, fotos, vídeo e música.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Nome da pessoa homenageada
              </label>
              <input
                type="text"
                placeholder="Ex: Eduarda"
                value={nomeMae}
                onChange={(e) => setNomeMae(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Seu nome
              </label>
              <input
                type="text"
                placeholder="Ex: João Filho"
                value={nomeComprador}
                onChange={(e) => setNomeComprador(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Mensagem
              </label>
              <textarea
                rows={5}
                placeholder="Escreva sua mensagem especial..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-zinc-800">
                Escolha o estilo
              </label>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["romantico", "Romântico"],
                  ["floral", "Floral"],
                  ["elegante", "Elegante"],
                  ["aniversario", "Aniversário"],
                  ["namoro", "Namoro"],
                  ["avo", "Avó Especial"],
                ].map(([valor, nome]) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setEstilo(valor as Estilo)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      estilo === valor
                        ? "scale-[1.02] border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                        : "border-zinc-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <p className="font-bold text-pink-600">{nome}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Escolha a música
              </label>
              <select
                value={musicaUrl}
                onChange={(e) => {
                  const musica = MUSICAS.find((m) => m.url === e.target.value);
                  setMusicaUrl(e.target.value);
                  setMusicaNome(musica?.nome || "Música");
                }}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              >
                {MUSICAS.map((musica) => (
                  <option key={musica.url} value={musica.url}>
                    {musica.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Fotos (até 4)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(
                    0,
                    LIMITE_FOTOS
                  );

                  try {
                    files.forEach(validarImagem);
                    setArquivosFotos(files);
                  } catch (error) {
                    setArquivosFotos([]);

                    if (error instanceof Error) {
                      alert(error.message);
                    }
                  }
                }}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-pink-600"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Máximo de {LIMITE_FOTOS} fotos e até {LIMITE_IMAGEM_MB}MB por foto.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Vídeo (1 vídeo)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;

                  if (!file) {
                    setArquivoVideo(null);
                    return;
                  }

                  try {
                    validarVideo(file);
                    setArquivoVideo(file);
                  } catch (error) {
                    setArquivoVideo(null);

                    if (error instanceof Error) {
                      alert(error.message);
                    }
                  }
                }}
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-pink-600"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Máximo de {LIMITE_VIDEO_MB}MB. Use vídeos curtos em MP4 para melhor desempenho.
              </p>
            </div>

            {statusUpload && (
              <div className="rounded-xl bg-pink-50 p-3 text-sm font-medium text-pink-700">
                {statusUpload}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Enviando arquivos..." : "Gerar homenagem premium"}
            </button>
          </form>
        </div>

        <PreviewLateral
          estilo={estilo}
          nomeMae={nomeMae}
          nomeComprador={nomeComprador}
          mensagem={mensagem}
          musicaNome={musicaNome}
          musicaUrl={musicaUrl}
          previewFotos={previewFotos}
          temVideo={!!arquivoVideo}
        />
      </div>
    </main>
  );
}

function PreviewLateral({
  estilo,
  nomeMae,
  nomeComprador,
  mensagem,
  musicaNome,
  musicaUrl,
  previewFotos,
  temVideo,
}: {
  estilo: Estilo;
  nomeMae: string;
  nomeComprador: string;
  mensagem: string;
  musicaNome: string;
  musicaUrl: string;
  previewFotos: string[];
  temVideo: boolean;
}) {
  const nome = nomeMae || "Sua homenagem";
  const de = nomeComprador || "Você";
  const msg =
    mensagem ||
    "Sua mensagem aparecerá aqui no preview, junto com vídeo, fotos e música.";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tocando, setTocando] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setTocando(false);
    }
  }, [musicaUrl]);

  function toggleMusica() {
    if (!audioRef.current) return;

    if (tocando) {
      audioRef.current.pause();
      setTocando(false);
    } else {
      audioRef.current
        .play()
        .then(() => setTocando(true))
        .catch(() => {
          alert("O navegador bloqueou a música. Toque novamente.");
        });
    }
  }

  const tema =
    estilo === "elegante"
      ? {
          bg: "from-zinc-200 via-zinc-100 to-white",
          badge: "text-zinc-500",
          title: "text-zinc-800",
          box: "bg-zinc-50",
          button: "bg-zinc-800 hover:bg-zinc-900",
          titleFont: cinzel.className,
          msgFont: cormorant.className,
          signFont: cinzel.className,
        }
      : estilo === "floral"
      ? {
          bg: "from-rose-100 via-pink-50 to-white",
          badge: "text-rose-400",
          title: "text-rose-600",
          box: "bg-rose-50",
          button: "bg-rose-500 hover:bg-rose-600",
          titleFont: greatVibes.className,
          msgFont: cormorant.className,
          signFont: dancing.className,
        }
      : estilo === "aniversario"
      ? {
          bg: "from-orange-100 via-pink-50 to-white",
          badge: "text-orange-400",
          title: "text-orange-600",
          box: "bg-orange-50",
          button: "bg-orange-500 hover:bg-orange-600",
          titleFont: poppins.className,
          msgFont: poppins.className,
          signFont: poppins.className,
        }
      : estilo === "namoro"
      ? {
          bg: "from-fuchsia-100 via-pink-50 to-white",
          badge: "text-fuchsia-400",
          title: "text-fuchsia-600",
          box: "bg-fuchsia-50",
          button: "bg-fuchsia-500 hover:bg-fuchsia-600",
          titleFont: dancing.className,
          msgFont: cormorant.className,
          signFont: greatVibes.className,
        }
      : estilo === "avo"
      ? {
          bg: "from-violet-100 via-pink-50 to-white",
          badge: "text-violet-400",
          title: "text-violet-600",
          box: "bg-violet-50",
          button: "bg-violet-500 hover:bg-violet-600",
          titleFont: cormorant.className,
          msgFont: cormorant.className,
          signFont: greatVibes.className,
        }
      : {
          bg: "from-pink-100 via-pink-50 to-white",
          badge: "text-pink-400",
          title: "text-pink-600",
          box: "bg-pink-50",
          button: "bg-pink-500 hover:bg-pink-600",
          titleFont: playfair.className,
          msgFont: cormorant.className,
          signFont: dancing.className,
        };

  return (
    <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-lg">
      <audio ref={audioRef} src={musicaUrl} loop />

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-400">
          Preview ao vivo
        </p>

        <button
          type="button"
          onClick={toggleMusica}
          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${tema.button}`}
        >
          {tocando ? "Pausar música" : "Tocar música"}
        </button>
      </div>

      <div
        className={`overflow-hidden rounded-[2rem] bg-gradient-to-b ${tema.bg} border border-zinc-100 shadow-sm`}
      >
        <div className="p-5">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.25em] ${tema.badge}`}
          >
            Prévia do tema
          </p>

          <h3 className={`mt-2 text-3xl ${tema.title} ${tema.titleFont}`}>
            Para {nome}
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Música escolhida: {musicaNome}
          </p>

          {temVideo && (
            <div className="mt-4 rounded-2xl bg-black/90 p-4 text-center text-white">
              🎥 Vídeo especial adicionado
            </div>
          )}

          {previewFotos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {previewFotos.slice(0, 4).map((foto, index) => (
                <img
                  key={index}
                  src={foto}
                  alt={`Preview ${index + 1}`}
                  className="h-28 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          <div
            className={`mt-5 rounded-2xl p-4 text-zinc-700 ${tema.box} ${tema.msgFont}`}
          >
            {msg.slice(0, 150)}
            {msg.length > 150 ? "..." : ""}
          </div>

          <p className={`mt-4 text-xl ${tema.title} ${tema.signFont}`}>
            Com amor, {de}
          </p>
        </div>
      </div>
    </div>
  );
}