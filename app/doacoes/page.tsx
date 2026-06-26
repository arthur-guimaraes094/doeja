import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "@/lib/supabase";
import DonationsList, { Donation } from "./DonationsList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Doações Disponíveis - DoeJÁ",
  description: "Encontre itens e cestas de alimentos disponíveis para doação na sua região. Conecte-se com doadores locais.",
  openGraph: {
    title: "Doações Disponíveis - DoeJÁ",
    description: "Encontre itens e cestas de alimentos disponíveis para doação na sua região. Conecte-se com doadores locais.",
    images: [{ url: "/logo.svg" }],
  },
};

export default async function DonationsPage() {
  let donations: Donation[] = [];
  let errorMsg = "";

  try {
    // Fazer a query relacionando item_doacao, doacao, usuario e endereco
    const { data, error } = await supabase
      .from("item_doacao")
      .select(`
        id_item,
        nome_alimento,
        quantidade,
        unidade,
        data_validade,
        id_doacao,
        doacao (
          id_doacao,
          id_usuario,
          status,
          data_doacao,
          observacao,
          id_endereco,
          endereco_customizado,
          endereco (
            bairro,
            cidade
          ),
          usuario!doacao_id_usuario_fkey (
            nome,
            endereco (
              bairro,
              cidade,
              principal
            )
          )
        )
      `);

    if (error) throw error;

    if (data) {
      // Filtrar os itens que possuem uma doação válida vinculada e cujo status seja PENDENTE
      const validData = data.filter((item: any) => item.doacao !== null && item.doacao.status === "PENDENTE");

      // Mapear os dados para o formato esperado pela tela
      donations = validData.map((item: any) => {
        const doacao = item.doacao;
        const usuario = doacao?.usuario;
        const customAddr = doacao?.endereco_customizado;
        const selectedSavedAddr = doacao?.endereco;

        let location = "Natal, Centro";
        if (selectedSavedAddr) {
          location = `${selectedSavedAddr.cidade}, ${selectedSavedAddr.bairro}`;
        } else if (customAddr) {
          try {
            const parsed = JSON.parse(customAddr);
            location = `${parsed.cidade}, ${parsed.bairro}`;
          } catch {
            location = customAddr;
          }
        } else {
          // Fallback to donor's default address (backward compatibility)
          const enderecos = usuario?.endereco;
          const userAddr = Array.isArray(enderecos)
            ? (enderecos.find((e: any) => e.principal) || enderecos[0])
            : enderecos;
          if (userAddr) {
            location = `${userAddr.cidade}, ${userAddr.bairro}`;
          }
        }

        // Formatação do tempo/data da doação
        const dataDoacaoStr = doacao?.data_doacao;
        let timeLabel = "Hoje";
        if (dataDoacaoStr) {
          const dataDoacao = new Date(dataDoacaoStr);
          const hoje = new Date();
          const ontem = new Date();
          ontem.setDate(hoje.getDate() - 1);

          if (dataDoacao.toDateString() === hoje.toDateString()) {
            timeLabel = "Hoje";
          } else if (dataDoacao.toDateString() === ontem.toDateString()) {
            timeLabel = "Ontem";
          } else {
            timeLabel = dataDoacao.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          }
        }

        // Critério de urgência: se a data de validade estiver próxima (menos de 10 dias)
        let urgente = false;
        if (item.data_validade) {
          const validade = new Date(item.data_validade);
          const hoje = new Date();
          const diffTime = validade.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 10) {
            urgente = true;
          }
        }

        // Mapeamento inteligente de imagem baseado no nome do alimento
        const nomeLower = item.nome_alimento.toLowerCase();
        let image = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400"; // Cesta Básica default
        
        if (nomeLower.includes("arroz")) {
          image = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("feijão") || nomeLower.includes("feijao")) {
          image = "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("leite")) {
          image = "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("legume") || nomeLower.includes("fruta") || nomeLower.includes("verdura") || nomeLower.includes("vegetal") || nomeLower.includes("orgânico") || nomeLower.includes("organico")) {
          image = "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("agasalho") || nomeLower.includes("roupa") || nomeLower.includes("casaco") || nomeLower.includes("vestuário") || nomeLower.includes("frio")) {
          image = "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("brinquedo") || nomeLower.includes("bonec") || nomeLower.includes("carrinho")) {
          image = "https://images.unsplash.com/photo-1537655780520-1e392edd816a?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("fralda") || nomeLower.includes("bebê") || nomeLower.includes("bebe")) {
          image = "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400";
        } else if (nomeLower.includes("higiene") || nomeLower.includes("sabonete") || nomeLower.includes("pasta") || nomeLower.includes("escova")) {
          image = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400";
        }

        return {
          id: item.id_item.toString(),
          id_doacao: Number(doacao?.id_doacao),
          id_doador: doacao?.id_usuario,
          title: `${item.quantidade} ${item.unidade} de ${item.nome_alimento}`,
          donor: usuario?.nome || "Doador Anônimo",
          location,
          time: timeLabel,
          urgente,
          distance: Math.random() * 5 + 0.1, // Simula distância para exibição
          timestamp: doacao?.data_doacao ? new Date(doacao.data_doacao).toISOString() : new Date().toISOString(),
          image,
        };
      });
    }
  } catch (err: any) {
    console.error("Erro ao carregar doações no servidor:", err);
    errorMsg = "Erro ao carregar a lista de doações do banco de dados.";
  }

  return (
    <>
      <Header />

      <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Title and Intro */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-secondary tracking-tight text-left">
            Doações
          </h1>
          <p className="font-body-lg text-body-md text-on-surface-variant font-medium text-left">
            Encontre doações feitas pela comunidade e ajude a conectá-las.
          </p>
        </div>

        {errorMsg ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4 border border-red-200 rounded-3xl bg-red-50 text-red-700">
            <p className="font-display text-lg font-bold">{errorMsg}</p>
          </div>
        ) : (
          <DonationsList initialDonations={donations} />
        )}
      </main>

      <Footer />
    </>
  );
}
