"use client";

import React, { useState, useEffect } from "react";
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

  // Error/Success state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

    setSaving(true);

    try {
      // 1. Insert into `doacao` table and get the id_doacao
      const { data: doacaoData, error: doacaoError } = await supabase
        .from("doacao")
        .insert({
          id_usuario: user.id,
          status: "PENDENTE",
          observacao: observacao.trim() || null,
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
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
                      className="w-full px-4 py-3 rounded-xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface"
                    />
                  </div>

                  {/* Unidade */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                      Unidade
                    </label>
                    <select
                      value={item.unidade}
                      onChange={(e) => handleItemFieldChange(item.id, "unidade", e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface cursor-pointer"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">Litros (L)</option>
                      <option value="ml">ml</option>
                      <option value="unidades">Unidades</option>
                      <option value="pacotes">Pacotes</option>
                      <option value="cestas">Cestas Básicas</option>
                    </select>
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
                      className="w-full px-3 py-3 rounded-xl bg-white border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-sm text-on-surface cursor-pointer"
                    />
                  </div>

                  {/* Delete Action */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-11 h-11 rounded-xl hover:bg-red-50 text-on-surface-variant/60 hover:text-red-600 flex items-center justify-center border border-transparent hover:border-red-200 transition-all cursor-pointer"
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
