"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export interface Donation {
  id: string;
  id_doacao: number;
  id_doador: string;
  title: string;
  donor: string;
  location: string;
  time: string;
  urgente: boolean;
  distance: number; // em km
  timestamp: string; // formato ISO
  image: string;
}

interface DonationsListProps {
  initialDonations: Donation[];
}

export default function DonationsList({ initialDonations }: DonationsListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recentes"); // "recentes" | "proximas" | "urgentes"
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOng, setIsOng] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        supabase
          .from("usuario")
          .select("tipo")
          .eq("id_usuario", session.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!error && data) {
              setIsOng(data.tipo === "ong");
            }
          });
      }
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtragem dos dados no cliente
  const filteredDonations = initialDonations.filter((donation) => {
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
    <div className="w-full flex flex-col gap-10">
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
                <Image
                  src={donation.image}
                  alt={`Imagem ilustrativa de ${donation.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="w-full h-full object-cover"
                />
                {donation.urgente && (
                  <div className="absolute top-3 right-3 bg-secondary text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse z-10">
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

                <div className="flex flex-col gap-2 w-full mt-2">
                  {(!currentUser || isOng) ? (
                    <button
                      onClick={() => router.push(`/chat?doacao=${donation.id_doacao}`)}
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-secondary text-white font-bold hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-sm cursor-pointer text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      </svg>
                      Entrar em Contato
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-surface-variant/25 border border-outline-variant/30 text-on-surface-variant/40 font-bold transition-all text-sm cursor-not-allowed"
                      title="Apenas ONGs parceiras podem entrar em contato para resgatar doações"
                    >
                      Contato restrito a ONGs
                    </button>
                  )}
                </div>
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
    </div>
  );
}
