"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "@/lib/supabase";

interface ItemDoacao {
  nome_alimento: string;
  quantidade: number;
  unidade: string;
}

interface Doacao {
  id_doacao: number;
  status: string;
  id_usuario_ong: string | null;
  item_doacao: ItemDoacao[];
}

interface Usuario {
  id_usuario: string;
  nome: string;
}

interface Conversa {
  id_conversa: number;
  id_doador: string;
  id_interessado: string;
  data_criacao: string;
  doacao: Doacao | null;
  doador: Usuario;
  interessado: Usuario;
  last_message?: string;
  last_message_time?: string;
}

interface Mensagem {
  id_mensagem: number;
  id_conversa: number;
  id_remetente: string;
  texto: string;
  data_envio: string;
  lido: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doacaoParam = searchParams.get("doacao");

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversa[]>([]);
  const [activeConversaId, setActiveConversaId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Mensagem[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOng, setIsOng] = useState<boolean>(false);
  const [isConfirmingWithdrawal, setIsConfirmingWithdrawal] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastActiveConversaIdRef = useRef<number | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Auto-scroll messages list to bottom within its container
  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior
        });
      }
    }, 50);
  };

  // Format timestamp to hh:mm
  const formatMessageTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  // Get name of donation list item
  const getDonationTitle = (conversa: Conversa) => {
    if (!conversa.doacao || !conversa.doacao.item_doacao || conversa.doacao.item_doacao.length === 0) {
      return "Doação";
    }
    const items = conversa.doacao.item_doacao;
    return `${items[0].quantidade} ${items[0].unidade} de ${items[0].nome_alimento}`;
  };

  // Fetch messages of active conversation and subscribe to Realtime updates
  async function loadMessages(conversaId: number) {
    // Unsubscribe from previous channel if exists
    if (subscriptionRef.current) {
      await supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    const { data: msgData, error: msgError } = await supabase
      .from("mensagem")
      .select("*")
      .eq("id_conversa", conversaId)
      .order("data_envio", { ascending: true });

    if (!msgError && msgData) {
      setMessages(msgData);
    }

    // Subscribe to inserts in real-time (unique channel name to avoid reuse conflicts)
    const channel = supabase
      .channel(`room:${conversaId}:${Date.now()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagem",
          filter: `id_conversa=eq.${conversaId}`
        },
        (payload) => {
          const newMsg = payload.new as Mensagem;
          setMessages((prev) => {
            // Avoid duplicate additions
            if (prev.some(m => m.id_mensagem === newMsg.id_mensagem)) {
              return prev;
            }
            return [...prev, newMsg];
          });
          
          // Update last message snippet in sidebar list
          setConversations((prevList) =>
            prevList.map((c) =>
              c.id_conversa === conversaId
                ? {
                    ...c,
                    last_message: newMsg.texto,
                    last_message_time: formatMessageTime(newMsg.data_envio)
                  }
                : c
            )
          );
        }
      )
      .subscribe();

    subscriptionRef.current = channel;
  }

  // Fetch all user conversations
  async function fetchConversations(userId: string, selectId: number | null = null) {
    const { data: convs, error: convsError } = await supabase
      .from("conversa")
      .select(`
        id_conversa,
        id_doador,
        id_interessado,
        data_criacao,
        doacao (
          id_doacao,
          status,
          id_usuario_ong,
          item_doacao (
            nome_alimento,
            quantidade,
            unidade
          )
        ),
        doador:usuario!conversa_id_doador_fkey (
          id_usuario,
          nome
        ),
        interessado:usuario!conversa_id_interessado_fkey (
          id_usuario,
          nome
        )
      `)
      .or(`id_doador.eq.${userId},id_interessado.eq.${userId}`);

    if (convsError) {
      console.error("Erro ao buscar conversas:", convsError);
      return;
    }

    if (convs) {
      // Cast types and fetch last messages for formatting
      const formattedConvs: Conversa[] = await Promise.all(
        convs.map(async (c: any) => {
          // Fetch last message for snippet
          const { data: lastMsgData } = await supabase
            .from("mensagem")
            .select("texto, data_envio")
            .eq("id_conversa", c.id_conversa)
            .order("data_envio", { ascending: false })
            .limit(1);

          const lastMsg = lastMsgData && lastMsgData.length > 0 ? lastMsgData[0] : null;

          return {
            id_conversa: c.id_conversa,
            id_doador: c.id_doador,
            id_interessado: c.id_interessado,
            data_criacao: c.data_criacao,
            doacao: c.doacao ? {
              id_doacao: c.doacao.id_doacao,
              status: c.doacao.status,
              id_usuario_ong: c.doacao.id_usuario_ong,
              item_doacao: Array.isArray(c.doacao.item_doacao) 
                ? c.doacao.item_doacao 
                : [c.doacao.item_doacao]
            } : null,
            doador: c.doador,
            interessado: c.interessado,
            last_message: lastMsg ? lastMsg.texto : "Nenhuma mensagem enviada",
            last_message_time: lastMsg ? formatMessageTime(lastMsg.data_envio) : ""
          };
        })
      );

      // Sort by last message time or creation date
      formattedConvs.sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime());

      setConversations(formattedConvs);

      // Select conversation
      if (selectId) {
        setActiveConversaId(selectId);
        loadMessages(selectId);
      } else if (formattedConvs.length > 0 && !activeConversaId) {
        // Fallback to select first on desktop only
        if (window.innerWidth > 768) {
          setActiveConversaId(formattedConvs[0].id_conversa);
          loadMessages(formattedConvs[0].id_conversa);
        }
      }
    }
  }

  async function initializeChat(currentUser: any) {
    try {
      setLoading(true);
      
      // Fetch user profile type
      const { data: profData } = await supabase
        .from("usuario")
        .select("tipo")
        .eq("id_usuario", currentUser.id)
        .maybeSingle();
      if (profData) {
        setIsOng(profData.tipo === "ong");
      }

      // 1. If doacao parameter is present, check/create conversation first
      let selectId: number | null = null;
      if (doacaoParam) {
        const doacaoId = parseInt(doacaoParam);
        if (!isNaN(doacaoId)) {
          // Fetch donation details to verify the donor and items
          const { data: doacaoData, error: doacaoError } = await supabase
            .from("doacao")
            .select("id_usuario")
            .eq("id_doacao", doacaoId)
            .single();

          if (!doacaoError && doacaoData) {
            const donorId = doacaoData.id_usuario;
            
            // Users cannot start a chat with themselves
            if (donorId !== currentUser.id) {
              // Search for an existing conversation
              const { data: existingConvs, error: existError } = await supabase
                .from("conversa")
                .select("id_conversa")
                .eq("id_doador", donorId)
                .eq("id_interessado", currentUser.id)
                .eq("id_doacao", doacaoId);

              if (!existError && existingConvs && existingConvs.length > 0) {
                selectId = existingConvs[0].id_conversa;
              } else {
                // Create a new conversation
                const { data: newConv, error: createError } = await supabase
                  .from("conversa")
                  .insert({
                    id_doador: donorId,
                    id_interessado: currentUser.id,
                    id_doacao: doacaoId
                  })
                  .select("id_conversa")
                  .single();

                if (!createError && newConv) {
                  selectId = newConv.id_conversa;
                }
              }
            }
          }
        }
      }

      // 2. Fetch all conversations for the sidebar
      await fetchConversations(currentUser.id, selectId);

    } catch (err) {
      console.error("Erro ao inicializar o chat:", err);
    } finally {
      setLoading(false);
    }
  }

  // Send a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConversaId || !user || sending) return;

    setSending(true);
    const textToSend = newMessageText.trim();
    setNewMessageText("");

    try {
      const { error } = await supabase.from("mensagem").insert({
        id_conversa: activeConversaId,
        id_remetente: user.id,
        texto: textToSend,
        lido: false
      });

      if (error) throw error;
      
      // Trigger scroll and local visual layout updates
      scrollToBottom();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      // Rollback text in input if failed
      setNewMessageText(textToSend);
    } finally {
      setSending(false);
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (!activeConversa || !activeConversa.doacao || !user) return;
    setProcessingWithdrawal(true);

    try {
      const { error } = await supabase
        .from("doacao")
        .update({
          status: "RETIRADA",
          id_usuario_ong: user.id
        })
        .eq("id_doacao", activeConversa.doacao.id_doacao);

      if (error) throw error;

      // Update state locally
      setConversations(prevList =>
        prevList.map(c =>
          c.id_conversa === activeConversa.id_conversa && c.doacao
            ? {
                ...c,
                doacao: {
                  ...c.doacao,
                  status: "RETIRADA",
                  id_usuario_ong: user.id
                }
              }
            : c
        )
      );
    } catch (err) {
      console.error("Erro ao confirmar retirada no chat:", err);
      alert("Erro ao confirmar retirada. Tente novamente.");
    } finally {
      setProcessingWithdrawal(false);
      setIsConfirmingWithdrawal(false);
    }
  };

  useEffect(() => {
    if (activeConversaId !== lastActiveConversaIdRef.current) {
      scrollToBottom("auto");
      lastActiveConversaIdRef.current = activeConversaId;
    } else {
      scrollToBottom("smooth");
    }
  }, [messages, activeConversaId]);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);

    let authUser: any = null;

    // Load user and check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        authUser = session.user;
        setUser(session.user);
        initializeChat(session.user);
      } else {
        router.push("/login");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter conversations in sidebar
  const filteredConversations = conversations.filter((c) => {
    const partner = user?.id === c.id_doador ? c.interessado : c.doador;
    const donationTitle = getDonationTitle(c);
    const query = searchTerm.toLowerCase();
    return (
      partner.nome.toLowerCase().includes(query) ||
      donationTitle.toLowerCase().includes(query)
    );
  });

  // Load chat detailed active data
  const activeConversa = conversations.find(c => c.id_conversa === activeConversaId);
  const activePartner = activeConversa && user 
    ? (user.id === activeConversa.id_doador ? activeConversa.interessado : activeConversa.doador)
    : null;

  // Render loading state
  if (!mounted || loading || !user) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10 justify-center">
          <div className="w-full h-[600px] bg-white border border-outline-variant/30 rounded-[32px] p-8 flex items-center justify-center shadow-sm">
            <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10 justify-start">
        
        {/* Chat Wrapper Container */}
        <div className="w-full bg-white border border-outline-variant/30 rounded-[32px] overflow-hidden shadow-sm flex h-[600px] md:h-[700px] text-left">
          
          {/* 1. Sidebar Panel (Conversations) */}
          <div 
            className={`${
              activeConversaId ? "hidden md:flex" : "flex"
            } w-full md:w-80 border-r border-outline-variant/20 flex-col bg-white shrink-0 h-full`}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant/10 flex flex-col gap-3">
              <h1 className="font-display text-2xl font-extrabold text-primary">
                Chat
              </h1>
              {/* Search filter input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low/50 border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary/15 outline-none transition-all font-body-md text-xs text-on-surface"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-on-surface-variant/40 absolute left-3 top-1/2 -translate-y-1/2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((c) => {
                  const partner = user.id === c.id_doador ? c.interessado : c.doador;
                  const isSelected = c.id_conversa === activeConversaId;
                  const donationTitle = getDonationTitle(c);
                  
                  // Initials for avatar
                  const initials = partner.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

                  return (
                    <button
                      key={c.id_conversa}
                      onClick={() => {
                        setActiveConversaId(c.id_conversa);
                        loadMessages(c.id_conversa);
                      }}
                      className={`w-full px-5 py-4 flex gap-3 text-left transition-all duration-200 outline-none select-none cursor-pointer relative items-center ${
                        isSelected 
                          ? "bg-primary-container/10" 
                          : "hover:bg-surface-container-low/30"
                      }`}
                    >
                      {/* Active highlight bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                      )}

                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold text-xs shrink-0 select-none">
                        {initials || "?"}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-display font-bold text-sm text-on-surface truncate">
                            {partner.nome}
                          </h4>
                          <span className="text-[10px] text-on-surface-variant/40 shrink-0 font-medium">
                            {c.last_message_time}
                          </span>
                        </div>
                        <p className="font-body-md text-xs font-semibold text-primary truncate">
                          Doação: {donationTitle}
                        </p>
                        <p className="font-body-md text-xs text-on-surface-variant/60 truncate">
                          {c.last_message}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-12 px-6 text-center text-on-surface-variant/50 font-body-md text-sm">
                  Nenhuma conversa encontrada
                </div>
              )}
            </div>

          </div>

          {/* 2. Message Area (Chat Window) */}
          <div 
            className={`${
              activeConversaId ? "flex" : "hidden md:flex"
            } flex-1 flex-col h-full bg-surface-container-low/20`}
          >
            {activeConversa && activePartner ? (
              <>
                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-outline-variant/15 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Mobile Back Button */}
                    <button 
                      onClick={() => setActiveConversaId(null)}
                      className="md:hidden p-1.5 rounded-full hover:bg-surface-variant/10 text-on-surface-variant/80 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.8" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 select-none">
                      {activePartner.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?"}
                    </div>

                    {/* Partner Name and Subtitle */}
                    <div className="flex flex-col text-left">
                      <h3 className="font-display font-bold text-sm md:text-base text-on-surface leading-tight">
                        {activePartner.nome}
                      </h3>
                      {activeConversa.doacao && (
                        <p className="font-body-md text-[11px] font-bold text-primary hover:underline leading-none pt-0.5">
                          Doação: {getDonationTitle(activeConversa)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Header Banner */}
                {activeConversa.doacao && (
                  <div className="px-6 py-2 bg-primary-container/10 border-b border-primary/10 text-xs font-semibold text-primary flex items-center justify-between select-none shrink-0 flex-wrap gap-2 animate-fade-in-scale">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-primary/70">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.083.758l-.041.02-.38.19a.75.75 0 01-1.083-.758l.38-.19zm.062-2.138a.75.75 0 111.06 1.06.75.75 0 01-1.06-1.06zm10.125 2.888a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
                      </svg>
                      {activeConversa.doacao.status === "RETIRADA" ? (
                        <span>Doação: <b>{getDonationTitle(activeConversa)}</b> (Retirada confirmada)</span>
                      ) : (
                        <span>Doação ativa: <b>{getDonationTitle(activeConversa)}</b></span>
                      )}
                    </div>
                    {isOng && activeConversa.doacao.status !== "RETIRADA" && activeConversa.doacao.status !== "CANCELADA" && (
                      <button
                        onClick={() => setIsConfirmingWithdrawal(true)}
                        className="px-3 py-1 rounded-full bg-primary text-white font-bold hover:bg-primary/95 transition-all text-[10px] cursor-pointer shadow-sm active:scale-95"
                      >
                        Confirmar Retirada
                      </button>
                    )}
                  </div>
                )}

                {/* Messages List */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 p-6 overflow-y-auto space-y-4"
                >
                  {messages.length > 0 ? (
                    messages.map((m) => {
                      const isMe = m.id_remetente === user.id;
                      
                      return (
                        <div 
                          key={m.id_mensagem}
                          className={`flex gap-2 w-full ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {/* Partner Avatar (left side only) */}
                          {!isMe && (
                            <div className="w-7 h-7 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold text-[10px] shrink-0 select-none self-end mt-1">
                              {activePartner.nome.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?"}
                            </div>
                          )}

                          {/* Bubble Container */}
                          <div 
                            className={`max-w-[70%] px-4 py-3 rounded-2xl flex flex-col gap-1 shadow-xs leading-relaxed ${
                              isMe 
                                ? "bg-primary-container/20 text-on-primary-container rounded-br-none" 
                                : "bg-secondary-container/20 text-on-secondary-container rounded-bl-none"
                            }`}
                          >
                            <span className="font-body-md text-sm whitespace-pre-wrap word-break">
                              {m.texto}
                            </span>
                            <span className="text-[9px] opacity-50 self-end font-medium leading-none mt-0.5">
                              {formatMessageTime(m.data_envio)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-center p-12 text-on-surface-variant/40 font-body-md text-sm">
                      Diga olá para {activePartner.nome} e combinem a retirada!
                    </div>
                  )}
                  {/* Container scroll target */}
                </div>

                {/* Footer Input Bar */}
                <div className="p-4 bg-white border-t border-outline-variant/15 shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    
                    {/* Attachment / Smiley Decors */}
                    <div className="flex gap-1.5 text-on-surface-variant/40 shrink-0">
                      <button 
                        type="button" 
                        title="Adicionar arquivo" 
                        onClick={() => alert("Anexar arquivos não disponível nesta demonstração.")}
                        className="p-2 rounded-full hover:bg-surface-variant/10 cursor-pointer active:scale-95 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.625-13.624l-1.066-1.067a3 3 0 00-4.242 0L2.621 12.45a3 3 0 000 4.242l1.067 1.067" />
                        </svg>
                      </button>
                      <button 
                        type="button" 
                        title="Adicionar emoji" 
                        onClick={() => alert("Seleção de emojis não disponível nesta demonstração.")}
                        className="p-2 rounded-full hover:bg-surface-variant/10 cursor-pointer active:scale-95 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                      </button>
                    </div>

                    {/* Text Input */}
                    <div className="flex-1 relative flex items-center bg-white border border-outline-variant/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all rounded-2xl px-4 py-2.5 shadow-xs">
                      <input
                        type="text"
                        placeholder="Escreva sua mensagem..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="w-full bg-transparent outline-none text-on-surface font-body-md placeholder:text-on-surface-variant/40 text-sm"
                      />
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!newMessageText.trim() || sending}
                      className="w-10 h-10 rounded-2xl bg-secondary text-white hover:bg-secondary/90 active:scale-[0.96] transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 rotate-45 -translate-x-0.5 translate-y-0.5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </button>

                  </form>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="w-20 h-20 text-on-surface-variant/20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.084.18.125.378.125.578v10.999c0 1.518-1.23 2.75-2.75 2.75H6.375c-1.517 0-2.75-1.232-2.75-2.75V9.089c0-.2.041-.397.125-.577m16.5 0a2.25 2.25 0 00-1.944-1.158H18.75m3 1.158A2.244 2.244 0 0118 7.5c-.53 0-1.016-.184-1.402-.49L13.9.828A1.125 1.125 0 0013.2 0h-2.4c-.262 0-.51.104-.693.288L7.4 7.01C7.016 7.316 6.53 7.5 6 7.5c-.9 0-1.685-.533-2.056-1.158m0 0a2.25 2.25 0 01-1.944-1.158h1.082m0 0A2.25 2.25 0 004.5 4.5V3.375c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125V4.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <div className="space-y-1">
                  <p className="font-display text-lg font-bold text-on-surface">
                    Selecione uma conversa
                  </p>
                  <p className="font-body-md text-sm text-on-surface-variant/60 max-w-sm">
                    Escolha uma conversa ao lado para enviar mensagens ou gerenciar a retirada de alimentos.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Confirm Withdrawal Modal */}
      {isConfirmingWithdrawal && activeConversa && activeConversa.doacao && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs cursor-pointer select-none"
          onClick={() => {
            if (!processingWithdrawal) setIsConfirmingWithdrawal(false);
          }}
        >
          <div
            className="w-full max-w-[448px] bg-white border border-surface-variant/20 rounded-[32px] p-6 md:p-8 shadow-2xl text-left cursor-default flex flex-col gap-6 animate-in fade-in-50 zoom-in-95 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
                🤝 Confirmar Retirada
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant/80">
                Você confirma o recebimento/retirada da doação <b>{getDonationTitle(activeConversa)}</b>? Esta ação registrará o resgate da doação pela sua ONG.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={processingWithdrawal}
                onClick={() => setIsConfirmingWithdrawal(false)}
                className="w-1/2 py-3.5 rounded-2xl border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-variant/10 active:scale-[0.98] transition-all cursor-pointer text-center text-sm disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={processingWithdrawal}
                onClick={handleConfirmWithdrawal}
                className="w-1/2 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/95 active:scale-[0.98] transition-all cursor-pointer text-center text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processingWithdrawal ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Sim, Retirada!"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
