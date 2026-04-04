"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CriarPage() {
  const router = useRouter();

  const [nomeMae, setNomeMae] = useState("");
  const [nomeComprador, setNomeComprador] = useState("");
  const [mensagem, setMensagem] = useState("");
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
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-8 shadow-lg border border-pink-100">
        <h1 className="mb-2 text-3xl font-bold text-pink-600">
          Criar homenagem
        </h1>

        <p className="mb-6 text-zinc-600">
          Preencha os dados para montar a surpresa.
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