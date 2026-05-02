import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import HomenagemClient from "./HomenagemClient";

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

  const fotos = [
    data.foto_1_url,
    data.foto_2_url,
    data.foto_3_url,
    data.foto_4_url,
  ].filter(Boolean) as string[];

  return (
    <HomenagemClient
      nomeMae={data.nome_mae}
      nomeComprador={data.nome_comprador}
      mensagem={data.mensagem}
      estilo={(data.estilo || "romantico") as
        | "romantico"
        | "floral"
        | "elegante"
        | "aniversario"
        | "namoro"
        | "avo"}
      fotos={fotos}
      videoUrl={data.video_url || null}
      musicaUrl={data.musica_url || null}
      musicaNome={data.musica_nome || null}
    />
  );
}