"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

interface UsuarioDoador {
  id_usuario: string;
  nome: string;
  telefone?: string;
  email?: string;
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
}

interface Donation {
  id_doacao: number;
  status: "PENDENTE" | "RETIRADA" | "CONCLUIDA" | "CANCELADA";
  data_doacao: string;
  observacao?: string;
  id_usuario: string;
  id_usuario_ong?: string | null;
  id_endereco?: number | null;
  endereco_customizado?: string | null;
  endereco?: Endereco | null;
  usuario?: UsuarioDoador | null;
  item_doacao?: ItemDoacao[];
}

export default function ResgatesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResgates = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("doacao")
        .select(`
          id_doacao,
          status,
          data_doacao,
          observacao,
          id_usuario,
          id_usuario_ong,
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
          usuario!doacao_id_usuario_fkey (
            id_usuario,
            nome,
            telefone,
            email
          ),
          item_doacao (
            id_item,
            nome_alimento,
            quantidade,
            unidade,
            data_validade
          )
        `)
        .eq("id_usuario_ong", userId)
        .order("data_doacao", { ascending: false })
        .order("id_doacao", { ascending: false });

      if (error) throw error;
      if (data) {
        const formatted: Donation[] = (data as any[]).map((d: any) => {
          const rawAddr = d.endereco;
          const singleAddr = Array.isArray(rawAddr) ? rawAddr[0] : rawAddr;
          const rawUser = d.usuario;
          const singleUser = Array.isArray(rawUser) ? rawUser[0] : rawUser;
          
          return {
            ...d,
            endereco: singleAddr || null,
            usuario: singleUser || null,
          };
        });
        setDonations(formatted);
      }
    } catch (err) {
      console.error("Erro ao buscar resgates:", err);
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

        // Verify if user is indeed an ONG
        const { data: profData, error: profError } = await supabase
          .from("usuario")
          .select("tipo")
          .eq("id_usuario", authUser.id)
          .maybeSingle();

        if (profError || !profData || profData.tipo !== "ong") {
          // If not an ONG, redirect to home or minhas doacoes
          window.location.replace("/");
          return;
        }

        setUser(authUser);
        hasLoadedUser = true;

        await fetchResgates(authUser.id);
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

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Map donation items to illustration image
  const getDonationImage = (items?: ItemDoacao[]) => {
    const defaultImage = "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400";
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
      case "RETIRADA":
        return {
          text: "Retirada Confirmada",
          classes: "bg-[#edf2e2] text-primary border border-primary/20",
        };
      case "CONCLUIDA":
        return {
          text: "Resgate Concluído",
          classes: "bg-emerald-50 text-emerald-800 border border-emerald-200/85",
        };
      case "CANCELADA":
        return {
          text: "Cancelado",
          classes: "bg-red-50 text-red-800 border border-red-200/80",
        };
      default:
        return {
          text: status,
          classes: "bg-zinc-50 text-zinc-800 border border-zinc-200/80",
        };
    }
  };

  if (!mounted || loading || !user) {
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
      <Header />

      <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10">
        {/* Title and Intro */}
        <div className="space-y-2 text-left">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-secondary tracking-tight">
            Meus Resgates
          </h1>
          <p className="font-body-lg text-body-md text-on-surface-variant font-medium">
            Gerencie e acompanhe o histórico de doações que sua ONG resgatou na comunidade.
          </p>
        </div>

        {/* Resgates List */}
        {donations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start w-full">
            {donations.map((donation) => {
              const badge = getStatusBadge(donation.status);
              const firstItemName = donation.item_doacao?.[0]?.nome_alimento || "Itens variados";
              const dateLabel = formatDate(donation.data_doacao);
              const image = getDonationImage(donation.item_doacao);
              const doador = donation.usuario;

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
                          Itens Resgatados
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
                            return "Não especificado (endereço principal do doador)";
                          })()}
                        </p>
                      </div>

                      {/* Observation */}
                      {donation.observacao && (
                        <div className="space-y-1 bg-surface-container-lowest border border-outline-variant/35 p-3 rounded-2xl">
                          <h5 className="font-label-md text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                            Observações do Doador
                          </h5>
                          <p className="font-body-md text-xs text-on-surface-variant/90 leading-relaxed italic">
                            &quot;{donation.observacao}&quot;
                          </p>
                        </div>
                      )}

                      {/* Doador Info */}
                      {doador && (
                        <div className="mt-4 p-4 rounded-2xl bg-secondary-container/10 border border-secondary/15 space-y-2">
                          <h4 className="font-display text-sm font-bold text-secondary flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-secondary">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Doador: {doador.nome}
                          </h4>
                          
                          {doador.telefone && (
                            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.28-5.116-3.573-6.4-6.4l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                              </svg>
                              <span>Telefone: {doador.telefone}</span>
                            </div>
                          )}

                          {doador.email && (
                            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4 text-primary shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                              </svg>
                              <span className="truncate">{doador.email}</span>
                            </div>
                          )}

                          {/* Chat Link button */}
                          <button
                            onClick={() => router.push(`/chat?doacao=${donation.id_doacao}`)}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl bg-secondary text-white text-xs font-bold hover:bg-secondary/95 transition-all shadow-sm cursor-pointer select-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                            </svg>
                            Abrir Chat com Doador
                          </button>
                        </div>
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
              <h3 className="font-display text-2xl font-bold text-on-surface">Nenhum resgate realizado</h3>
              <p className="font-body-lg text-body-md text-on-surface-variant/75 max-w-[448px] mx-auto">
                Sua ONG ainda não resgatou nenhuma doação. Vá até o feed de doações ativas para encontrar alimentos disponíveis para resgate na sua região!
              </p>
            </div>
            <Link
              href="/doacoes"
              className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-md hover:scale-105 mt-2 text-sm"
            >
              Ver Doações Disponíveis
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
