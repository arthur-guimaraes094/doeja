"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "@/lib/supabase";

interface ItemDoacao {
  id_item: number;
  nome_alimento: string;
  quantidade: number;
  unidade: string;
  data_validade?: string;
}

interface Ong {
  id_ong: number;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  descricao?: string;
}

interface Endereco {
  id_endereco: number;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  identificador?: string;
}

interface Donation {
  id_doacao: number;
  status: "PENDENTE" | "APROVADA" | "CONCLUIDA" | "CANCELADA" | "RETIRADA";
  data_doacao: string;
  observacao?: string;
  id_ong?: number;
  id_endereco?: number | null;
  endereco_customizado?: string | null;
  endereco?: Endereco | null;
  ongs?: Ong | null;
  item_doacao?: ItemDoacao[];
}

export default function MinhasDoacoesPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals and action state
  const [cancelModalId, setCancelModalId] = useState<number | null>(null);
  const [confirmModalId, setConfirmModalId] = useState<number | null>(null);
  const [processingAction, setProcessingAction] = useState(false);

  const fetchDonations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("doacao")
        .select(`
          id_doacao,
          status,
          data_doacao,
          observacao,
          id_ong,
          id_endereco,
          endereco_customizado,
          endereco (
            id_endereco,
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado
          ),
          ongs (
            id_ong,
            nome,
            telefone,
            email,
            endereco,
            descricao
          ),
          item_doacao (
            id_item,
            nome_alimento,
            quantidade,
            unidade,
            data_validade
          )
        `)
        .eq("id_usuario", userId)
        .order("data_doacao", { ascending: false })
        .order("id_doacao", { ascending: false });

      if (error) throw error;
      if (data) {
        const formatted: Donation[] = (data as any[]).map((d: any) => {
          const rawOngs = d.ongs;
          const singleOng = Array.isArray(rawOngs) ? rawOngs[0] : rawOngs;
          return {
            ...d,
            ongs: singleOng || null,
          };
        });
        setDonations(formatted);
      }
    } catch (err) {
      console.error("Erro ao buscar doações:", err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);

    let hasLoadedUser = false;

    async function loadUserData(authUser: any) {
      try {
        setLoading(true);
        if (!authUser) {
          setUser(null);
          setDonations([]);
          setLoading(false);
          window.location.replace("/login");
          return;
        }

        setUser(authUser);
        hasLoadedUser = true;

        await fetchDonations(authUser.id);
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        window.location.replace("/login");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setDonations([]);
        setLoading(false);
        if (hasLoadedUser) {
          window.location.replace("/");
        } else {
          window.location.replace("/login");
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loadUserData(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    const isAnyModalOpen = cancelModalId !== null || confirmModalId !== null;
    if (isAnyModalOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.documentElement.classList.remove("lenis-stopped");
      document.documentElement.style.removeProperty('--scrollbar-width');
    }
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, [cancelModalId, confirmModalId]);

  // Handle Cancellation action
  const handleCancelDonation = async () => {
    if (cancelModalId === null || !user) return;
    setProcessingAction(true);

    try {
      const { error } = await supabase
        .from("doacao")
        .update({ status: "CANCELADA" })
        .eq("id_doacao", cancelModalId);

      if (error) throw error;
      
      // Update local state
      setDonations(prev =>
        prev.map(d => d.id_doacao === cancelModalId ? { ...d, status: "CANCELADA" } : d)
      );
    } catch (err) {
      console.error("Erro ao cancelar doação:", err);
      alert("Erro ao cancelar a doação. Tente novamente.");
    } finally {
      setProcessingAction(false);
      setCancelModalId(null);
    }
  };

  // Handle Confirm Delivery action
  const handleConfirmDelivery = async () => {
    if (confirmModalId === null || !user) return;
    setProcessingAction(true);

    try {
      const { error } = await supabase
        .from("doacao")
        .update({ status: "CONCLUIDA" })
        .eq("id_doacao", confirmModalId);

      if (error) throw error;
      
      // Update local state
      setDonations(prev =>
        prev.map(d => d.id_doacao === confirmModalId ? { ...d, status: "CONCLUIDA" } : d)
      );
    } catch (err) {
      console.error("Erro ao confirmar entrega:", err);
      alert("Erro ao confirmar entrega. Tente novamente.");
    } finally {
      setProcessingAction(false);
      setConfirmModalId(null);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // Add timezone offset correction if necessary, but date-only string is fine to parse
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Map donation items to illustration image
  const getDonationImage = (items?: ItemDoacao[]) => {
    const defaultImage = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400"; // basic basket
    if (!items || items.length === 0) return defaultImage;
    
    const primaryItemName = items[0].nome_alimento.toLowerCase();
    
    if (primaryItemName.includes("arroz")) {
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("feijão") || primaryItemName.includes("feijao")) {
      return "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("leite")) {
      return "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("legume") || primaryItemName.includes("fruta") || primaryItemName.includes("verdura") || primaryItemName.includes("vegetal") || primaryItemName.includes("orgânico") || primaryItemName.includes("organico")) {
      return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("agasalho") || primaryItemName.includes("roupa") || primaryItemName.includes("casaco") || primaryItemName.includes("vestuário") || primaryItemName.includes("frio")) {
      return "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("brinquedo") || primaryItemName.includes("bonec") || primaryItemName.includes("carrinho")) {
      return "https://images.unsplash.com/photo-1537655780520-1e392edd816a?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("fralda") || primaryItemName.includes("bebê") || primaryItemName.includes("bebe")) {
      return "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400";
    } else if (primaryItemName.includes("higiene") || primaryItemName.includes("sabonete") || primaryItemName.includes("pasta") || primaryItemName.includes("escova")) {
      return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400";
    }
    
    return defaultImage;
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return {
          text: "Aguardando Interesse",
          classes: "bg-amber-50 text-amber-800 border border-amber-200/80",
        };
      case "APROVADA":
        return {
          text: "Reivindicada por ONG",
          classes: "bg-sky-50 text-sky-800 border border-sky-200/80",
        };
      case "CONCLUIDA":
        return {
          text: "Entregue com Sucesso",
          classes: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
        };
      case "CANCELADA":
        return {
          text: "Cancelada",
          classes: "bg-red-50 text-red-800 border border-red-200/80",
        };
      case "RETIRADA":
        return {
          text: "Retirada",
          classes: "bg-violet-50 text-violet-800 border border-violet-200/80",
        };
      default:
        return {
          text: status,
          classes: "bg-zinc-50 text-zinc-800 border border-zinc-200/80",
        };
    }
  };

  // Render Skeleton loader
  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-surface-variant/30 rounded-xl animate-pulse"></div>
            <div className="h-5 w-96 bg-surface-variant/20 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-surface-variant/20 rounded-[32px] animate-pulse"></div>
            <div className="h-96 bg-surface-variant/20 rounded-[32px] animate-pulse"></div>
            <div className="h-96 bg-surface-variant/20 rounded-[32px] animate-pulse"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className={cancelModalId !== null || confirmModalId !== null ? "pointer-events-none select-none" : ""}>
        <Header />

        <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10">
          {/* Title and Intro */}
          <div className="space-y-2 text-left">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-secondary tracking-tight">
              Minhas Doações
            </h1>
            <p className="font-body-lg text-body-md text-on-surface-variant font-medium">
              Gerencie e acompanhe o andamento dos alimentos que você disponibilizou para doação.
            </p>
          </div>

          {/* New Donation CTA Banner */}
          {donations.length > 0 && (
            <section className="tactile-card bg-surface-container-low border border-secondary/15 p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md w-full animate-fade-in-scale text-left">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="relative w-20 h-20 shrink-0 hidden md:block">
                  <Image
                    src="/caixa-doacao.webp"
                    alt="Caixa de Doação"
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-xl md:text-2xl font-extrabold text-secondary">
                    Quer fazer mais uma boa ação?
                  </h3>
                  <p className="font-body-lg text-sm md:text-base text-on-surface-variant max-w-[550px] font-medium">
                    Cadastre novos alimentos para doação e ajude ONGs locais a alimentar quem mais precisa. O processo leva menos de um minuto!
                  </p>
                </div>
              </div>
              <Link
                href="/doar"
                className="px-6 py-3.5 rounded-full bg-secondary text-white font-bold hover:bg-secondary/95 active:scale-[0.98] transition-all shadow-md hover:scale-105 shrink-0 text-sm md:text-base w-full md:w-auto text-center cursor-pointer"
              >
                Nova Doação
              </Link>
            </section>
          )}

          {/* Donations List Container */}
          {donations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start w-full">
              {donations.map((donation) => {
                const badge = getStatusBadge(donation.status);
                const firstItemName = donation.item_doacao?.[0]?.nome_alimento || "Itens variados";
                const dateLabel = formatDate(donation.data_doacao);
                const hasOng = donation.ongs !== null && donation.ongs !== undefined;
                const image = getDonationImage(donation.item_doacao);

                return (
                  <article
                    key={donation.id_doacao}
                    className="bg-white border border-outline-variant/30 rounded-[32px] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full text-left"
                  >
                    {/* Header Image with Tag */}
                    <div className="relative h-48 w-full overflow-hidden bg-surface-container-highest">
                      <Image
                        src={image}
                        alt={`Ilustração para doação de ${firstItemName}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover w-full h-full"
                      />
                      <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm z-10 ${badge.classes}`}>
                        {badge.text}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex flex-col grow justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2 border-b border-surface-variant/10 pb-3">
                          <span className="font-display text-lg font-bold text-on-surface">
                            Doação #{donation.id_doacao}
                          </span>
                          <span className="font-body-md text-xs font-semibold text-on-surface-variant/60 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-outline shrink-0">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {dateLabel}
                          </span>
                        </div>

                        {/* List of items */}
                        <div className="space-y-2">
                          <h4 className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                            Itens Doados
                          </h4>
                          {donation.item_doacao && donation.item_doacao.length > 0 ? (
                            <ul className="space-y-1.5">
                              {donation.item_doacao.map((item) => (
                                <li key={item.id_item} className="flex items-center justify-between text-sm bg-surface-container-low/55 px-3 py-2 rounded-xl border border-surface-variant/10">
                                  <span className="font-body-md font-bold text-on-surface">
                                    {item.nome_alimento}
                                  </span>
                                  <span className="font-body-md font-semibold text-primary bg-primary-container/10 px-2 py-0.5 rounded-lg text-xs">
                                    {item.quantidade} {item.unidade}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-on-surface-variant/50">Nenhum item registrado.</p>
                          )}
                        </div>

                        {/* Pickup Location */}
                        <div className="space-y-1 bg-surface-container-lowest border border-outline-variant/35 p-3 rounded-2xl text-left">
                          <h5 className="font-label-md text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                            Local de Retirada
                          </h5>
                          <p className="font-body-md text-xs text-on-surface-variant/90 leading-relaxed">
                            {(() => {
                              const savedAddr = donation.endereco;
                              const customAddr = donation.endereco_customizado;
                              if (savedAddr) {
                                return `${savedAddr.rua}, ${savedAddr.numero} ${savedAddr.complemento ? `- ${savedAddr.complemento}` : ""} - ${savedAddr.bairro}, ${savedAddr.cidade}/${savedAddr.estado}`;
                              } else if (customAddr) {
                                try {
                                  const parsed = JSON.parse(customAddr);
                                  return `${parsed.rua}, ${parsed.numero} ${parsed.complemento ? `- ${parsed.complemento}` : ""} - ${parsed.bairro}, ${parsed.cidade}/${parsed.estado}`;
                                } catch {
                                  return customAddr;
                                }
                              }
                              return "Não especificado (endereço principal)";
                            })()}
                          </p>
                        </div>

                        {/* Observation */}
                        {donation.observacao && (
                          <div className="space-y-1 bg-surface-container-lowest border border-outline-variant/35 p-3 rounded-2xl">
                            <h5 className="font-label-md text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                              Observações
                            </h5>
                            <p className="font-body-md text-xs text-on-surface-variant/90 leading-relaxed italic">
                              &quot;{donation.observacao}&quot;
                            </p>
                          </div>
                        )}

                        {/* ONG Claimed Info */}
                        {hasOng && donation.ongs && (
                          <div className="mt-4 p-4 rounded-2xl bg-[#edf2e2] border border-primary/15 space-y-2">
                            <h4 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                              </svg>
                              Reivindicado por {donation.ongs.nome}
                            </h4>
                            
                            {donation.ongs.telefone && (
                              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.28-5.116-3.573-6.4-6.4l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>Contato: {donation.ongs.telefone}</span>
                              </div>
                            )}

                            {donation.ongs.endereco && (
                              <div className="flex items-start gap-2 text-xs text-on-surface-variant font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0 mt-0.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                                <span className="leading-tight">ONG: {donation.ongs.endereco}</span>
                              </div>
                            )}

                            {/* Contact via WhatsApp CTA Button */}
                            {donation.status === "APROVADA" && donation.ongs.telefone && (
                              <a
                                href={`https://wa.me/55${donation.ongs.telefone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow-sm cursor-pointer select-none"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                  <path d="M17.472 14.382c-.022-.015-.045-.03-.067-.045a8.38 8.38 0 0 1-.9-.72c-.172-.162-.352-.33-.495-.494a.732.732 0 0 0-.585-.225c-.24.03-.435.18-.585.345a11.168 11.168 0 0 1-1.395 1.29 8.213 8.213 0 0 1-2.91-2.91 11.168 11.168 0 0 1 1.29-1.395.787.787 0 0 0 .12-.99c-.165-.24-.36-.465-.54-.69a8.473 8.473 0 0 1-.72-.9.735.735 0 0 0-.9-.285c-.3.075-.54.27-.675.525a3.8 3.8 0 0 0-.255 1.545 8.1 8.1 0 0 0 1.905 4.38 12.87 12.87 0 0 0 4.95 3.96 4.92 4.92 0 0 0 1.83.51c.36 0 .72-.045 1.05-.18a2.535 2.535 0 0 0 1.365-1.29 4.3 4.3 0 0 0 .345-2.07c-.015-.405-.21-.735-.555-.915zm1.5-6.3a8.94 8.94 0 0 0-6.9-3.082h-.03a9 9 0 0 0-8.992 9c0 1.53.39 3.015 1.14 4.32l-1.215 4.44 4.545-1.185A8.955 8.955 0 0 0 12.043 23c4.965 0 9-4.035 9-9a8.955 8.955 0 0 0-2.07-5.918z" />
                                </svg>
                                Combinar Entrega via WhatsApp
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {donation.status === "PENDENTE" && (
                          <button
                            type="button"
                            onClick={() => setCancelModalId(donation.id_doacao)}
                            className="w-full py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 active:scale-[0.98] transition-all cursor-pointer text-center text-sm"
                          >
                            Cancelar Doação
                          </button>
                        )}

                        {donation.status === "APROVADA" && (
                          <>
                            <button
                              type="button"
                              onClick={() => setCancelModalId(donation.id_doacao)}
                              className="w-1/3 py-3.5 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 active:scale-[0.98] transition-all cursor-pointer text-center text-sm"
                              title="Cancelar Doação"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmModalId(donation.id_doacao)}
                              className="w-2/3 py-3.5 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/95 active:scale-[0.98] transition-all cursor-pointer text-center text-sm shadow-xs"
                            >
                              Confirmar Entrega
                            </button>
                          </>
                        )}

                        {donation.status === "RETIRADA" && (
                          <button
                            type="button"
                            onClick={() => setConfirmModalId(donation.id_doacao)}
                            className="w-full py-3.5 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/95 active:scale-[0.98] transition-all cursor-pointer text-center text-sm shadow-xs flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Confirmar Entrega
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full max-w-[672px] mx-auto border border-dashed border-outline-variant/60 rounded-[32px] flex flex-col items-center justify-center text-center p-12 gap-6 bg-surface-container-lowest my-auto min-h-[400px] shadow-xs">
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-on-surface">Você não possui doações cadastradas</h3>
                <p className="font-body-lg text-body-md text-on-surface-variant/75 max-w-[448px] mx-auto">
                  Ainda não há registros de alimentos doados nesta conta. Comece hoje mesmo e ajude a transformar realidades!
                </p>
              </div>
              <Link
                href="/doar"
                className="px-8 py-4 rounded-full bg-secondary text-white font-bold hover:bg-secondary/95 active:scale-[0.98] transition-all shadow-md hover:scale-105 mt-2 text-sm"
              >
                Cadastrar Doação
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelConfirmModal
        isOpen={cancelModalId !== null}
        onClose={() => setCancelModalId(null)}
        onConfirm={handleCancelDonation}
        processing={processingAction}
      />

      {/* Delivery Confirmation Modal */}
      <DeliveryConfirmModal
        isOpen={confirmModalId !== null}
        onClose={() => setConfirmModalId(null)}
        onConfirm={handleConfirmDelivery}
        processing={processingAction}
      />
    </>
  );
}

// Cancel Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  processing: boolean;
}

function CancelConfirmModal({ isOpen, onClose, onConfirm, processing }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !processing) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, processing, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs cursor-pointer select-none"
      onClick={() => {
        if (!processing) onClose();
      }}
    >
      <div
        className="w-full max-w-[448px] bg-white border border-surface-variant/20 rounded-[32px] p-6 md:p-8 shadow-2xl text-left cursor-default flex flex-col gap-6 animate-in fade-in-50 zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-red-600 flex items-center gap-2">
            ⚠️ Cancelar Doação
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant/80">
            Tem certeza que deseja cancelar esta doação? Esta ação não pode ser desfeita e os alimentos deixarão de ficar disponíveis para as ONGs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={processing}
            onClick={onClose}
            className="w-1/2 py-3.5 rounded-2xl border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-variant/10 active:scale-[0.98] transition-all cursor-pointer text-center text-sm disabled:opacity-50"
          >
            Não, Voltar
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={onConfirm}
            className="w-1/2 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer text-center text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processing ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Sim, Cancelar"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Delivery Modal Component
function DeliveryConfirmModal({ isOpen, onClose, onConfirm, processing }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !processing) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, processing, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs cursor-pointer select-none"
      onClick={() => {
        if (!processing) onClose();
      }}
    >
      <div
        className="w-full max-w-[448px] bg-white border border-surface-variant/20 rounded-[32px] p-6 md:p-8 shadow-2xl text-left cursor-default flex flex-col gap-6 animate-in fade-in-50 zoom-in-95 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            🤝 Confirmar Entrega
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant/80">
            Você confirma que os alimentos foram entregues fisicamente para os representantes da ONG parceira?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={processing}
            onClick={onClose}
            className="w-1/2 py-3.5 rounded-2xl border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-variant/10 active:scale-[0.98] transition-all cursor-pointer text-center text-sm disabled:opacity-50"
          >
            Não, Voltar
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={onConfirm}
            className="w-1/2 py-3.5 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/95 active:scale-[0.98] transition-all cursor-pointer text-center text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processing ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "Sim, Entregue!"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
