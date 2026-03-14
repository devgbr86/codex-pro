# CaffeWiki - Tutorial Completo do Projeto

## Indice

1. [O que e este projeto](#1-o-que-e-este-projeto)
2. [Visao Geral da Arquitetura](#2-visao-geral-da-arquitetura)
3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
4. [Como a Aplicacao Funciona - Fluxo Completo](#4-como-a-aplicacao-funciona---fluxo-completo)
5. [index.html - A Estrutura da Pagina](#5-indexhtml---a-estrutura-da-pagina)
6. [main.css - O Estilo Visual](#6-maincss---o-estilo-visual)
7. [main.js - O Cerebro da Aplicacao](#7-mainjs---o-cerebro-da-aplicacao)
8. [Markdown - O Formato do Conteudo](#8-markdown---o-formato-do-conteudo)
9. [marked.js e DOMPurify - Bibliotecas Externas](#9-markedjs-e-dompurify---bibliotecas-externas)
10. [Sistema de Busca](#10-sistema-de-busca)
11. [Tags Rapidas](#11-tags-rapidas)
12. [Design Responsivo](#12-design-responsivo)
13. [Como Adicionar Conteudo ao Wiki](#13-como-adicionar-conteudo-ao-wiki)
14. [Como Rodar o Projeto](#14-como-rodar-o-projeto)
15. [Como Fazer Deploy (publicar na internet)](#15-como-fazer-deploy-publicar-na-internet)
16. [Conceitos Tecnicos Aprendidos](#16-conceitos-tecnicos-aprendidos)

---

## 1. O que e este projeto

O **CaffeWiki** e uma wiki estatica sobre cafe. Ele funciona como uma enciclopedia digital dedicada ao universo do cafe: marcas, metodos de preparo, origens, dados tecnicos e especificacoes.

O diferencial do projeto e a sua simplicidade tecnica intencional. Ele foi construido com:

- **HTML** para estrutura
- **CSS** para aparencia
- **JavaScript puro** para comportamento

Sem frameworks como React, Vue ou Angular. Sem bancos de dados. Sem servidor back-end. O conteudo fica em arquivos de texto simples no formato **Markdown** (`.md`), e o proprio JavaScript do projeto se encarrega de ler e exibir esses arquivos na tela.

Por ser completamente estatico, o projeto pode ser hospedado gratuitamente em servicos como GitHub Pages, Netlify ou Cloudflare Pages.

---

## 2. Visao Geral da Arquitetura

A arquitetura do projeto e propositalmente simples. Veja como as pecas se encaixam:

```
Usuario abre a pagina
        |
        v
   index.html          <-- estrutura base (cabecalho, barra de busca, area de conteudo)
        |
        v
   main.js             <-- logica: carrega arquivos .md, processa busca, renderiza conteudo
        |
        v
   marked.js           <-- biblioteca que converte texto Markdown em HTML
        |
        v
   DOMPurify           <-- biblioteca que higieniza o HTML gerado (seguranca)
        |
        v
   main.css            <-- define a aparencia visual de tudo
        |
        v
  articles/ e brands/  <-- pastas com os arquivos .md (o conteudo real do wiki)
```

O fluxo basico e:

1. O navegador carrega `index.html`
2. O `main.js` e executado e faz requisicoes para carregar os arquivos `.md`
3. Cada arquivo `.md` e convertido de Markdown para HTML pelo `marked.js`
4. O HTML resultante e sanitizado pelo `DOMPurify` e inserido na pagina
5. O sistema de busca indexa todo esse conteudo para permitir pesquisas

---

## 3. Estrutura de Arquivos

```
caffe-wiki/
|
|-- index.html          # Pagina principal (unica pagina do projeto)
|-- main.css            # Estilos visuais
|-- main.js             # Toda a logica JavaScript
|-- robots.txt          # Instrucoes para robos de busca (Google, Bing)
|-- sitemap.xml         # Mapa do site para indexacao por motores de busca
|-- space_icon.png      # Icone do projeto
|
|-- articles/           # Pasta com artigos gerais sobre cafe
|   |-- intro.md
|   |-- metodos-preparo.md
|   |-- ... (outros .md)
|
|-- brands/             # Pasta com artigos sobre marcas de cafe
|   |-- ... (arquivos .md de marcas)
|
|-- assets/
    |-- icons/          # Icones usados na interface
```

A separacao entre `articles/` e `brands/` e uma decisao de organizacao de conteudo. Tecnicamente, ambas as pastas funcionam da mesma forma: contem arquivos `.md` que o JavaScript carrega e exibe.

---

## 4. Como a Aplicacao Funciona - Fluxo Completo

Vamos acompanhar o que acontece desde o momento em que o usuario abre a pagina.

### Passo 1 - O navegador carrega o index.html

O HTML define a estrutura visual: o cabecalho com o nome do wiki, a barra de busca, os botoes de tags rapidas e a area onde o conteudo sera exibido.

### Passo 2 - O main.js e executado

O script contem uma lista (array) com os caminhos de todos os arquivos `.md` do projeto:

```javascript
const SECTIONS = [
  "articles/intro.md",
  "articles/metodos-preparo.md",
  "brands/illy.md",
  // ...
];
```

Assim que o script e carregado, ele percorre essa lista e faz uma requisicao `fetch` para cada arquivo.

### Passo 3 - Os arquivos Markdown sao carregados

Para cada caminho no array `SECTIONS`, o JavaScript faz:

```javascript
fetch("articles/intro.md")
  .then(response => response.text())
  .then(markdownText => {
    // markdownText contem o texto bruto do arquivo .md
  });
```

O `fetch` e uma funcao nativa do navegador que faz requisicoes HTTP. Aqui ela e usada para "buscar" arquivos locais do proprio servidor.

### Passo 4 - O Markdown e convertido para HTML

O texto bruto do arquivo `.md` (que e so texto com simbolos como `#`, `**`, `-`) passa pela biblioteca `marked.js`, que o transforma em HTML estruturado:

```
# Titulo             -->    <h1>Titulo</h1>
**negrito**          -->    <strong>negrito</strong>
- item de lista      -->    <ul><li>item de lista</li></ul>
```

### Passo 5 - O HTML e sanitizado

O HTML gerado passa pelo `DOMPurify`, que remove qualquer codigo potencialmente perigoso antes de inseri-lo na pagina. Isso e uma pratica de seguranca importante.

### Passo 6 - O conteudo e exibido

O HTML limpo e inserido na area de conteudo da pagina. O usuario ve o artigo formatado.

### Passo 7 - A busca e indexada

Paralelamente, o texto de cada artigo e armazenado em memoria para que o sistema de busca possa filtrar e encontrar conteudo quando o usuario digitar algo.

---

## 5. index.html - A Estrutura da Pagina

O `index.html` e o unico arquivo HTML do projeto. Toda a navegacao acontece dentro dele, sem redirecionamento para outras paginas.

### Cabecalho

```html
<header>
  <h1>CaffeWiki</h1>
  <p>Base de conhecimento sobre cafe</p>
</header>
```

O cabecalho e estatico. Aparece sempre, independentemente do conteudo exibido.

### Barra de Busca

```html
<div class="search-container">
  <input type="text" id="search-input" placeholder="Buscar..." />
</div>
```

O campo de busca captura o que o usuario digita. O JavaScript escuta esse campo em tempo real e filtra o conteudo conforme o usuario escreve, sem precisar pressionar Enter.

### Tags Rapidas

```html
<div class="tags-container">
  <button class="tag" data-query="espresso">espresso</button>
  <button class="tag" data-query="pour over">pour over</button>
  <button class="tag" data-query="arabica">arabica</button>
</div>
```

Cada botao de tag tem um atributo `data-query` com o termo de busca que sera executado quando o usuario clicar nele. O JavaScript le esse atributo e executa a busca automaticamente.

### Area de Conteudo

```html
<main id="content-area">
  <!-- conteudo carregado dinamicamente aqui -->
</main>
```

Esta area comeca vazia. O JavaScript insere o conteudo dos arquivos `.md` aqui conforme eles sao carregados. A `id="content-area"` e usada pelo JavaScript para localizar exatamente onde inserir o HTML.

---

## 6. main.css - O Estilo Visual

O CSS do projeto e dividido conceitualmente em duas responsabilidades principais, mesmo estando num arquivo unico:

### Estilos de Layout (estrutura)

Controlam como os elementos se posicionam na tela: o cabecalho no topo, o conteudo centralizado, as margens e espacamentos.

```css
body {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
```

Esse bloco centraliza todo o conteudo e limita a largura maxima a 900 pixels, o que melhora a leitura em telas largas.

### Paleta de Cores

As cores principais do projeto remetem ao cafe:

- Marrom escuro (`#3e2723`) - tom de cafe torrado forte, usado em titulos e destaques
- Marrom medio (`#8b6f47`) - tom de cafe com leite, usado em elementos secundarios
- Bege claro (`#f5f5dc`) - tom de creme, usado em fundos e areas de leitura

Essa paleta cria uma identidade visual coerente com o tema do wiki.

### Estilos de Markdown

Quando o `marked.js` converte os arquivos `.md` para HTML, ele gera tags como `<h1>`, `<h2>`, `<p>`, `<ul>`, `<table>`, `<code>` e assim por diante. O CSS precisa estilizar essas tags para que o conteudo fique legivel e agradavel.

```css
#content-area h1 {
  color: #3e2723;
  border-bottom: 2px solid #8b6f47;
}

#content-area table {
  width: 100%;
  border-collapse: collapse;
}

#content-area code {
  background: #f5f5dc;
  padding: 2px 6px;
  border-radius: 3px;
}
```

### Design Responsivo

Media queries adaptam o layout para telas menores:

```css
@media (max-width: 768px) {
  body {
    padding: 10px;
  }

  .tags-container {
    flex-wrap: wrap;
  }
}
```

Em celulares, o padding e reduzido e os botoes de tags quebram para a proxima linha quando nao cabem numa so linha.

---

## 7. main.js - O Cerebro da Aplicacao

Este e o arquivo mais importante do projeto. Vamos analisar cada parte.

### O Array de Secoes

```javascript
const SECTIONS = [
  "articles/intro.md",
  "articles/metodos-preparo.md",
  "brands/illy.md",
  "brands/lavazza.md",
  // ...
];
```

Este array e o "indice" do wiki. Cada string e um caminho relativo para um arquivo `.md`. Para adicionar um novo artigo ao wiki, basta criar o arquivo `.md` na pasta correta e adicionar o caminho aqui.

A ordem dos itens no array determina a ordem em que os artigos aparecem na pagina.

### Carregamento dos Arquivos

```javascript
async function loadAllSections() {
  for (const path of SECTIONS) {
    const response = await fetch(path);
    const markdownText = await response.text();
    renderSection(markdownText, path);
  }
}
```

Esta funcao percorre o array `SECTIONS` e, para cada caminho, faz uma requisicao `fetch`. A palavra `await` faz o codigo esperar cada arquivo terminar de carregar antes de passar para o proximo. Isso garante que os artigos aparecem na ordem correta definida no array.

### Renderizacao do Markdown

```javascript
function renderSection(markdownText, sourcePath) {
  const rawHTML = marked.parse(markdownText);
  const cleanHTML = DOMPurify.sanitize(rawHTML);

  const section = document.createElement('section');
  section.innerHTML = cleanHTML;
  section.dataset.source = sourcePath;
  section.dataset.content = markdownText.toLowerCase();

  document.getElementById('content-area').appendChild(section);
}
```

Esta funcao recebe o texto bruto do arquivo `.md` e:

1. Converte para HTML com `marked.parse()`
2. Limpa o HTML com `DOMPurify.sanitize()` para remover codigo malicioso
3. Cria um elemento `<section>` no DOM
4. Insere o HTML limpo dentro dele
5. Armazena o texto original em minusculas no atributo `data-content` - esse dado e usado depois pela busca
6. Adiciona a secao na area de conteudo da pagina

O atributo `dataset.content` e uma tecnica importante: ao guardar o conteudo em texto simples (e em minusculas) diretamente no elemento HTML, o sistema de busca pode depois verificar rapidamente se aquele elemento contem o termo buscado, sem precisar re-processar os arquivos.

### Sistema de Busca

```javascript
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const sections = document.querySelectorAll('#content-area section');

  sections.forEach(section => {
    const content = section.dataset.content;
    if (query === '' || content.includes(query)) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
});
```

O evento `input` e disparado a cada tecla que o usuario pressiona. Nao e necessario pressionar Enter.

Para cada secao carregada na pagina, o codigo verifica se o texto (guardado em `dataset.content`) inclui o termo buscado. Se incluir, a secao aparece (`display: 'block'`). Se nao incluir, ela e ocultada (`display: 'none'`).

Esse e um sistema de busca simples e eficiente para um volume pequeno de conteudo: tudo ja esta carregado na memoria, entao a filtragem e instantanea.

### Botoes de Tags Rapidas

```javascript
document.querySelectorAll('.tag').forEach(button => {
  button.addEventListener('click', () => {
    const query = button.dataset.query;
    searchInput.value = query;
    searchInput.dispatchEvent(new Event('input'));
  });
});
```

Quando o usuario clica em uma tag:

1. O codigo le o atributo `data-query` do botao (por exemplo, `"espresso"`)
2. Insere esse valor no campo de busca
3. Dispara manualmente o evento `input` no campo de busca

Esse disparo manual (`dispatchEvent`) e um truque elegante: em vez de duplicar a logica de busca, o codigo simplesmente simula que o usuario digitou no campo. A funcao de busca que ja existe cuida do resto.

---

## 8. Markdown - O Formato do Conteudo

Markdown e uma linguagem de marcacao leve. Ela permite formatar texto usando apenas caracteres simples, sem precisar escrever HTML.

### Sintaxe Basica

```markdown
# Titulo Principal (vira <h1>)
## Subtitulo (vira <h2>)
### Secao menor (vira <h3>)

Paragrafo normal. Apenas texto corrido.

**texto em negrito**
*texto em italico*

- item de lista
- outro item
- mais um item

1. lista numerada
2. segundo item
3. terceiro item

| Coluna 1 | Coluna 2 |
|----------|----------|
| valor    | valor    |

`codigo inline`

```bloco de codigo```
```

### Como um arquivo .md do projeto deve comecar

```markdown
# Nome do Artigo

Breve descricao introdutoria do topico.

## Primeira Secao

Conteudo da primeira secao...

## Segunda Secao

Conteudo da segunda secao...
```

Cada arquivo `.md` deve comecar com um titulo `#`. Isso cria uma hierarquia clara de conteudo e facilita a navegacao visual.

---

## 9. marked.js e DOMPurify - Bibliotecas Externas

O projeto usa duas bibliotecas JavaScript carregadas via CDN (Content Delivery Network), ou seja, diretamente da internet, sem precisar instalar nada.

### Como sao carregadas no index.html

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
<script src="main.js"></script>
```

E importante que as bibliotecas externas sejam carregadas **antes** do `main.js`, porque o `main.js` depende delas. O navegador carrega os scripts na ordem em que aparecem no HTML.

### marked.js

O `marked.js` e um parser de Markdown. Ele recebe uma string em Markdown e retorna uma string em HTML.

```javascript
const html = marked.parse("# Ola mundo");
// html = "<h1>Ola mundo</h1>"
```

Sem essa biblioteca, seria necessario escrever manualmente um parser para converter cada elemento Markdown no seu equivalente HTML - um trabalho complexo e propenso a erros.

### DOMPurify

O `DOMPurify` e uma biblioteca de seguranca. Quando voce insere HTML diretamente na pagina com `innerHTML`, existe um risco chamado **XSS (Cross-Site Scripting)**: codigo malicioso pode ser injetado e executado no navegador do usuario.

```javascript
// Sem sanitizacao - PERIGOSO
element.innerHTML = rawHTML;

// Com sanitizacao - SEGURO
element.innerHTML = DOMPurify.sanitize(rawHTML);
```

O `DOMPurify` analisa o HTML e remove qualquer tag ou atributo que possa executar codigo, como `<script>` ou handlers de eventos como `onclick`. O conteudo continua sendo exibido corretamente, mas sem risco de execucao de codigo indesejado.

---

## 10. Sistema de Busca

O sistema de busca do CaffeWiki e uma **busca em memoria**, o que significa que todo o conteudo ja foi carregado na pagina antes da busca acontecer. Isso tem vantagens e limitacoes.

### Como funciona na pratica

Quando todos os arquivos `.md` sao carregados, cada um vira uma `<section>` na pagina. O texto de cada secao e guardado no atributo `data-content` em letras minusculas.

Quando o usuario digita algo, o JavaScript:

1. Pega o termo digitado e converte para minusculas (para a busca nao diferenciar maiusculas de minusculas)
2. Percorre todas as secoes
3. Verifica se o `data-content` de cada secao contem o termo
4. Mostra as secoes que contem, esconde as que nao contem

### Vantagem

A busca e instantanea porque nao faz nenhuma requisicao de rede. Tudo ja esta na memoria do navegador.

### Limitacao

Para wikis muito grandes (com centenas de artigos extensos), carregar tudo de uma vez pode deixar a pagina lenta. Para o volume de conteudo do CaffeWiki, essa abordagem e perfeitamente adequada.

### O que a busca nao faz

A busca atual e uma busca por substring simples: ela verifica se o termo aparece em algum lugar do texto. Ela nao tem:

- Relevancia ou ranking de resultados
- Busca por sinonimos
- Correcao ortografica
- Busca por multiplas palavras independentes

Para um wiki tematico e fechado como o CaffeWiki, essas funcionalidades nao sao necessarias.

---

## 11. Tags Rapidas

As tags rapidas sao atalhos de busca predefinidos. Em vez de digitar, o usuario clica em um botao e a busca e executada automaticamente.

### Como adicionar uma nova tag

No `index.html`, dentro do `.tags-container`:

```html
<div class="tags-container">
  <button class="tag" data-query="espresso">espresso</button>
  <button class="tag" data-query="pour over">pour over</button>
  <button class="tag" data-query="arabica">arabica</button>
  <button class="tag" data-query="robusta">robusta</button>  <!-- nova tag -->
</div>
```

Basta adicionar um novo `<button>` com a classe `tag` e o atributo `data-query` com o termo de busca desejado. O texto dentro do botao e o que o usuario ve. O `data-query` pode ser diferente do texto visivel, se necessario.

O JavaScript ja captura automaticamente todos os botoes com a classe `tag`, entao nenhuma alteracao no `main.js` e necessaria.

---

## 12. Design Responsivo

O projeto adapta sua aparencia para diferentes tamanhos de tela usando **media queries** no CSS.

### Breakpoints

```css
/* Estilos padrao: desktop */
body {
  max-width: 900px;
  padding: 20px;
}

/* Tablet e celular */
@media (max-width: 768px) {
  body {
    padding: 10px;
  }
}

/* Celular pequeno */
@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
  }
}
```

Uma media query funciona como uma condicional no CSS: "se a largura da tela for menor que X pixels, aplique estes estilos". Os estilos dentro da media query sobrescrevem os estilos padrao apenas quando a condicao e verdadeira.

### O que muda em telas menores

- O padding lateral e reduzido para aproveitar melhor o espaco
- Os botoes de tags quebram para multiplas linhas quando necessario
- Os tamanhos de fontes dos titulos podem ser reduzidos
- Tabelas podem ter scroll horizontal em vez de quebrar o layout

---

## 13. Como Adicionar Conteudo ao Wiki

Este e um dos processos mais importantes para quem vai usar o projeto. E simples e nao requer conhecimento de programacao.

### Passo 1 - Criar o arquivo Markdown

Crie um novo arquivo com extensao `.md` dentro da pasta `articles/` ou `brands/`, dependendo do tipo de conteudo.

Exemplo: `articles/metodo-aeropress.md`

```markdown
# AeroPress

O AeroPress e um metodo de preparo de cafe desenvolvido em 2005 por Alan Adler.

## Caracteristicas

- Tempo de preparo: 1 a 2 minutos
- Pressao: manual
- Resultado: cafe encorpado, semelhante ao espresso

## Como Preparar

1. Aqueça a agua a 85-96 graus Celsius
2. Moa o cafe na granulacao media-fina
3. Coloque o filtro no porta-filtro e umedeca
4. Adicione 15g de cafe moido
5. Despeje 200ml de agua quente
6. Mexa por 10 segundos
7. Pressione lentamente o embolo

## Equipamentos Necessarios

| Item      | Especificacao        |
|-----------|----------------------|
| Cafe      | 15g                  |
| Agua      | 200ml, 92 graus C    |
| Moagem    | Media-fina           |
| Tempo     | 1-2 minutos          |
```

### Passo 2 - Registrar o arquivo no main.js

Abra o `main.js` e adicione o caminho do novo arquivo no array `SECTIONS`:

```javascript
const SECTIONS = [
  "articles/intro.md",
  "articles/metodo-aeropress.md",  // arquivo novo adicionado aqui
  "brands/illy.md",
  // ...
];
```

A posicao no array determina onde o artigo vai aparecer na pagina em relacao aos outros.

### Passo 3 - Testar

Abra o projeto no navegador e verifique se o novo artigo aparece corretamente. Use a busca para confirmar que o conteudo esta sendo indexado.

Nao e necessario recompilar nada. O projeto e JavaScript puro, entao qualquer alteracao e refletida imediatamente ao recarregar a pagina.

---

## 14. Como Rodar o Projeto

Como o projeto usa `fetch` para carregar arquivos locais, ele precisa ser servido por um servidor HTTP. Abrir o `index.html` diretamente com dois cliques nao vai funcionar, pois o navegador bloqueia essas requisicoes por motivos de seguranca.

### Opcao 1 - Servidor Python

Se voce tem Python instalado, abra o terminal na pasta do projeto:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000` no navegador.

### Opcao 2 - Servidor Node.js

Se voce tem Node.js instalado:

```bash
npx serve .
```

### Opcao 3 - Live Server no VS Code

Instale a extensao "Live Server" no VS Code. Clique com o botao direito em `index.html` e selecione **Open with Live Server**. O projeto abre automaticamente e recarrega ao salvar arquivos.

### Opcao 4 - Qualquer servidor web

Por ser um projeto estatico, funciona em qualquer servidor web: Apache, Nginx, IIS, ou qualquer servico de hospedagem.

---

## 15. Como Fazer Deploy (publicar na internet)

Por ser completamente estatico (sem back-end, sem banco de dados), o projeto pode ser hospedado gratuitamente em varios servicos.

### GitHub Pages

Se o codigo estiver em um repositorio no GitHub:

1. Va em Settings > Pages no repositorio
2. Em "Source", selecione a branch principal (geralmente `main`)
3. Salve. O GitHub publica automaticamente em `https://seu-usuario.github.io/nome-do-repositorio/`

### Netlify

1. Acesse netlify.com e crie uma conta gratuita
2. Conecte ao seu repositorio GitHub
3. O Netlify detecta automaticamente que e um projeto estatico e publica

### Cloudflare Pages

1. Acesse pages.cloudflare.com
2. Conecte ao repositorio GitHub
3. Configure o build como estatico (sem comando de build)
4. Implante

Todos esses servicos atualizam automaticamente o site quando voce faz push de alteracoes no repositorio.

### robots.txt e sitemap.xml

O projeto ja inclui esses dois arquivos, que sao importantes para SEO (otimizacao para motores de busca):

- **robots.txt**: instrui robos como o Google sobre quais paginas podem ser indexadas
- **sitemap.xml**: lista todas as URLs do site para facilitar a indexacao

Para um wiki que se beneficia de trafego organico, esses arquivos sao uma boa pratica.

---

## 16. Conceitos Tecnicos Aprendidos

O CaffeWiki cobre varios conceitos importantes de desenvolvimento web:

### Site Estatico vs Dinamico

Um site estatico serve os mesmos arquivos para todos os usuarios, sem processamento no servidor. Um site dinamico gera paginas diferentes dependendo do usuario, banco de dados, sessao, etc. Sites estaticos sao mais rapidos, mais baratos de hospedar e mais simples de manter para projetos de conteudo.

### fetch API e Carregamento Assicrono

A `fetch` API e a forma moderna de fazer requisicoes HTTP no navegador. O padrao `async/await` torna o codigo mais legivel ao lidar com operacoes que levam tempo (como carregamento de arquivos).

### Manipulacao do DOM

Criar elementos com `document.createElement`, inserir conteudo com `innerHTML`, selecionar elementos com `querySelector` e responder a eventos com `addEventListener` sao as habilidades fundamentais do JavaScript no navegador.

### Seguranca com DOMPurify

Inserir HTML dinamico numa pagina sem sanitizacao e uma vulnerabilidade. Usar `DOMPurify` antes de qualquer `innerHTML` e uma pratica de seguranca essencial.

### Data Attributes (atributos de dados)

O atributo `data-*` permite armazenar informacoes customizadas diretamente em elementos HTML. No CaffeWiki, `data-content` guarda o texto dos artigos para busca, e `data-query` guarda o termo de busca das tags. E uma forma limpa de comunicar dados entre HTML e JavaScript.

### Bibliotecas via CDN

Carregar bibliotecas externas via CDN e uma alternativa simples ao uso de gerenciadores de pacotes como npm. Para projetos pequenos e estaticos, e uma abordagem pratica que nao requer etapa de build.

### Separacao de Responsabilidades

Cada arquivo tem um papel bem definido:

- `index.html` define a estrutura
- `main.css` define a aparencia
- `main.js` define o comportamento
- Arquivos `.md` contem o conteudo

Essa separacao facilita a manutencao: para mudar o visual, voce edita apenas o CSS. Para adicionar conteudo, voce cria arquivos `.md` sem tocar no codigo. Para mudar a logica, voce edita apenas o JavaScript.