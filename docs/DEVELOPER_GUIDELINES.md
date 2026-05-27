# 📖 Guia de Desenvolvimento - DoeJÁ 🍎

Olá, desenvolvedor(a)! Seja muito bem-vindo(a) ao time do **DoeJÁ**. 

Este guia foi feito pensando especialmente em você que está iniciando no projeto. O objetivo dele é ser uma leitura amigável, clara e didática sobre como o nosso sistema funciona, quais são as regras de estilo e como garantir que o seu código seja rápido e seguro.

---

## 📂 1. Entendendo a Nossa Estrutura

Nós usamos o **Next.js 16** com o padrão **App Router**. Isso significa que as páginas da aplicação são criadas dentro da pasta `app/`.

*   [app/layout.tsx](file:///c:/Users/x990351/Documents/DoeJA/app/layout.tsx): É o "esqueleto" que envolve todas as páginas do site. Ele carrega as fontes, os estilos gerais e os metadados (título e descrição para buscadores como o Google).
*   [app/page.tsx](file:///c:/Users/x990351/Documents/DoeJA/app/page.tsx): É a nossa página inicial atual.
*   `/components`: Pasta com pedacinhos visuais reutilizáveis (como o `Header` e o `Footer`).
*   `/public`: Onde guardamos imagens, ícones e logos.

---

## 🎨 2. Estilização: Como usar o Tailwind CSS v4

Nós usamos o **Tailwind CSS v4** para estilizar nossa interface. Ele permite adicionar estilos diretamente no HTML através de classes pré-definidas.

### Regras de Ouro:
1.  **Não invente tamanhos em pixels soltos** (como `h-[412px]` ou `mt-[17px]`), a menos que seja estritamente necessário.
2.  **Use as variáveis do nosso Design System.** Nós configuramos tamanhos de espaçamento padronizados no Tailwind v4. Sempre prefira usá-los:
    *   `margin-desktop` (ex: `px-margin-desktop`): Margem lateral padrão para computadores (64px).
    *   `margin-mobile` (ex: `px-margin-mobile`): Margem lateral padrão para celulares (16px).
    *   `xs` (4px), `base` (8px), `sm` (12px), `md` (24px), `lg` (48px), `xl` (80px) (ex: `gap-md`, `py-xl`, `mt-lg`).

*Exemplo de uso:*
```tsx
// Correto: Usando margens e espaçamentos padronizados
<div className="px-margin-desktop py-lg gap-md flex">
  <p>Conteúdo alinhado!</p>
</div>
```

---

## ⚡ 3. Performance de Imagens (Super Importante! ⚠️)

Uma página web rápida é essencial para que os usuários consigam doar comida sem travamentos. Por isso, preste muita atenção nas imagens:

### Por que não devemos usar SVGs gigantescos no Canvas flutuante?
O nosso fundo interativo com frutas e vegetais flutuantes ([FloatingVegetables2D.tsx](file:///c:/Users/x990351/Documents/DoeJA/components/FloatingVegetables2D.tsx)) desenha imagens continuamente na tela.
*   **SVGs originais:** São arquivos de vetor complexos de **até 7MB cada** (totalizando mais de 26MB). Carregar isso no celular do usuário consome toda a franquia de dados e faz o celular travar/esquentar devido ao esforço de processar milhares de curvas vetoriais a 60 frames por segundo.
*   **A Solução (WebP):** O formato WebP é uma imagem moderna, muito leve (de 20KB a 40KB) e ideal para o Canvas.

> 🎉 **Sucesso:** O projeto já foi totalmente migrado para carregar as imagens `.webp` otimizadas no canvas! Caso novos elementos sejam incluídos no futuro, certifique-se de seguir o mesmo fluxo de otimização descrito abaixo.

### Como converter os arquivos SVG atuais ou novas ilustrações para WebP:
1.  Abra o arquivo SVG em um editor de design (como o **Figma** ou Photoshop) ou utilize uma ferramenta online gratuita como o [Squoosh.app](https://squoosh.app).
2.  Redimensione as dimensões da imagem para um tamanho adequado (ex: **400x400 pixels** é excelente para elementos de fundo flutuantes).
3.  Exporte ou converta no formato **WebP** com a transparência ativada.
4.  Salve o arquivo gerado na pasta `/public` com a extensão `.webp` (ex: `Maca.webp`).

### Otimização de LCP e Logotipos SVG:
Para imagens em formato vetorial (como o nosso `/logo.svg`) que aparecem acima da dobra (no topo do site), **não utilize o componente `<Image>` do Next.js**.
*   **Por quê?** O Next.js não otimiza SVGs (por já serem vetoriais), e o uso do componente adiciona wrappers desnecessários e gera avisos no console relacionados a LCP (Largest Contentful Paint) e carregamento lento.
*   **A Solução:** Use a tag HTML nativa `<img>` diretamente (ex: `<img src="/logo.svg" alt="..." className="..." />`). Isso garante carregamento instantâneo e evita overhead de JavaScript.

---

## 🚀 4. Particularidade do Next.js 16: Navegação Instantânea

O Next.js 16 introduziu uma melhoria de performance para navegações rápidas entre páginas no lado do cliente. 

> 💡 **Dica de Senior:** Se no futuro você criar novas telas e perceber que a mudança de página está lenta (mesmo usando `<Suspense>`), exporte a constante `unstable_instant` no arquivo `page.tsx` daquela rota.

*Exemplo de como declarar isso na sua página:*
```tsx
import React from "react";

// Exportando esta linha, o Next.js 16 carrega essa página instantaneamente
export const unstable_instant = true; 

export default function NovaPagina() {
  return (
    <main>
      <h1>Nova Rota Rápida!</h1>
    </main>
  );
}
```

---

## 🧪 5. Testes Automatizados (Vitest)

Nós usamos o **Vitest** para testar nosso código de lógica e garantir que alterações futuras não quebrem funcionalidades antigas.

### Onde ficam os testes?
Eles devem ficar na mesma pasta que a funcionalidade que você está desenvolvendo, terminando com `.test.ts` (ou `.test.tsx`). 
Veja um exemplo didático em [cn.test.ts](file:///c:/Users/x990351/Documents/DoeJA/lib/utils/cn.test.ts).

### Como rodar os testes localmente:
1. Abra o terminal na raiz do projeto.
2. Se você estiver no **Windows**, execute:
   ```bash
   npm.cmd run test
   ```
3. Se estiver no **Mac ou Linux**, execute:
   ```bash
   npm run test
   ```

### Testes de Performance (FPS Automatizado) 📈
Além dos testes lógicos, garantimos que a interface rode a mais de 60 FPS estáveis usando automação de navegador com o Puppeteer.
*   **Como executar:**
    ```bash
    node scripts/measure-fps.mjs
    ```
    Esse script inicia o servidor de desenvolvimento (caso não esteja rodando), abre um navegador em segundo plano (*headless*), simula interações de mouse e rolagem da página, e valida se o frame rate médio foi $\ge$ 60 FPS.

### Monitor de Performance Visual (In-App)
Para depurar a taxa de quadros e o tempo de renderização em tempo real na própria página:
*   Acesse o site local com a query string `?perf=true` (ex: `http://localhost:3000/?perf=true`).
*   Um monitor flutuante será renderizado no canto inferior esquerdo mostrando o FPS atual, o FPS mínimo registrado e um gráfico de histórico de frames.
*   ⚠️ **Comportamento em Produção:** Por segurança e UX, **este monitor não aparece em produção por padrão** (o loop de medição fica desativado e o componente retorna `null`). Ele só ficará visível em produção se um usuário acessar a URL explicitamente com a query string `?perf=true` ou `?debug=true`, evitando assim qualquer impacto visual ou consumo de recursos para os usuários comuns.

---

## 🚨 6. Checklist antes de enviar seu código (Pull Request)

Antes de fazer o `git push` e pedir para um colega avaliar seu trabalho no GitHub, sempre execute essa rotina no seu terminal:

1.  **npm.cmd run lint** (ou `npm run lint`): Checa se há importações inúteis ou erros de sintaxe.
2.  **npm.cmd run test** (ou `npm run test`): Garante que nenhum teste quebrou.
3.  **npm.cmd run build** (ou `npm run build`): Garante que o projeto compila sem erros para produção.
4.  **node scripts/measure-fps.mjs**: Garante que as interações com o site não reduziram a performance do canvas abaixo da meta de 60 FPS.

Seguindo esses passos simples, seu código será limpo, rápido e você se tornará um desenvolvedor excelente! Caso tenha dúvidas, estamos aqui para ajudar. Boa codificação! 🚀
