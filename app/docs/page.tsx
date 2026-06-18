"use client";

import React, { useEffect, useState } from "react";

export default function ApiDocsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let configScript: HTMLScriptElement | null = null;
    let scalarScript: HTMLScriptElement | null = null;

    async function initScalar() {
      try {
        // Fetch the local static OpenAPI spec from the public folder
        const res = await fetch("/openapi.json");
        
        if (!res.ok) {
          throw new Error(`Failed to fetch API spec: ${res.status}`);
        }
        
        const spec = await res.json();

        if (!active) return;

        // 1. Create the Scalar configuration element containing the loaded spec JSON
        configScript = document.createElement("script");
        configScript.id = "api-reference";
        configScript.type = "application/json";
        configScript.textContent = JSON.stringify(spec);
        
        // Configure Scalar layout and authentication pre-fills
        configScript.setAttribute(
          "data-configuration",
          JSON.stringify({
            theme: "default",
            authentication: {
              preferredSecurityScheme: "apikey",
              apikey: {
                token: "sb_publishable_r-jgFHGVTkpLH90bukXpVQ_UUbwsGRe",
              },
              bearerAuth: {
                token: "sb_publishable_r-jgFHGVTkpLH90bukXpVQ_UUbwsGRe",
              }
            }
          })
        );
        document.body.appendChild(configScript);

        // 2. Load the Scalar web component script
        scalarScript = document.createElement("script");
        scalarScript.src = "https://cdn.jsdelivr.net/npm/@scalar/api-reference";
        scalarScript.async = true;
        scalarScript.onload = () => {
          if (active) {
            setLoading(false);
          }
        };
        document.body.appendChild(scalarScript);
      } catch (err) {
        console.error("Error loading Scalar docs:", err);
      }
    }

    initScalar();

    // Clean up script tags on unmount
    return () => {
      active = false;
      if (configScript && document.body.contains(configScript)) {
        document.body.removeChild(configScript);
      }
      if (scalarScript && document.body.contains(scalarScript)) {
        document.body.removeChild(scalarScript);
      }
    };
  }, []);

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[#0f0f0f] flex text-zinc-400 overflow-hidden font-sans">
        <title>Documentação da API | DoeJÁ</title>
        <meta
          name="description"
          content="Explore e teste as requisições ao banco de dados do sistema DoeJÁ de forma interativa via Scalar."
        />
        <h1 className="sr-only">Documentação da API DoeJÁ</h1>

        {/* Sidebar Skeleton (Hidden on Mobile) */}
        <aside className="hidden md:flex flex-col w-[280px] bg-[#0c0c0c] border-r border-zinc-800/50 p-6 shrink-0 h-screen select-none">
          {/* Logo / Header Area */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 animate-pulse flex items-center justify-center border border-primary-container/10">
              <div className="w-4 h-4 rounded bg-primary-container animate-pulse"></div>
            </div>
            <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse"></div>
          </div>

          {/* Search bar skeleton */}
          <div className="w-full h-9 bg-zinc-900 rounded-lg border border-zinc-800/80 mb-6 animate-pulse flex items-center px-3 gap-2">
            <div className="w-3.5 h-3.5 rounded-full border border-zinc-750"></div>
            <div className="h-3 w-16 bg-zinc-800 rounded"></div>
          </div>

          {/* Endpoint Groups */}
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-none">
            {[1, 2, 3].map((groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                {/* Group Title */}
                <div className="h-3 w-28 bg-zinc-800 rounded animate-pulse opacity-60"></div>
                {/* Items */}
                <div className="space-y-2.5 pl-2">
                  {[1, 2, 3].map((itemIndex) => {
                    const methodColors = [
                      "bg-emerald-500/20 text-emerald-400 border-emerald-500/20", // GET
                      "bg-blue-500/20 text-blue-400 border-blue-500/20",         // POST
                      "bg-amber-500/20 text-amber-400 border-amber-500/20"        // PUT
                    ];
                    const methodLabels = ["GET", "POST", "PUT"];
                    const colorIndex = (groupIndex + itemIndex) % 3;

                    return (
                      <div key={itemIndex} className="flex items-center gap-2.5 py-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${methodColors[colorIndex]}`}>
                          {methodLabels[colorIndex]}
                        </span>
                        <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Content Area Skeleton */}
        <section className="flex-1 flex flex-col md:flex-row h-screen overflow-hidden">
          {/* Main Doc Column */}
          <div className="flex-1 bg-[#0f0f0f] p-6 md:p-12 overflow-y-auto h-full space-y-8">
            {/* Header info */}
            <div className="space-y-4">
              <div className="h-9 w-64 bg-zinc-800 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full max-w-[600px] bg-zinc-900 rounded animate-pulse"></div>
                <div className="h-4 w-[90%] max-w-[500px] bg-zinc-900 rounded animate-pulse"></div>
                <div className="h-4 w-[75%] max-w-[400px] bg-zinc-900 rounded animate-pulse"></div>
              </div>
            </div>

            {/* HTTP Endpoint Details Block */}
            <div className="p-5 bg-zinc-900/30 rounded-xl border border-zinc-800/40 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GET
                </span>
                <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse"></div>
              </div>
              <div className="h-3.5 w-72 bg-zinc-800 rounded animate-pulse"></div>
            </div>

            {/* Request Parameter Skeleton */}
            <div className="space-y-4 pt-4">
              <div className="h-5 w-36 bg-zinc-850 rounded animate-pulse"></div>
              <div className="divide-y divide-zinc-800/50 border-y border-zinc-800/50">
                {[1, 2, 3].map((paramIndex) => (
                  <div key={paramIndex} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-3 w-12 bg-zinc-900 rounded animate-pulse text-[10px] text-zinc-600"></div>
                      </div>
                      <div className="h-3.5 w-56 bg-zinc-900 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-16 bg-zinc-900 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Code Playground Skeleton (Hidden on Mobile) */}
          <div className="hidden lg:flex flex-col w-[420px] bg-[#0c0c0c] border-l border-zinc-800/50 p-6 shrink-0 h-full justify-between">
            <div className="space-y-6">
              {/* Header Tabs */}
              <div className="flex gap-2 border-b border-zinc-800/80 pb-3">
                <div className="h-6 w-20 bg-zinc-800 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-zinc-900 rounded animate-pulse"></div>
              </div>

              {/* Code Panel */}
              <div className="w-full bg-[#070707] rounded-xl border border-zinc-800/60 p-5 font-mono text-xs space-y-3.5 animate-pulse min-h-[300px]">
                <div className="flex items-center gap-2 text-zinc-600 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                </div>
                <div className="h-3.5 w-[85%] bg-zinc-900 rounded"></div>
                <div className="h-3.5 w-[70%] bg-zinc-900 rounded pl-4"></div>
                <div className="h-3.5 w-[90%] bg-zinc-900 rounded pl-4"></div>
                <div className="h-3.5 w-[50%] bg-zinc-900 rounded pl-8"></div>
                <div className="h-3.5 w-[65%] bg-zinc-900 rounded pl-8"></div>
                <div className="h-3.5 w-[40%] bg-zinc-900 rounded pl-4"></div>
                <div className="h-3.5 w-[30%] bg-zinc-900 rounded"></div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="w-full bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 flex justify-between items-center animate-pulse">
              <div className="h-4 w-28 bg-zinc-800 rounded"></div>
              <div className="h-9 w-24 bg-primary-container/25 border border-primary-container/30 rounded-lg"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <title>Documentação da API | DoeJÁ</title>
      <meta
        name="description"
        content="Explore e teste as requisições ao banco de dados do sistema DoeJÁ de forma interativa via Scalar."
      />
      <h1 className="sr-only">Documentação da API DoeJÁ</h1>
    </>
  );
}

