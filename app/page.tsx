export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-6">
          Surpreenda sua mãe com um presente inesquecível 💖
        </h1>

        <p className="text-lg md:text-xl text-zinc-700 mb-8">
          Crie uma homenagem com vídeo, fotos, música e mensagem personalizada.
        </p>

        <a
          href="/criar"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-2xl transition"
        >
          Criar meu presente
        </a>
      </div>
    </main>
  );
}