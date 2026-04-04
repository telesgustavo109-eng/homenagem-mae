"use client";

import { useState } from "react";

export default function CriarPage() {
  const [liberado, setLiberado] = useState(false);

  const linkPagamento = "COLE_AQUI_SEU_LINK_MP";

  if (!liberado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-pink-600 mb-4">
            Surpresa para o Dia das Mães 💖
          </h1>

          <p className="text-zinc-600 mb-6">
            Crie uma homenagem personalizada com foto, mensagem e QR Code.
          </p>

          <p className="text-lg font-semibold mb-4">
            Apenas R$19,90
          </p>

          <a
            href={linkPagamento}
            target="_blank"
            className="bg-pink-500 text-white px-6 py-3 rounded-xl block mb-4"
          >
            Pagar agora
          </a>

          <button
            onClick={() => setLiberado(true)}
            className="text-sm text-zinc-500 underline"
          >
            Já paguei
          </button>
        </div>
      </main>
    );
  }

  return <Formulario />;
}

function Formulario() {
  const [nomeMae, setNomeMae] = useState("");
  const [nomeComprador, setNomeComprador] = useState("");
  const [mensagem, setMensagem] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="p-8 bg-pink-50 rounded-2xl">
        <h1 className="text-2xl mb-4">Criar homenagem</h1>

        <input
          placeholder="Nome da mãe"
          onChange={(e) => setNomeMae(e.target.value)}
          className="block mb-2 p-2 border"
        />

        <input
          placeholder="Seu nome"
          onChange={(e) => setNomeComprador(e.target.value)}
          className="block mb-2 p-2 border"
        />

        <textarea
          placeholder="Mensagem"
          onChange={(e) => setMensagem(e.target.value)}
          className="block mb-2 p-2 border"
        />
      </div>
    </main>
  );
}