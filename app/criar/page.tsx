"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CriarPage() {
  const router = useRouter();

  const [nomeMae, setNomeMae] = useState("");
  const [nomeComprador, setNomeComprador] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estilo, setEstilo] = useState("romantico");
  const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

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

  async function uploadImagem(): Promise<string> {
    if (!arquivoImagem) {
      throw new Error("Escolha uma imagem antes de continuar.");
    }

    const formData = new FormData();
    formData.append("file", arquivoImagem);

    const resposta = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || "Erro ao enviar imagem.");
    }

    return dados.url;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setCarregando(true);

      const imagemFinal = await uploadImagem();
      const slug = gerarSlug(nomeMae);

      const { error } = await supabase.from("homenagens").insert({
        slug,
        nome_mae: nomeMae,
        nome_comprador: nomeComprador,
        mensagem,
        imagem_url: imagemFinal,
        estilo,
      });

      if (error) {
        throw new Error(error.message);
      }

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

  return (
    <main className="min-h-screen bg-pink-50 px-6 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 shadow-lg border border-pink-100">
        <h1 className="mb-2 text-3xl font-bold text-pink-600">
          Criar homenagem
        </h1>

        <p className="mb-6 text-zinc-600">
          Preencha os dados e escolha o estilo da surpresa.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800">
              Nome da mãe ou avó
            </label>
            <input
              type="text"
              placeholder="Ex: Eduarda"
              value={nomeMae}
              onChange={(e) => setNomeMae(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800">
              Seu nome
            </label>
            <input
              type="text"
              placeholder="Ex: Neto"
              value={nomeComprador}
              onChange={(e) => setNomeComprador(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800">
              Mensagem
            </label>
            <textarea
              placeholder="Escreva sua mensagem especial..."
              rows={5}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-zinc-800">
              Escolha o estilo
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setEstilo("romantico")}
                className={`rounded-2xl border p-4 text-left transition ${
                  estilo === "romantico"
                    ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                    : "border-zinc-200 bg-white hover:border-pink-300"
                }`}
              >
                <p className="font-bold text-pink-600">Romântico</p>
                <p className="text-sm text-zinc-600">Rosa suave e carinhoso</p>
              </button>

              <button
                type="button"
                onClick={() => setEstilo("floral")}
                className={`rounded-2xl border p-4 text-left transition ${
                  estilo === "floral"
                    ? "border-rose-500 bg-rose-50 ring-2 ring-rose-200"
                    : "border-zinc-200 bg-white hover:border-rose-300"
                }`}
              >
                <p className="font-bold text-rose-600">Floral</p>
                <p className="text-sm text-zinc-600">Delicado e leve</p>
              </button>

              <button
                type="button"
                onClick={() => setEstilo("elegante")}
                className={`rounded-2xl border p-4 text-left transition ${
                  estilo === "elegante"
                    ? "border-zinc-800 bg-zinc-50 ring-2 ring-zinc-300"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <p className="font-bold text-zinc-800">Elegante</p>
                <p className="text-sm text-zinc-600">Premium e sofisticado</p>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-800">
              Foto especial
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setArquivoImagem(file);
              }}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-pink-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? "Salvando homenagem..." : "Continuar"}
          </button>
        </form>
      </div>
    </main>
  );
}