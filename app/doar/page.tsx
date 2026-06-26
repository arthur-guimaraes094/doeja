"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "@/lib/supabase";

interface FormItem {
  id: string; // client-side unique id for key and manipulation
  nome_alimento: string;
  quantidade: string;
  unidade: string;
  data_validade: string;
}

interface Endereco {
  id_endereco: number;
  id_usuario: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  identificador?: string;
  principal: boolean;
}

export default function DoarPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [observacao, setObservacao] = useState("");
  const [items, setItems] = useState<FormItem[]>([
    {
      id: "initial-item-1",
      nome_alimento: "",
      quantidade: "1",
      unidade: "kg",
      data_validade: "",
    },
  ]);

  // Address states
  const [addresses, setAddresses] = useState<Endereco[]>([]);
  const [addressType, setAddressType] = useState<"saved" | "custom">("saved");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [customAddress, setCustomAddress] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [isSavedAddressesDropdownOpen, setIsSavedAddressesDropdownOpen] = useState(false);
  const savedAddressRef = useRef<HTMLDivElement>(null);

  // Error/Success state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (savedAddressRef.current && !savedAddressRef.current.contains(event.target as Node)) {
        setIsSavedAddressesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          setLoading(false);
          window.location.replace("/login");
          return;
        }

        setUser(authUser);
        hasLoadedUser = true;

        // Fetch user addresses
        const { data: addressData, error: addressError } = await supabase
          .from("endereco")
          .select("*")
          .eq("id_usuario", authUser.id)
          .order("principal", { ascending: false });

        if (!addressError && addressData && addressData.length > 0) {
          setAddresses(addressData);
          setAddressType("saved");
          const principalAddr = addressData.find((addr) => addr.principal);
          if (principalAddr) {
            setSelectedAddressId(principalAddr.id_endereco);
          } else {
            setSelectedAddressId(addressData[0].id_endereco);
          }
        } else {
          setAddressType("custom");
        }
      } catch (err: any) {
        console.error("Erro ao verificar autenticação:", err);
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

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/\D/g, "").slice(0, 8);
    
    let formatted = cleanValue;
    if (cleanValue.length > 5) {
      formatted = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5)}`;
    }
    
    setCustomAddress(prev => ({ ...prev, cep: formatted }));

    if (cleanValue.length === 8) {
      try {
        setLoadingCep(true);
        const res = await fetch(`https://viacep.com.br/ws/${cleanValue}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCustomAddress(prev => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  // Add a new empty row to items
  const handleAddItem = () => {
    const newId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        nome_alimento: "",
        quantidade: "1",
        unidade: "kg",
        data_validade: "",
      },
    ]);
  };

  // Remove a row from items
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setErrorMsg("Sua doação deve conter pelo menos um alimento.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Change individual field of a row
  const handleItemFieldChange = (id: string, field: keyof FormItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) {
      setErrorMsg("Você precisa estar logado para cadastrar uma doação.");
      return;
    }

    // Validation
    if (items.length === 0) {
      setErrorMsg("Adicione pelo menos um alimento à doação.");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.nome_alimento.trim()) {
        setErrorMsg(`O nome do alimento na linha ${i + 1} está em branco.`);
        return;
      }
      const qty = parseFloat(item.quantidade);
      if (isNaN(qty) || qty <= 0) {
        setErrorMsg(`A quantidade do alimento "${item.nome_alimento}" deve ser maior que zero.`);
        return;
      }
    }

    // Address Validation
    const isSaved = addressType === "saved" && selectedAddressId !== null;
    if (addressType === "custom") {
      const { cep, rua, numero, bairro, cidade, estado } = customAddress;
      if (!cep || !rua || !numero || !bairro || !cidade || !estado) {
        setErrorMsg("Por favor, preencha todos os campos obrigatórios do endereço de retirada.");
        return;
      }
    } else {
      if (addresses.length > 0 && selectedAddressId === null) {
        setErrorMsg("Por favor, selecione um endereço cadastrado para a retirada.");
        return;
      }
    }

    setSaving(true);

    try {
      // 1. Insert into `doacao` table and get the id_doacao
      const { data: doacaoData, error: doacaoError } = await supabase
        .from("doacao")
        .insert({
          id_usuario: user.id,
          status: "PENDENTE",
          observacao: observacao.trim() || null,
          id_endereco: isSaved ? selectedAddressId : null,
          endereco_customizado: !isSaved ? JSON.stringify(customAddress) : null,
        })
        .select("id_doacao")
        .single();

      if (doacaoError) throw doacaoError;
      if (!doacaoData) {
        throw new Error("Erro ao recuperar os dados da doação criada.");
      }

      const generatedIdDoacao = doacaoData.id_doacao;

      // 2. Prepare items payload
      const itemsPayload = items.map((item) => ({
        id_doacao: generatedIdDoacao,
        nome_alimento: item.nome_alimento.trim(),
        quantidade: parseFloat(item.quantidade),
        unidade: item.unidade,
        data_validade: item.data_validade || null,
      }));

      // 3. Insert items into `item_doacao`
      const { error: itemsError } = await supabase
        .from("item_doacao")
        .insert(itemsPayload);

      if (itemsError) {
        // Rollback-like: attempt to delete parent doacao to clean up if items insert failed
        await supabase.from("doacao").delete().eq("id_doacao", generatedIdDoacao);
        throw itemsError;
      }

      setSuccessMsg("Doação cadastrada com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/minhas-doacoes");
      }, 1500);

    } catch (err: any) {
      console.error("Erro ao salvar doação:", err);
      setErrorMsg(err.message || "Ocorreu um erro ao salvar a doação. Tente novamente.");
      setSaving(false);
    }
  };

  // Render Skeleton while checking session
  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col gap-10">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-surface-variant/30 rounded-xl animate-pulse"></div>
            <div className="h-5 w-96 bg-surface-variant/20 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-96 bg-surface-variant/20 rounded-[32px] animate-pulse"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Navigation & Header */}
        <div className="space-y-4 text-left">
          <Link
            href="/minhas-doacoes"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant/70 hover:text-primary transition-all px-3 py-1.5 rounded-full hover:bg-primary-container/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.8" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Voltar para Minhas Doações
          </Link>
          
          <div className="space-y-2">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-secondary tracking-tight">
              Nova Doação
            </h1>
            <p className="font-body-lg text-body-md text-on-surface-variant font-medium">
              Preencha os dados dos alimentos abaixo. Lembre-se de certificar-se da integridade e data de validade dos mantimentos.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full bg-white border border-outline-variant/30 rounded-[32px] p-6 md:p-10 shadow-sm flex flex-col gap-8 text-left">
          
          {/* Section 1: Alimentos */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-surface-variant/15 pb-3">
              <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                🍎 Alimentos Doados
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary text-primary font-bold hover:bg-primary-container/10 active:scale-[0.97] transition-all text-xs cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7-7H5" />
                </svg>
                Adicionar Alimento
              </button>
            </div>

            {/* List of Form rows */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-surface-container-low/40 p-4 rounded-2xl border border-surface-variant/10 hover:border-outline-variant/40 transition-all"
                >
                  {/* Nome do Alimento */}
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Alimento {index + 1}
                    </label>
                    <input
                      type="text"
                      value={item.nome_alimento}
                      onChange={(e) => handleItemFieldChange(item.id, "nome_alimento", e.target.value)}
                      placeholder="Ex: Arroz Integral, Feijão Carioca..."
                      required
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>

                  {/* Quantidade */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Qtd.
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={item.quantidade}
                      onChange={(e) => handleItemFieldChange(item.id, "quantidade", e.target.value)}
                      placeholder="Ex: 5"
                      required
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>

                  {/* Unidade */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Unidade
                    </label>
                    <UnidadeSelect
                      value={item.unidade}
                      onChange={(val) => handleItemFieldChange(item.id, "unidade", val)}
                    />
                  </div>

                  {/* Validade */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Validade
                    </label>
                    <input
                      type="date"
                      value={item.data_validade}
                      onChange={(e) => handleItemFieldChange(item.id, "data_validade", e.target.value)}
                      className="w-full h-[52px] px-3 py-3 rounded-2xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface cursor-pointer"
                    />
                  </div>

                  {/* Delete Action */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-[52px] h-[52px] rounded-2xl hover:bg-red-50 text-on-surface-variant/60 hover:text-red-600 flex items-center justify-center border border-transparent hover:border-red-200 transition-all cursor-pointer"
                      title="Excluir item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0M4.5 18.06l12-12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Observações */}
          <div className="space-y-4 border-t border-surface-variant/15 pt-6">
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
              📝 Instruções de Retirada
            </h2>
            
            <div className="space-y-1.5">
              <label htmlFor="observacao" className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                Observações Adicionais (Opcional)
              </label>
              <textarea
                id="observacao"
                rows={4}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: Alimentos guardados em temperatura ambiente. Disponível para retirada à tarde no portão principal..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface resize-none leading-relaxed"
              ></textarea>
              <span className="text-[11px] text-on-surface-variant/50 block pl-1">
                Adicione detalhes de horário, ponto de referência ou restrições de manuseio para facilitar a entrega para as ONGs.
              </span>
            </div>
          </div>

          {/* Section 3: Local de Retirada */}
          <div className="space-y-5 border-t border-surface-variant/15 pt-6 w-full">
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
              📍 Local de Retirada
            </h2>

            {/* Toggle Buttons */}
            <div className="flex bg-surface-container-low/40 p-1.5 rounded-2xl border border-surface-variant/10 w-fit">
              <button
                type="button"
                onClick={() => {
                  if (addresses.length > 0) {
                    setAddressType("saved");
                  } else {
                    alert("Você não possui endereços cadastrados no seu perfil.");
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none ${
                  addressType === "saved"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant/65 hover:text-on-surface hover:bg-surface-variant/10"
                }`}
              >
                Endereço Cadastrado
              </button>
              <button
                type="button"
                onClick={() => setAddressType("custom")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer select-none ${
                  addressType === "custom"
                    ? "bg-primary text-white shadow-xs"
                    : "text-on-surface-variant/65 hover:text-on-surface hover:bg-surface-variant/10"
                }`}
              >
                Outro Endereço (Personalizado)
              </button>
            </div>

            {/* Content Based on Toggle */}
            {addressType === "saved" ? (
              <div className="space-y-2 w-full max-w-[576px] text-left" ref={savedAddressRef}>
                <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                  Selecione o Endereço
                </label>
                <div className="relative w-full h-[52px]">
                  <div
                    className={`absolute top-0 left-0 w-full bg-white border rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] z-40 flex flex-col ${
                      isSavedAddressesDropdownOpen
                        ? "h-[200px] border-primary shadow-lg overflow-y-auto"
                        : "h-[52px] border-outline-variant/60"
                    }`}
                  >
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id_endereco;
                      const labelText = `${addr.identificador || "Endereço"}: ${addr.rua}, ${addr.numero} - ${addr.bairro}, ${addr.cidade}`;
                      const shouldShow = isSavedAddressesDropdownOpen || isSelected;

                      let itemClasses = "";
                      if (isSavedAddressesDropdownOpen) {
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
                          key={addr.id_endereco}
                          type="button"
                          onClick={() => {
                            if (!isSavedAddressesDropdownOpen) {
                              setIsSavedAddressesDropdownOpen(true);
                            } else {
                              setSelectedAddressId(addr.id_endereco);
                              setIsSavedAddressesDropdownOpen(false);
                            }
                          }}
                          className={`w-full text-left px-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] cursor-pointer flex items-center justify-between outline-none select-none shrink-0 ${itemClasses} ${
                            shouldShow
                              ? "h-[50px] opacity-100 py-3"
                              : "h-0 opacity-0 py-0 pointer-events-none"
                          }`}
                        >
                          <span className="font-body-md text-xs truncate pr-4">
                            {labelText}
                          </span>
                          <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                            {isSavedAddressesDropdownOpen && isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-primary">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                            {!isSavedAddressesDropdownOpen && isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-on-surface-variant/40">
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Custom Address Form */
              <div className="space-y-4 max-w-[672px] animate-fade-in-scale">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {/* CEP */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      CEP *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customAddress.cep}
                        onChange={handleCepChange}
                        placeholder="Ex: 59000-000"
                        required={addressType === "custom"}
                        className="w-full h-[52px] px-4 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                      />
                      {loadingCep && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                      )}
                    </div>
                  </div>

                  {/* Rua */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Rua *
                    </label>
                    <input
                      type="text"
                      value={customAddress.rua}
                      onChange={(e) => setCustomAddress(prev => ({ ...prev, rua: e.target.value }))}
                      placeholder="Nome da rua/avenida"
                      required={addressType === "custom"}
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {/* Número */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={customAddress.numero}
                      onChange={(e) => setCustomAddress(prev => ({ ...prev, numero: e.target.value }))}
                      placeholder="Ex: 123"
                      required={addressType === "custom"}
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>

                  {/* Complemento */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Complemento (Opcional)
                    </label>
                    <input
                      type="text"
                      value={customAddress.complemento}
                      onChange={(e) => setCustomAddress(prev => ({ ...prev, complemento: e.target.value }))}
                      placeholder="Ex: Apto 101, Bloco B"
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {/* Bairro */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={customAddress.bairro}
                      onChange={(e) => setCustomAddress(prev => ({ ...prev, bairro: e.target.value }))}
                      placeholder="Ex: Lagoa Nova"
                      required={addressType === "custom"}
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>

                  {/* Cidade */}
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={customAddress.cidade}
                      onChange={(e) => setCustomAddress(prev => ({ ...prev, cidade: e.target.value }))}
                      placeholder="Ex: Natal"
                      required={addressType === "custom"}
                      className="w-full h-[52px] px-4 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>

                  {/* Estado */}
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      UF *
                    </label>
                    <input
                      type="text"
                      value={customAddress.estado}
                      onChange={(e) => setCustomAddress(prev => ({ ...prev, estado: e.target.value.toUpperCase() }))}
                      placeholder="RN"
                      maxLength={2}
                      required={addressType === "custom"}
                      className="w-full h-[52px] px-3 py-3 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface text-center"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold animate-fade-in-scale">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-[#edf2e2] border border-primary/20 text-primary text-sm font-semibold animate-fade-in-scale">
              {successMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/95 active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                Finalizar Cadastro da Doação
              </>
            )}
          </button>

        </form>

      </main>

      <Footer />
    </>
  );
}

// Custom Unidade Select Component with matching design to DonationsList's sort dropdown
interface UnidadeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

function UnidadeSelect({ value, onChange }: UnidadeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "kg", label: "kg" },
    { value: "g", label: "g" },
    { value: "L", label: "Litros (L)" },
    { value: "ml", label: "ml" },
    { value: "unidades", label: "Unidades" },
    { value: "pacotes", label: "Pacotes" },
    { value: "cestas", label: "Cestas Básicas" },
  ];

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative w-full h-[52px]" ref={containerRef}>
      <div
        className={`absolute top-0 left-0 w-full bg-white border rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] z-30 flex flex-col ${
          isOpen
            ? "h-[352px] border-primary shadow-lg"
            : "h-[52px] border-outline-variant/60"
        }`}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const shouldShow = isOpen || isSelected;

          let itemClasses = "";
          if (isOpen) {
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
                if (!isOpen) {
                  setIsOpen(true);
                } else {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              className={`w-full text-left px-4 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1.1)] cursor-pointer flex items-center justify-between outline-none select-none shrink-0 ${itemClasses} ${
                shouldShow
                  ? "h-[50px] opacity-100 py-3"
                  : "h-0 opacity-0 py-0 pointer-events-none"
              }`}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className="font-body-md text-sm leading-none">
                {option.label}
              </span>

              {/* Icon container */}
              <div className="relative w-4 h-4 shrink-0 flex items-center justify-center">
                {/* Checkmark icon (only when open and selected) */}
                <div
                  className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${
                    isOpen && isSelected
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
                    !isOpen && isSelected
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
  );
}
