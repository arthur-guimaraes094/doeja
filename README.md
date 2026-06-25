# 🍎 DoeJÁ - Conectando Doadores de Alimentos e ONGs

Bem-vindo(a) ao repositório do **DoeJÁ**! Este é um projeto de impacto social que visa combater a fome e o desperdício de alimentos. Facilitamos a conexão rápida e segura entre pessoas ou estabelecimentos com excedente de comida (doadores) e ONGs locais que realizam assistência social.

Este documento foi pensado especialmente para **desenvolvedores que estão ingressando no time**. Aqui você encontrará tudo o que precisa para entender a arquitetura do projeto, configurar seu ambiente e começar a contribuir de forma confiante.

---

## 📚 Documentações Importantes

Para facilitar a sua ambientação e garantir a conformidade do código, consulte os guias abaixo:

*   📖 **[Guia de Diretrizes de Desenvolvimento](file:///c:/Users/x990351/Estudos/doeja/docs/DEVELOPER_GUIDELINES.md):** Manual completo de boas práticas, estrutura de código, regras do Tailwind v4, otimização de imagens/LCP e instruções de performance.
*   🎨 **[Guia do Design System](file:///c:/Users/x990351/Estudos/doeja/DESIGN.md):** Especificações de cores, tipografia, espaçamentos, sombras e identidade de marca.
*   🤖 **[Regras de Agentes (Pair Programming)](file:///c:/Users/x990351/Estudos/doeja/AGENTS.md):** Padrões e diretrizes locais para assistentes de inteligência artificial de pair programming.

---

## 🚀 1. Configurando e Executando o Projeto Localmente

Antes de começar, certifique-se de ter o **Node.js** instalado na sua máquina (recomendamos a versão LTS recente).

### Passo a Passo:
1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/arthur-guimaraes094/doeja.git
   cd doeja
   ```

2. **Trocar para a branch de desenvolvimento:**
   No nosso fluxo, nunca trabalhamos diretamente na branch principal (`master`). Sempre partimos da `development`:
   ```bash
   git checkout development
   ```

3. **Instalar as dependências:**
   Este comando lê o arquivo `package.json` e instala todas as bibliotecas necessárias para o projeto rodar (incluindo o React, Next.js, Tailwind CSS e ferramentas de teste):
   ```bash
   npm install
   ```

4. **Executar o servidor de desenvolvimento:**
   Inicia a aplicação em modo de desenvolvimento local com atualização em tempo real (Hot Reload):
   ```bash
   npm run dev
   ```
   Agora, abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

5. **Testar a compilação (Build de Produção):**
   Para verificar se o TypeScript e o Next.js estão prontos para irem ao ar sem erros de compilação:
   ```bash
   npm run build
   ```

---

## 🌿 2. Nosso Fluxo de Trabalho do Git (Git Flow)

Trabalhar em equipe exige organização para evitar que o código de um desenvolvedor sobrescreva o do outro. Adotamos o seguinte padrão:

### Nossas Branches Principais:
*   `master` (Produção): Contém o código mais estável do projeto. **Somente o líder do projeto (Arthur) realiza o merge final nessa branch.**
*   `development` (Integração): A branch ativa de trabalho da equipe. É daqui que você puxa atualizações e é para onde envia suas novas funcionalidades.

### Criando uma Feature (Passo a Passo):
1. **Garanta que sua branch de desenvolvimento local está atualizada:**
   ```bash
   git checkout development
   git pull origin development
   ```
2. **Crie uma branch específica para a sua tarefa:**
   Use nomes claros e descritivos separados por hífens.
   *   *Exemplo:* `feature/tela-doacoes` ou `feature/fix-header`
   ```bash
   git checkout -b feature/nome-da-sua-tarefa
   ```
3. **Desenvolva e faça Commits frequentes:**
   Tente fazer commits pequenos e com mensagens claras explicando o que foi feito (ex: `git commit -m "feat: adiciona componente de card de ong"`).
4. **Envie sua branch para o repositório remoto (GitHub):**
   ```bash
   git push -u origin feature/nome-da-sua-tarefa
   ```
5. **Abra um Pull Request (PR):**
   No GitHub, abra um PR solicitando a mesclagem da sua branch `feature/*` para a branch `development`. Descreva o que você implementou, adicione prints de tela se alterou a parte visual e peça a revisão de um colega.

---

## 📂 3. Entendendo a Estrutura de Pastas

Aqui está um mapa resumido do projeto para você saber exatamente onde encontrar ou criar seus arquivos:

```
doeja/
├── app/                    # Páginas, layouts e estilos globais (Next.js App Router)
│   ├── docs/               # Rota da documentação interativa da API via Scalar
│   │   └── page.tsx        # Página da documentação com Skeleton Loader premium
│   ├── login/              # Rota da página de login com formulário e animações
│   │   └── page.tsx        # Página de login com transições GSAP e validações
│   ├── globals.css         # Importações do Tailwind v4 e estilos globais
│   ├── layout.tsx          # Layout base comum a todas as páginas (Fontes e metadados SEO)
│   └── page.tsx            # A página inicial (Landing Page principal do projeto)
├── components/             # Componentes visuais reutilizáveis (Header, Footer, Canvas)
│   ├── FloatingVegetables2D.tsx # Fundo de vegetais animados no Canvas (desativado em mobile)
│   ├── Header.tsx          # Menu de navegação superior
│   └── Footer.tsx          # Rodapé da página
├── lib/                    # Códigos utilitários globais
│   └── utils/
│       ├── cn.ts           # Função auxiliar para mesclar classes de estilo
│       └── cn.test.ts      # Testes unitários da função auxiliar
├── docs/                   # Diretrizes, especificações e documentações
│   └── DEVELOPER_GUIDELINES.md # Guia didático de desenvolvimento para iniciantes
├── public/                 # Imagens, vídeos e arquivos estáticos públicos
│   └── openapi.json        # Especificação OpenAPI/Swagger estática do projeto
├── tsconfig.json           # Configurações do TypeScript (Strict Mode habilitado!)
├── vitest.config.ts        # Configurações de execução de testes com Vitest
└── package.json            # Scripts de execução e dependências instaladas
```

---

## 🎨 4. Guia Prático de Desenvolvimento e Boas Práticas

### A. Criando Novas Telas (Rotas no Next.js)
No App Router do Next.js, as rotas são definidas pela estrutura de pastas dentro de `app/`. Cada pasta representa uma URL e o arquivo de visualização deve obrigatoriamente se chamar `page.tsx`.
*   *Exemplo:* Se você quiser criar a rota `/ongs`, crie a pasta `app/ongs/` e dentro dela crie o arquivo `page.tsx`:
    ```tsx
    import React from "react";

    export default function OngsPage() {
      return (
        <main className="p-8">
          <h1 className="text-2xl font-bold">Nossas ONGs Parceiras</h1>
          <p>Lista de instituições atendidas pelo DoeJÁ.</p>
        </main>
      );
    }
    ```

### B. Criando Componentes de Interface
Qualquer elemento que puder ser reutilizado em mais de uma página (ex: Botões customizados, Cards, Inputs com estilo próprio) deve ser criado dentro de `components/` com a extensão `.tsx`.
*   **Atenção ao importar**: Você pode usar o alias `@/components` ou importar de forma relativa `../components/MeuComponente`.
*   Dê preferência a nomes de componentes em `PascalCase` (ex: `Header.tsx`, `HandsSvg.tsx`).

### C. Estilização: Tailwind CSS v4
Nós usamos **Tailwind CSS v4** para construir e estilizar a interface. O design adotado é unificado e focado na estética orgânica e amigável, definida no arquivo [globals.css](file:///c:/Users/x990351/Estudos/doeja/app/globals.css).

*   Sempre utilize as variáveis e classes utilitárias de espaçamento e cores do nosso design system (como `bg-background`, `text-on-surface`, `px-margin-desktop`, `gap-md`).
*   Consulte mais detalhes didáticos sobre como estilizar e trabalhar com o CSS em nosso [Guia de Diretrizes de Desenvolvimento](file:///c:/Users/x990351/Estudos/doeja/docs/DEVELOPER_GUIDELINES.md).

### D. Concatenação Segura de Classes com `cn`
Quando você precisar aplicar classes CSS de forma condicional, ou aceitar estilos adicionais via props no seu componente, use a função utilitária `cn` localizada em `lib/utils/cn.ts`. Ela une o `clsx` com o `tailwind-merge` para evitar que classes Tailwind conflitantes se quebrem mutuamente.
*   *Exemplo:*
    ```tsx
    import { cn } from "@/lib/utils/cn";

    interface Props {
      isDanger?: boolean;
      className?: string;
    }

    export function Alert({ isDanger, className }: Props) {
      return (
        <div className={cn(
          "p-4 rounded-md bg-green-200 text-green-800", // Estilos padrão
          isDanger && "bg-red-200 text-red-800",       // Condicional
          className                                    // Sobrescrever styles de fora
        )}>
          Alerta de Mensagem
        </div>
      );
    }
    ```

### E. SVGs Dinâmicos e Animações
Nossas ilustrações estão em arquivos `.tsx` e exportam SVGs diretos. Nós controlamos animações interativas neles através de estados do React.
*   *Exemplo de animação (como piscar olhos de personagens)*:
    ```tsx
    const [isBlinking, setIsBlinking] = useState(false);
    useEffect(() => {
      const interval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 3000 + Math.random() * 4000);
      return () => clearInterval(interval);
    }, []);

    // No JSX do SVG, usamos 'isBlinking' para achatar a altura (ry) dos olhos:
    <ellipse cx="50" cy="50" rx="4" ry={isBlinking ? 0.5 : 4} />
    ```

---

## 🧪 5. Escrevendo e Executando Testes (Vitest)

Testes automatizados evitam que modificações quebrem lógicas que já estavam funcionando no passado. Nós usamos o **Vitest** + **React Testing Library** para testes unitários.

### Como rodar os testes:
No seu terminal, execute:
```bash
npm run test
```
Este comando executará todas as suites de testes do projeto e mostrará o relatório final diretamente no terminal.

### Onde e como criar novos testes:
Crie os arquivos de teste na mesma pasta onde está a lógica ou componente, utilizando a extensão `.test.ts` (ou `.test.tsx`).
*   *Exemplo de teste unitário (`lib/utils/cn.test.ts`)*:
    ```typescript
    import { describe, it, expect } from "vitest";
    import { cn } from "./cn";

    describe("cn utility function", () => {
      it("deve concatenar classes do Tailwind corretamente", () => {
        expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
      });
    });
    ```

### Testes de Performance (FPS Automatizado) 📈
Garantimos a fluidez e estabilidade da animação rodando testes automatizados com o Puppeteer.
*   **Como executar:**
    ```bash
    node scripts/measure-fps.mjs
    ```
    Esse script executa simulações completas de scroll e movimentação do mouse, medindo a taxa de quadros e validando que a média permanece $\ge$ 60 FPS.

---

## 🚨 6. Checklist de Pré-Commit (Não Esqueça!)

Antes de subir seu código (dar o `git push`) e abrir um Pull Request, execute localmente a validação de qualidade completa:

1.  **Verifique a Formatação e Regras de Estilo:**
    ```bash
    npm run lint
    ```
    *(Garante que não existem importações não utilizadas, entidades HTML soltas ou sintaxes erradas)*
2.  **Execute os Testes Unitários:**
    ```bash
    npm run test
    ```
    *(Garante que nenhuma funcionalidade existente foi danificada pelo seu código)*
3.  **Execute o Build de Produção:**
    ```bash
    npm run build
    ```
    *(Garante que o TypeScript não possui erros de tipo implícitos ou incompatibilidades estruturais)*
4.  **Valide o Desempenho de Renderização (60 FPS):**
    ```bash
    node scripts/measure-fps.mjs
    ```
    *(Garante que as novas mudanças não introduziram lags e o app roda liso a 60+ FPS)*

Seguindo este guia, você garantirá que o projeto continue limpo, rápido e seguro para todos os usuários e desenvolvedores! Se tiver dúvidas, procure o Arthur ou mande no canal de comunicação da equipe. Boa codificação! 🚀
