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
      <main className="w-full min-h-screen bg-[#191919] flex items-center justify-center text-white/50">
        <title>Documentação da API | DoeJÁ</title>
        <meta
          name="description"
          content="Explore e teste as requisições ao banco de dados do sistema DoeJÁ de forma interativa via Scalar."
        />
        <h1 className="sr-only">Documentação da API DoeJÁ</h1>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#a8c66c]"></div>
          <span>Carregando documentação da API...</span>
        </div>
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

