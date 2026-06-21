"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "@/lib/supabase";

interface Donation {
  id: string;
  title: string;
  donor: string;
  location: string;
  time: string;
  urgente: boolean;
  distance: number; // em km
  timestamp: string; // formato ISO
  image: string;
}

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recentes"); // "recentes" | "proximas" | "urgentes"
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchDonations() {
      try {
        setLoading(true);
        setErrorMsg("");

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
              status,
              data_doacao,
              observacao,
              usuario (
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
          const mappedDonations: Donation[] = validData.map((item: any) => {
            const doacao = item.doacao;
            const usuario = doacao?.usuario;
            const enderecos = usuario?.endereco;
            
            // Obter o endereço principal ou o primeiro disponível
            const endereco = Array.isArray(enderecos)
              ? (enderecos.find((e: any) => e.principal) || enderecos[0])
              : enderecos;

            const location = endereco
              ? `${endereco.cidade}, ${endereco.bairro}`
              : "Natal, Centro"; // Fallback caso não possua endereço

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

          setDonations(mappedDonations);
        }
      } catch (err: any) {
        console.error("Erro ao carregar doações:", err);
        setErrorMsg("Erro ao carregar a lista de doações do banco de dados.");
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);

  // Filtragem dos dados no cliente
  const filteredDonations = donations.filter((donation) => {
    const term = searchTerm.toLowerCase();
    return (
      donation.title.toLowerCase().includes(term) ||
      donation.donor.toLowerCase().includes(term) ||
      donation.location.toLowerCase().includes(term)
    );
  });

  // Ordenação dos dados no cliente
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (sortBy === "recentes") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else if (sortBy === "proximas") {
      return a.distance - b.distance;
    } else if (sortBy === "urgentes") {
      if (a.urgente && !b.urgente) return -1;
      if (!a.urgente && b.urgente) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });

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

        {/* Search and Filters Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
          {/* Search Input */}
          <div className="relative w-full max-w-2xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar doações, alimentos ou doadores..."
              className="w-full pl-12 pr-6 py-4 rounded-full bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-body-md text-on-surface shadow-sm"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex flex-col gap-1.5 min-w-[200px]">
            <label className="font-label-md text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider text-left">
              Ordenar por
            </label>
            <div className="relative w-full h-[52px]" ref={sortRef}>
              <div
                className={`absolute top-0 left-0 w-full bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] z-50 flex flex-col ${
                  isSortOpen
                    ? "h-[152px] border-primary shadow-lg"
                    : "h-[52px] border-outline-variant/60"
                }`}
              >
                {[
                  { value: "recentes", label: "Mais recentes" },
                  { value: "proximas", label: "Mais próximas" },
                  { value: "urgentes", label: "Urgentes primeiro" },
                ].map((option) => {
                  const isSelected = sortBy === option.value;
                  const shouldShow = isSortOpen || isSelected;

                  // Styling for option items depending on open/closed state
                  let itemClasses = "";
                  if (isSortOpen) {
                    if (isSelected) {
                      itemClasses = "bg-primary-container/15 text-primary font-bold";
                    } else {
                      itemClasses = "text-on-surface-variant hover:bg-primary-container/10 hover:text-primary font-medium";
                    }
                  } else {
                    itemClasses = "text-on-surface font-medium";
                  }

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        if (!isSortOpen) {
                          setIsSortOpen(true);
                        } else {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }
                      }}
                      className={`w-full text-left px-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] cursor-pointer flex items-center justify-between outline-none select-none ${itemClasses} ${
                        shouldShow
                          ? "h-[50px] opacity-100 py-3"
                          : "h-0 opacity-0 py-0 pointer-events-none"
                      }`}
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                    >
                      <span className="font-body-md text-body-md leading-none">
                        {option.label}
                      </span>

                      {/* Icon container */}
                      <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                        {/* Checkmark icon (only when open and selected) */}
                        <div
                          className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
                            isSortOpen && isSelected
                              ? "opacity-100 scale-100 rotate-0"
                              : "opacity-0 scale-75 rotate-45 pointer-events-none"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        {/* Arrow icon (only when closed and selected) */}
                        <div
                          className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
                            !isSortOpen && isSelected
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-75 pointer-events-none"
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-on-surface-variant/40">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Donation Grid */}
        {sortedDonations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-gutter w-full">
            {sortedDonations.map((donation) => (
              <article
                key={donation.id}
                className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Image & Badge */}
                <div className="relative aspect-square overflow-hidden bg-surface-container-highest">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={donation.image}
                    alt={`Imagem ilustrativa de ${donation.title}`}
                    className="w-full h-full object-cover"
                  />
                  {donation.urgente && (
                    <div className="absolute top-3 right-3 bg-secondary text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                      Urgente
                    </div>
                  )}
                </div>

                {/* Details Content */}
                <div className="p-5 flex flex-col grow text-left justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-on-surface leading-tight line-clamp-1">
                      {donation.title}
                    </h3>
                    <p className="font-label-md text-sm font-bold text-primary">
                      Doador: {donation.donor}
                    </p>
                    
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-on-surface-variant/70">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-outline shrink-0">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="font-body-md text-xs font-semibold">{donation.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant/50">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-outline shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className="font-body-md text-xs font-medium">{donation.time}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-sm cursor-pointer mt-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                    Entrar em Contato
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-outline-variant/60 rounded-3xl bg-surface-container-lowest">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-on-surface-variant/30">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <div className="space-y-1">
              <p className="font-display text-lg font-bold text-on-surface">Nenhuma doação encontrada</p>
              <p className="font-body-md text-sm text-on-surface-variant/70">
                Tente ajustar sua busca ou filtros para encontrar outras doações.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
