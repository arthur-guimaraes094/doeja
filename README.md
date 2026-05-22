# DoeJÁ - Conectando Doadores de Alimentos e ONGs

O **DoeJÁ** é um projeto de impacto social desenvolvido em **Next.js** (App Router) cujo principal objetivo é facilitar e agilizar a ponte entre doadores de alimentos e ONGs locais de assistência social.

---

## 🚀 Como Rodar o Projeto Localmente

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/arthur-guimaraes094/doeja.git
   cd doeja
   ```

2. **Mudar para a Branch de Desenvolvimento:**
   ```bash
   git checkout development
   ```

3. **Instalar Dependências:**
   ```bash
   npm install
   ```

4. **Rodar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação em execução.

5. **Gerar Build de Produção (Validação):**
   ```bash
   npm run build
   ```

---

## 🌿 Fluxo de Trabalho do Git (Git Flow da Equipe)

Para garantir a organização e a qualidade do código em equipe, adotamos um fluxo bem estruturado de branches e revisões. **Arthur atua como Líder do Projeto e é o responsável final pela integridade da branch de produção.**

### 1. Nossas Branches
*   **`master` (Produção):** Contém apenas o código estável, testado e pronto para deploy de produção. **Apenas o Líder do Projeto realiza commits diretos ou merges nesta branch.**
*   **`development` (Integração):** Branch principal onde todo o desenvolvimento da equipe é integrado. Todas as novas features são baseadas nela.
*   **`feature/nome-da-feature`:** Ramificações temporárias criadas por desenvolvedores para criar novas telas, componentes ou correções.

### 2. Passo a Passo para Desenvolver uma Feature

1. **Atualize sua branch local `development`:**
   ```bash
   git checkout development
   ```
   ```bash
   git pull origin development
   ```

2. **Crie a sua branch de feature (com nome descritivo):**
   ```bash
   git checkout -b feature/minha-nova-tela
   ```

3. **Desenvolva e valide localmente:**
   - Garanta que a aplicação compila sem erros executando `npm run build`.

4. **Envie a branch para o GitHub:**
   ```bash
   git push -u origin feature/minha-nova-tela
   ```

5. **Abra um Pull Request (PR):**
   - Crie o PR no GitHub escolhendo como destino (**base**) a branch `development`.
   - Adicione descrição clara das modificações e capturas de tela, caso haja alterações visuais.

6. **Revisão e Merge para `development`:**
   - Outro membro da equipe revisa o código. Uma vez aprovado, a feature é mesclada em `development`.

7. **Merge de `development` para `master` (Produção):**
   - Quando as funcionalidades em `development` estiverem validadas e prontas para release, o líder Arthur abrirá e aprovará o Pull Request de `development` para `master`.

---

## 🎨 Padrões de Código e Guia de Desenvolvimento

### 1. Criando Novas Telas (Rotas)
Utilizamos o **App Router** do Next.js. Para criar uma nova rota, crie uma pasta dentro de `app/` e nela adicione um arquivo `page.js`.
*   *Exemplo:* Para a rota `/doacoes`, crie a pasta `app/doacoes/` contendo o arquivo `app/doacoes/page.js`:
    ```javascript
    export default function DoacoesPage() {
      return (
        <main>
          <h1>Lista de Doações</h1>
        </main>
      );
    }
    ```

### 2. Criando Componentes Reutilizáveis
Componentes de interface compartilhados (botões, cards, SVGs) devem ficar no diretório `components/`.
*   Sempre use componentes funcionais do React.
*   Importe caminhos absolutos utilizando `@/components/...` (definido no `jsconfig.json`).

### 3. Estilização e Temas (Nativo CSS)
**Não utilizamos Tailwind CSS.** O projeto é estilizado usando CSS puro estruturado em variáveis globais no arquivo `app/globals.css`.
*   **Variáveis de Tema:** O DoeJÁ possui dois temas: **Orgânico** e **Retro Pôster**. As variáveis de cores e fontes são declaradas no `globals.css` sob as classes `body.theme-organic` e `body.theme-retro`.
*   Sempre utilize as variáveis CSS (`var(--bg-color)`, `var(--text-primary)`, etc.) ao invés de cores fixas. Isso garante que a troca de tema funcione instantaneamente quando o usuário clicar no botão de alterar tema.

### 4. Animações e SVGs Dinâmicos
Ilustrações fofas (Margarida, Tomate, Berinjela) são desenhadas em formato **SVG inline** e transformadas em componentes React.
*   Para criar interações (como piscar os olhos), utilize o hook `useState` e um `useEffect` para rodar animações baseadas no tempo de forma assíncrona.
*   *Exemplo de piscar de olhos no SVG:*
    ```jsx
    const [isBlinking, setIsBlinking] = useState(false);
    useEffect(() => {
      const interval = setInterval(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }, 3000 + Math.random() * 4000);
      return () => clearInterval(interval);
    }, []);
    // No JSX do SVG:
    <ellipse cx="50" cy="50" rx="4" ry={isBlinking ? "0.5" : "4"} />
    ```

---

## 📂 Estrutura de Pastas do Projeto

```
doeja/
├── .next/                  # Cache de build do Next.js
├── app/                    # Rotas, layouts e estilos globais do Next.js
│   ├── globals.css         # Variáveis e animações CSS principais
│   ├── layout.js           # Layout raiz com fontes e metadados SEO
│   └── page.js             # Tela inicial (Landing Page)
├── components/             # Componentes React (Header, Footer, SVGs)
│   ├── DaisySvg.jsx
│   ├── EggplantSvg.jsx
│   ├── Footer.jsx
│   ├── HandsSvg.jsx
│   ├── Header.jsx
│   ├── TomatoSvg.jsx
│   └── WomanSvg.jsx
├── docs/                   # Documentação do design e planejamento
├── vanilla-backup/         # Backup da versão HTML/CSS/JS estática original
├── jsconfig.json           # Configuração de mapeamento de caminhos (@/*)
├── package.json            # Dependências e scripts do projeto
└── README.md               # Este arquivo de documentação
```
