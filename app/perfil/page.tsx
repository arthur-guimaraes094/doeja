"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "@/lib/supabase";

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

interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  telefone: string;
  data_cadastro?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Usuario>({
    id_usuario: "",
    nome: "",
    email: "",
    telefone: "",
  });
  const [addresses, setAddresses] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  
  // Profile Success/Error Msg
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Endereco | null>(null);
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);

  const fetchAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from("endereco")
      .select("*")
      .eq("id_usuario", userId)
      .order("principal", { ascending: false })
      .order("id_endereco", { ascending: true });

    if (!error && data) {
      setAddresses(data);
    }
  };

  // Fetch all user data and listen for auth state changes
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
          setProfile({
            id_usuario: "",
            nome: "",
            email: "",
            telefone: "",
          });
          setAddresses([]);
          setLoading(false);
          window.location.replace("/login");
          return;
        }

        setUser(authUser);
        hasLoadedUser = true;

        // Fetch profile
        let { data: profileData, error: profileError } = await supabase
          .from("usuario")
          .select("*")
          .eq("id_usuario", authUser.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // Auto-create profile row if it doesn't exist yet
        if (!profileData) {
          const { data: newProfile, error: insertError } = await supabase
            .from("usuario")
            .insert({
              id_usuario: authUser.id,
              nome: authUser.user_metadata?.nome || authUser.user_metadata?.full_name || "Usuário",
              email: authUser.email || "",
              telefone: authUser.user_metadata?.telefone || "",
            })
            .select()
            .single();

          if (insertError) throw insertError;
          profileData = newProfile;
        }

        if (profileData) {
          setProfile({
            id_usuario: profileData.id_usuario,
            nome: profileData.nome,
            email: profileData.email,
            telefone: profileData.telefone || "",
          });
        }

        // Fetch addresses
        await fetchAddresses(authUser.id);

      } catch (err: any) {
        console.error("Erro ao carregar dados do perfil:", err);
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

    // Listen for auth state changes (e.g. logging out from header)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null);
        setProfile({
          id_usuario: "",
          nome: "",
          email: "",
          telefone: "",
        });
        setAddresses([]);
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

  // Lock body scroll and prevent layout shift when any modal is open
  useEffect(() => {
    const isAnyModalOpen = isAddressModalOpen || deleteAddressId !== null;
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
  }, [isAddressModalOpen, deleteAddressId]);

  // Masked phone formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/\D/g, "");
    
    let formattedValue = "";
    if (cleanValue.length > 0) {
      formattedValue = `(${cleanValue.slice(0, 2)}`;
      
      if (cleanValue.length > 2) {
        formattedValue += `) ${cleanValue.slice(2, 7)}`;
      }
      if (cleanValue.length > 7) {
        formattedValue += `-${cleanValue.slice(7, 11)}`;
      }
    }
    setProfile(prev => ({ ...prev, telefone: formattedValue }));
  };



  // Save profile info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    if (!profile.nome.trim()) {
      setProfileError("O nome é obrigatório.");
      setSavingProfile(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("usuario")
        .update({
          nome: profile.nome,
          telefone: profile.telefone,
        })
        .eq("id_usuario", user.id);

      if (error) throw error;
      setProfileSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (err: any) {
      console.error(err);
      setProfileError(err.message || "Erro ao salvar informações do perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Delete address action
  const confirmDeleteAddress = async () => {
    if (deleteAddressId === null) return;

    try {
      const { error } = await supabase
        .from("endereco")
        .delete()
        .eq("id_endereco", deleteAddressId);

      if (error) throw error;
      setAddresses(prev => prev.filter(addr => addr.id_endereco !== deleteAddressId));
    } catch (err: any) {
      console.error(err);
      setProfileError("Erro ao excluir endereço.");
      setTimeout(() => setProfileError(""), 4000);
    } finally {
      setDeleteAddressId(null);
    }
  };

  // Set address as primary
  const handleSetPrincipal = async (id_endereco: number) => {
    try {
      // 1. Reset all addresses principal flag to false
      const { error: resetError } = await supabase
        .from("endereco")
        .update({ principal: false })
        .eq("id_usuario", user.id);

      if (resetError) throw resetError;

      // 2. Set this one to true
      const { error: setOkError } = await supabase
        .from("endereco")
        .update({ principal: true })
        .eq("id_endereco", id_endereco);

      if (setOkError) throw setOkError;

      // Update state locally and reorder
      setAddresses(prev =>
        prev
          .map(addr => ({
            ...addr,
            principal: addr.id_endereco === id_endereco,
          }))
          .sort((a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0))
      );
    } catch (err: any) {
      console.error(err);
      alert("Erro ao definir endereço principal.");
    }
  };

  // Modal open helpers
  const openAddAddressModal = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: Endereco) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Render loading skeleton if loading or user is not logged in
  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-8">
          <div className="h-10 w-48 bg-surface-variant/30 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 h-96 bg-surface-variant/20 rounded-3xl animate-pulse"></div>
            <div className="lg:col-span-8 h-96 bg-surface-variant/20 rounded-3xl animate-pulse"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className={isAddressModalOpen || deleteAddressId !== null ? "pointer-events-none select-none" : ""}>
        <Header />

        <main className="w-full min-h-screen bg-background text-on-surface py-12 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Page Title */}
        <div className="space-y-2">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-secondary tracking-tight text-left">
            Meu Perfil
          </h1>
          <p className="font-body-lg text-body-md text-on-surface-variant font-medium text-left">
            Gerencie suas informações pessoais e endereços de entrega ou retirada.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Column: Account Profile Info */}
          <section className="lg:col-span-5 bg-white border border-surface-variant/30 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col gap-6 text-left">
            <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Dados da Conta
            </h2>

            {/* Avatar & Subheader */}
            <div className="flex items-center gap-4 py-2 border-b border-surface-variant/10">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-primary to-primary-container text-white flex items-center justify-center font-display text-2xl font-extrabold shadow-sm shrink-0 select-none">
                {getInitials(profile.nome)}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <p className="font-display text-lg font-bold text-on-surface truncate">{profile.nome || "Doador"}</p>
                <p className="font-body-md text-xs text-on-surface-variant/60 truncate">{profile.email}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="nome" className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={profile.nome}
                  onChange={(e) => setProfile(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Seu nome completo"
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-body-md text-on-surface"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                  E-mail (Login)
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-5 py-3.5 rounded-2xl bg-surface-variant/20 border border-outline-variant/30 font-body-md text-body-md text-on-surface-variant/60 cursor-not-allowed select-none"
                />
                <span className="text-[11px] text-on-surface-variant/50 block pl-1">
                  O e-mail é associado à sua conta e não pode ser alterado.
                </span>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="telefone" className="font-label-md text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                  Telefone / WhatsApp
                </label>
                <input
                  id="telefone"
                  type="text"
                  value={profile.telefone}
                  onChange={handlePhoneChange}
                  placeholder="(84) 99999-9999"
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all font-body-md text-body-md text-on-surface"
                />
              </div>

              {profileError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div className="p-4 rounded-2xl bg-primary-container/15 border border-primary/20 text-primary text-sm font-semibold">
                  {profileSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/95 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50 text-body-md"
              >
                {savingProfile ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Salvar Alterações
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Right Column: Address Management */}
          <section className="lg:col-span-7 bg-white border border-surface-variant/30 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col gap-6 text-left min-h-[500px]">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Meus Endereços
              </h2>

              <button
                type="button"
                onClick={openAddAddressModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-white font-bold hover:bg-secondary/90 active:scale-[0.97] transition-all shadow-sm text-xs cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.8" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7-7H5" />
                </svg>
                Novo Endereço
              </button>
            </div>

            {/* Address List */}
            {addresses.length > 0 ? (
              <div className="flex flex-col gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id_endereco}
                    className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      addr.principal
                        ? "border-primary bg-primary-container/5 shadow-sm"
                        : "border-outline-variant/30 hover:border-outline-variant/60"
                    }`}
                  >
                    {/* Left: Icon and details */}
                    <div className="flex items-start gap-4 grow">
                      {/* Address Tag Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-white border border-outline-variant/20 flex items-center justify-center shadow-xs shrink-0 select-none text-2xl">
                        {addr.identificador === "Casa" && "🏠"}
                        {addr.identificador === "Trabalho" && "💼"}
                        {addr.identificador !== "Casa" && addr.identificador !== "Trabalho" && "📍"}
                      </div>
                      
                      {/* Address details */}
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-on-surface">
                            {addr.identificador || "Endereço"}
                          </span>
                          {addr.principal && (
                            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="font-body-md text-sm text-on-surface-variant/80">
                          {addr.rua}, {addr.numero} {addr.complemento && ` - ${addr.complemento}`}
                        </p>
                        <p className="font-body-md text-xs text-on-surface-variant/60">
                          {addr.bairro}, {addr.cidade} - {addr.estado} • CEP: {addr.cep}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-2.5 shrink-0 border-t md:border-t-0 border-surface-variant/10 pt-3 md:pt-0">
                      {!addr.principal && (
                        <button
                          type="button"
                          onClick={() => handleSetPrincipal(addr.id_endereco)}
                          className="px-3 py-1.5 rounded-lg border border-outline-variant text-[11px] font-bold text-on-surface-variant hover:border-primary hover:text-primary transition-all cursor-pointer"
                        >
                          Usar como Principal
                        </button>
                      )}
                      
                      {/* Edit Icon Button */}
                      <button
                        type="button"
                        onClick={() => openEditAddressModal(addr)}
                        className="w-9 h-9 rounded-full hover:bg-primary-container/10 text-on-surface-variant/60 hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                        title="Editar Endereço"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>

                      {/* Delete Icon Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteAddressId(addr.id_endereco)}
                        className="w-9 h-9 rounded-full hover:bg-red-50 text-on-surface-variant/60 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer"
                        title="Excluir Endereço"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0M4.5 18.06l12-12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="w-full flex-1 border border-dashed border-outline-variant/60 rounded-3xl flex flex-col items-center justify-center text-center p-8 gap-4 bg-surface-container-lowest my-auto min-h-[300px]">
                <div className="w-14 h-14 rounded-full bg-surface-variant/20 flex items-center justify-center text-on-surface-variant/40">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-lg font-bold text-on-surface">Nenhum endereço cadastrado</p>
                  <p className="font-body-md text-sm text-on-surface-variant/70">
                    Adicione seus locais frequentes para facilitar o agendamento de doações.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddAddressModal}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/95 active:scale-[0.98] transition-all text-xs cursor-pointer shadow-sm mt-2"
                >
                  Adicionar Meu Primeiro Endereço
                </button>
              </div>
            )}
          </section>
        </div>

      </main>

      {/* Address Slide-in / Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        editingAddress={editingAddress}
        userId={user?.id}
        addressesCount={addresses.length}
        onAddressSaved={async () => {
          if (user) {
            await fetchAddresses(user.id);
          }
        }}
      />

      {/* Delete Address Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteAddressId !== null}
        onClose={() => setDeleteAddressId(null)}
        onConfirm={confirmDeleteAddress}
      />

        <Footer />
      </div>
    </>
  );
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress: Endereco | null;
  userId: string;
  addressesCount: number;
  onAddressSaved: () => Promise<void>;
}

function AddressModal({
  isOpen,
  onClose,
  editingAddress,
  userId,
  addressesCount,
  onAddressSaved,
}: AddressModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activePreset, setActivePreset] = useState<"Casa" | "Trabalho" | "Outro">("Casa");
  const [addressFormData, setAddressFormData] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    identificador: "Casa",
    principal: false,
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const id = editingAddress?.identificador || "Casa";
      const preset = (id === "Casa" || id === "Trabalho") ? id : "Outro";

      const data = editingAddress
        ? {
            cep: editingAddress.cep,
            rua: editingAddress.rua,
            numero: editingAddress.numero,
            complemento: editingAddress.complemento || "",
            bairro: editingAddress.bairro,
            cidade: editingAddress.cidade,
            estado: editingAddress.estado,
            identificador: id,
            principal: editingAddress.principal,
          }
        : {
            cep: "",
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            identificador: "Casa",
            principal: false,
          };
      setTimeout(() => {
        setActivePreset(preset as any);
        setAddressFormData(data);
      }, 0);
    }
  }, [editingAddress, isOpen]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleanValue = rawValue.replace(/\D/g, "").slice(0, 8);
    
    let formatted = cleanValue;
    if (cleanValue.length > 5) {
      formatted = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5)}`;
    }
    
    setAddressFormData(prev => ({ ...prev, cep: formatted }));

    if (cleanValue.length === 8) {
      try {
        setLoadingCep(true);
        const res = await fetch(`https://viacep.com.br/ws/${cleanValue}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddressFormData(prev => ({
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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    if (!addressFormData.cep || !addressFormData.rua || !addressFormData.numero || !addressFormData.bairro || !addressFormData.cidade || !addressFormData.estado) {
      alert("Preencha todos os campos obrigatórios.");
      setSavingAddress(false);
      return;
    }

    try {
      const isFirstAddress = addressesCount === 0;
      const willBePrincipal = isFirstAddress ? true : addressFormData.principal;

      if (willBePrincipal) {
        const { error: resetError } = await supabase
          .from("endereco")
          .update({ principal: false })
          .eq("id_usuario", userId);
        if (resetError) throw resetError;
      }

      if (editingAddress) {
        const { error } = await supabase
          .from("endereco")
          .update({
            cep: addressFormData.cep,
            rua: addressFormData.rua,
            numero: addressFormData.numero,
            complemento: addressFormData.complemento,
            bairro: addressFormData.bairro,
            cidade: addressFormData.cidade,
            estado: addressFormData.estado,
            identificador: addressFormData.identificador,
            principal: willBePrincipal,
          })
          .eq("id_endereco", editingAddress.id_endereco);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("endereco")
          .insert({
            id_usuario: userId,
            cep: addressFormData.cep,
            rua: addressFormData.rua,
            numero: addressFormData.numero,
            complemento: addressFormData.complemento,
            bairro: addressFormData.bairro,
            cidade: addressFormData.cidade,
            estado: addressFormData.estado,
            identificador: addressFormData.identificador,
            principal: willBePrincipal,
          });

        if (error) throw error;
      }

      onClose();
      await onAddressSaved();

    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar endereço.");
    } finally {
      setSavingAddress(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div 
      className="fixed z-50 flex items-center justify-center p-4 bg-black/45 cursor-pointer"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      data-lenis-prevent
    >
      {/* Modal Card */}
      <div 
        className="relative bg-white border border-surface-variant/10 rounded-[24px] md:rounded-[32px] overflow-y-auto md:overflow-y-visible shadow-2xl p-5 md:p-6 text-left flex flex-col gap-4 md:gap-5 cursor-default w-full max-w-[540px] max-h-[90vh] md:max-h-none"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-surface-variant/10 pb-3">
          <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
            {editingAddress ? "Editar Endereço" : "Novo Endereço"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-variant/20 flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSaveAddress} className="space-y-3 md:space-y-3.5">
          
          {/* Presets Identificador */}
          <div className="space-y-1.5">
            <label className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
              Identificador do Endereço
            </label>
            <div className="flex gap-2">
              {["Casa", "Trabalho", "Outro"].map((type) => {
                const isSelected = activePreset === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setActivePreset(type as any);
                      if (type === "Casa" || type === "Trabalho") {
                        setAddressFormData(prev => ({ ...prev, identificador: type }));
                      } else {
                        setAddressFormData(prev => ({ ...prev, identificador: "" }));
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-[#fff8f6] text-on-surface-variant/80 border-outline-variant hover:border-on-surface-variant/40"
                    }`}
                  >
                    {type === "Casa" && "🏠 Casa"}
                    {type === "Trabalho" && "💼 Trabalho"}
                    {type === "Outro" && "📍 Outro"}
                  </button>
                );
              })}
            </div>
            
            {/* Custom Label Input if Outro is selected */}
            {activePreset === "Outro" && (
              <input
                type="text"
                value={addressFormData.identificador}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, identificador: e.target.value }))}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  const lowerVal = val.toLowerCase();
                  if (lowerVal === "casa") {
                    setActivePreset("Casa");
                    setAddressFormData(prev => ({ ...prev, identificador: "Casa" }));
                  } else if (lowerVal === "trabalho") {
                    setActivePreset("Trabalho");
                    setAddressFormData(prev => ({ ...prev, identificador: "Trabalho" }));
                  } else if (val === "") {
                    setAddressFormData(prev => ({ ...prev, identificador: "Outro" }));
                  }
                }}
                placeholder="Ex: Casa de Campo, Mãe, etc."
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
              />
            )}
          </div>

          {/* Grid 1: CEP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="cep" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                CEP *
              </label>
              <div className="relative">
                <input
                  id="cep"
                  type="text"
                  value={addressFormData.cep}
                  onChange={handleCepChange}
                  placeholder="59000-000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
                  required
                />
                {loadingCep && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="estado" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                Estado (UF) *
              </label>
              <input
                id="estado"
                type="text"
                value={addressFormData.estado}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, estado: e.target.value.toUpperCase().slice(0, 2) }))}
                placeholder="RN"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
                required
              />
            </div>
          </div>

          {/* Grid 2: Cidade & Bairro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="cidade" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                Cidade *
              </label>
              <input
                id="cidade"
                type="text"
                value={addressFormData.cidade}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, cidade: e.target.value }))}
                placeholder="Natal"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="bairro" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                Bairro *
              </label>
              <input
                id="bairro"
                type="text"
                value={addressFormData.bairro}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, bairro: e.target.value }))}
                placeholder="Lagoa Nova"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
                required
              />
            </div>
          </div>

          {/* Grid 3: Rua & Numero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label htmlFor="rua" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                Rua / Avenida *
              </label>
              <input
                id="rua"
                type="text"
                value={addressFormData.rua}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, rua: e.target.value }))}
                placeholder="Av. Senador Salgado Filho"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="numero" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
                Número *
              </label>
              <input
                id="numero"
                type="text"
                value={addressFormData.numero}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, numero: e.target.value }))}
                placeholder="123"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
                required
              />
            </div>
          </div>

          {/* Complemento */}
          <div className="space-y-1">
            <label htmlFor="complemento" className="font-label-md text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider block">
              Complemento
            </label>
            <input
              id="complemento"
              type="text"
              value={addressFormData.complemento}
              onChange={(e) => setAddressFormData(prev => ({ ...prev, complemento: e.target.value }))}
              placeholder="Apto 402, Bloco B"
              className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-outline-variant/60 focus:border-primary outline-none transition-all font-body-md text-sm text-on-surface"
            />
          </div>

          {/* Set Principal Checkbox */}
          {addressesCount > 0 && (
            <div className="flex items-center gap-2.5 py-1">
              <input
                id="principal"
                type="checkbox"
                checked={addressFormData.principal}
                onChange={(e) => setAddressFormData(prev => ({ ...prev, principal: e.target.checked }))}
                className="w-4 h-4 accent-primary border-outline-variant rounded-md cursor-pointer"
              />
              <label htmlFor="principal" className="font-body-md text-xs text-on-surface font-medium cursor-pointer select-none">
                Definir como endereço principal
              </label>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-3 border-t border-surface-variant/10">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-variant/10 transition-all cursor-pointer text-center text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={savingAddress}
              className="w-1/2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 text-xs shadow-xs"
            >
              {savingAddress ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Salvar Endereço"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ isOpen, onClose, onConfirm }: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed z-50 flex items-center justify-center p-4 bg-black/45 cursor-pointer"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      data-lenis-prevent
    >
      {/* Modal Card */}
      <div
        className="relative bg-white border border-surface-variant/10 rounded-[24px] md:rounded-[28px] shadow-2xl p-6 text-center flex flex-col items-center gap-4 cursor-default w-full max-w-[340px] animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >

        {/* Modal Info */}
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-extrabold text-on-surface">
            Remover Endereço?
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant/80 leading-relaxed">
            Tem certeza que deseja remover este endereço? Essa ação não poderá ser desfeita.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 w-full pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-variant/10 transition-all cursor-pointer text-center text-xs"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all cursor-pointer text-center text-xs shadow-xs"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
