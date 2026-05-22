# Especificação de Design: Landing Page DoeJÁ

Esta especificação define o design e a arquitetura do front-end da página principal (landing page) do projeto social **DoeJÁ**, que tem como objetivo facilitar a conexão entre doadores de alimentos e ONGs.

## 1. Visão Geral do Escopo
O objetivo é construir uma primeira tela altamente fiel à imagem fornecida pelo usuário, implementando as duas abordagens visuais solicitadas através de um **alternador de temas dinâmico** em tempo real:
1. **Abordagem A (Orgânica & Acolhedora):** Tons pastéis e quentes (bege-creme, verde folha, laranja suave), tipografia amigável/arredondada e ilustrações em SVG com micro-animações suaves.
2. **Abordagem C (Pôster Retro):** Estilo impresso/pop art serigrafado, contornos pretos espessos em todos os elementos, sombras projetadas sólidas, tipografia pesada e textura sutil de papel.

## 2. Estrutura de Arquivos Proposta
O projeto será autocontido e otimizado, estruturado da seguinte forma no diretório raiz:
- `index.html` - Estrutura semântica HTML5, contendo a estrutura da página, as ilustrações SVG inline e o seletor de tema.
- `index.css` - Estilos baseados em variáveis CSS organizadas por temas para permitir a alteração dinâmica instantânea.
- `main.js` - Lógica JavaScript simples para gerenciar o estado do tema (salvando a preferência do usuário no `localStorage`) e iniciar micro-animações.

## 3. Paleta de Cores & Design Tokens

### 3.1. Abordagem A: Orgânica & Acolhedora (Classe base: `.theme-organic`)
- **Cor de Fundo:** `#FDEDE4` (Creme/Bege bem claro e quente)
- **Barra de Navegação/Rodapé:** `#A3C767` (Verde oliva claro amigável)
- **Destaque Primário (Botão Login):** `#F2911B` (Laranja vibrante e acolhedor)
- **Destaque Secundário (Links/Textos):** `#2D3A1A` (Verde escuro floresta para textos, garantindo contraste)
- **Fontes:**
  - Títulos: `'Fredoka', sans-serif` ou `'Lilita One', sans-serif` (Google Fonts - arredondadas e amigáveis)
  - Textos de Apoio/Menu: `'Fredoka', sans-serif`
- **Bordas & Sombras:** Bordas invisíveis ou muito suaves; sombras difusas e discretas.

### 3.2. Abordagem C: Pôster Retro (Classe base: `.theme-retro`)
- **Cor de Fundo:** `#FFF5D6` (Amarelo vintage/papel envelhecido) com overlay de grão
- **Barra de Navegação/Rodapé:** `#82B342` (Verde folha mais saturado) com bordas pretas espessas
- **Destaque Primário (Botão Login):** `#E27D00` (Laranja queimado com contorno)
- **Destaque Secundário:** Contornos pretos sólidos (`#000000`)
- **Fontes:**
  - Títulos: `'Lilita One', sans-serif` ou `'Paytone One', sans-serif` (Google Fonts)
  - Textos de Apoio: `'Fredoka', sans-serif` em negrito
- **Bordas & Sombras:**
  - Bordas: `3px solid #000000` em caixas, botões e imagens.
  - Sombras: `4px 4px 0px #000000` (sombra sólida projetada sem desfoque).

## 4. Ilustrações & Elementos SVG
Para garantir altíssima nitidez e evitar carregamento de imagens pesadas ou quebradas, todos os elementos visuais serão criados com **SVG inline** dinâmico e interativo:
1. **Margarida Feliz (Esquerda):** Pétalas brancas, miolo amarelo com carinha sorridente preta, contornos arredondados.
   - *Animação (Orgânica):* Efeito de balanço lateral suave (`sway`), simulando vento.
2. **Logo DoeJÁ Central:** Quatro mãos coloridas se segurando em círculo, formando um nó/elo quadrado de apoio mútuo.
   - *Animação (Orgânica):* Pulso suave ao passar o mouse (`hover`) e brilho de contorno.
3. **Pessoa Celebrando (Direita):** Ilustração estilizada de uma mulher com cabelos cacheados escuros, blusa laranja com coração branco no peito, braço levantado celebrando.
   - *Animação (Orgânica):* Movimento sutil de aceno do braço e flutuação.
4. **Vegetais Acompanhantes (Cantos inferiores):**
   - **Berinjela Fofa (Esquerda inferior):** Roxo brilhante, folhas verdes e rostinho feliz minimalista.
   - **Tomate Fofo (Direita inferior):** Vermelho tomate, folhas verdes e rostinho minimalista.
   - *Animação (Orgânica):* Pequeno pulso de respiração e piscar de olhos em intervalos aleatórios.

No modo **Retro**, as animações serão pausadas ou simplificadas, e todos os elementos SVG ganharão contornos pretos marcantes (`stroke="#000" stroke-width="3"`).

## 5. Responsividade
Seguindo a diretriz de **adaptar e empilhar**:
- Em resoluções de desktop (telas > 1024px), o layout segue o padrão horizontal do mock.
- Em tablets (telas entre 768px e 1023px), as ilustrações das laterais encolhem proporcionalmente.
- Em dispositivos móveis (telas < 767px):
  - O cabeçalho se torna um menu compacto ou simplificado.
  - A Margarida e a Pessoa Celebrando são deslocadas para baixo do texto principal e empilhadas, flanqueando o logo central.
  - O texto de Hero assume maior destaque centralizado.
  - A berinjela e o tomate fofos ficam fixados de forma discreta nas extremidades inferiores do rodapé.

## 6. Plano de Verificação
- **Validação de Layout:** Utilização do navegador local para certificar que o visual é fiel ao mock enviado.
- **Teste do Alternador:** Clicar no botão seletor de tema e verificar a transição instantânea de cores, bordas, sombras e fontes sem recarregar a página.
- **Teste Responsivo:** Redimensionamento da tela (ou emulação de dispositivos móveis) para checar o empilhamento correto e a legibilidade.
