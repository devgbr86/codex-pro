# Nebula Movies - Tutorial Completo do Projeto

## Indice

1. [O que e este projeto](#1-o-que-e-este-projeto)
2. [Visao Geral da Arquitetura](#2-visao-geral-da-arquitetura)
3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
4. [Como a Aplicacao Funciona - Fluxo Completo](#4-como-a-aplicacao-funciona---fluxo-completo)
5. [index.html - A Estrutura da Pagina](#5-indexhtml---a-estrutura-da-pagina)
6. [main.css - O Estilo Visual](#6-maincss---o-estilo-visual)
7. [src/main.ts - O Cerebro da Aplicacao](#7-srcmaints---o-cerebro-da-aplicacao)
8. [A API do OMDb - Como Funciona](#8-a-api-do-omdb---como-funciona)
9. [TypeScript no Projeto - Por que e Como](#9-typescript-no-projeto---por-que-e-como)
10. [tsconfig.json - Configurando o Compilador](#10-tsconfigjson---configurando-o-compilador)
11. [dist/main.js - O Codigo Compilado](#11-distmainjs---o-codigo-compilado)
12. [Como Rodar o Projeto](#12-como-rodar-o-projeto)
13. [Como Modificar e Recompilar](#13-como-modificar-e-recompilar)
14. [Conceitos Tecnicos Aprendidos](#14-conceitos-tecnicos-aprendidos)

---

## 1. O que e este projeto

O **Nebula Movies** e uma aplicacao web de busca de filmes. Ela permite que o usuario:

- Digite o nome de um filme
- Receba uma lista de resultados
- Clique em qualquer filme para ver informacoes detalhadas: sinopse, elenco, avaliacoes, bilheteria e muito mais

O projeto e escrito em **TypeScript puro**, sem nenhum framework externo como React ou Vue. Isso significa que toda a logica de manipulacao da interface e feita diretamente com as APIs nativas do navegador.

A fonte dos dados e a **OMDb API** (Open Movie Database), uma API publica e gratuita que retorna informacoes sobre filmes.

---

## 2. Visao Geral da Arquitetura

Para entender o projeto, e util visualizar como as partes se comunicam:

```
Usuario digita um filme
        |
        v
   index.html        <-- estrutura HTML da pagina (formulario, listas, paineis)
        |
        v
   main.ts           <-- logica em TypeScript (captura evento, chama API, monta HTML)
        |
        v
   OMDb API          <-- servico externo que retorna dados de filmes em JSON
        |
        v
   main.ts           <-- processa a resposta e injeta no DOM
        |
        v
   main.css          <-- define como tudo vai aparecer visualmente
```

O TypeScript e compilado para JavaScript antes de rodar no navegador. Esse processo de compilacao transforma o arquivo `src/main.ts` em `dist/main.js`, que e o arquivo efetivamente carregado pelo `index.html`.

---

## 3. Estrutura de Arquivos

```
nebula-movies/
|
|-- index.html          # Pagina principal (unica pagina da aplicacao)
|-- main.css            # Estilos visuais globais
|-- tsconfig.json       # Configuracoes do compilador TypeScript
|-- space_icon.png      # Icone/logo do projeto
|
|-- src/
|   |-- main.ts         # Codigo-fonte TypeScript (voce edita este arquivo)
|
|-- dist/
|   |-- main.js         # JavaScript gerado automaticamente (nao edite diretamente)
|
|-- README.md           # Documentacao geral do repositorio
```

**Regra importante:** voce sempre edita o arquivo em `src/main.ts`. O arquivo `dist/main.js` e gerado automaticamente pelo compilador TypeScript e nunca deve ser editado a mao.

---

## 4. Como a Aplicacao Funciona - Fluxo Completo

Vamos seguir o caminho completo de uma busca, do inicio ao fim.

### Passo 1 - O usuario abre a pagina

O navegador carrega o `index.html`. Nesse momento, o `dist/main.js` tambem e carregado, e o script registra um **listener** (ouvinte) no formulario de busca. Nada ainda aparece na tela alem do campo de busca.

### Passo 2 - O usuario digita e pressiona Enter

O evento de `submit` do formulario e disparado. O JavaScript intercepta esse evento e impede o comportamento padrao do navegador (que seria recarregar a pagina). Em seguida, captura o texto digitado pelo usuario.

### Passo 3 - Requisicao para a API de busca

O codigo monta uma URL para a OMDb API com o termo de busca e faz uma requisicao HTTP do tipo `GET` usando a funcao nativa `fetch()`.

Exemplo de URL gerada:
```
https://www.omdbapi.com/?apikey=trilogy&s=Interstellar
```

### Passo 4 - A API responde com uma lista

A API retorna um JSON com uma lista de filmes que batem com o termo buscado. Cada item da lista contem apenas informacoes basicas: titulo, ano e o identificador unico `imdbID`.

### Passo 5 - Os resultados sao exibidos

O codigo percorre a lista e cria elementos HTML dinamicamente para cada filme, inserindo-os na coluna da esquerda da tela.

### Passo 6 - O usuario clica em um filme

O clique dispara uma nova requisicao para a API, agora buscando os detalhes completos do filme usando o `imdbID` como parametro.

```
https://www.omdbapi.com/?apikey=trilogy&i=tt0816692
```

### Passo 7 - Os detalhes sao exibidos

A resposta com os detalhes completos (sinopse, elenco, avaliacoes, etc.) e processada e exibida na coluna da direita da tela.

---

## 5. index.html - A Estrutura da Pagina

O `index.html` e o esqueleto de toda a aplicacao. Ele define onde cada elemento vai existir na pagina.

### Cabecalho

```html
<header>
  <img src="space_icon.png" alt="Nebula icon" />
  <h1>Nebula Movies</h1>
</header>
```

Define o topo da pagina com o logo e o titulo do projeto.

### Formulario de Busca

```html
<form id="search-form">
  <input type="text" id="search-input" placeholder="Search a movie..." />
  <button type="submit">Search</button>
</form>
```

O formulario contem um campo de texto e um botao. O `id="search-form"` e usado pelo TypeScript para capturar o evento de submit. O `id="search-input"` e usado para ler o valor digitado pelo usuario.

### Layout de Duas Colunas

```html
<div id="main-container">
  <div id="results-container">
    <ul id="movie-list"></ul>
  </div>
  <div id="details-container">
    <!-- detalhes aparecem aqui dinamicamente -->
  </div>
</div>
```

O `main-container` organiza a pagina em duas colunas usando CSS Grid. A coluna `results-container` mostra a lista de filmes encontrados. A coluna `details-container` mostra os detalhes do filme clicado.

O `ul#movie-list` comeca vazio e e preenchido dinamicamente pelo JavaScript conforme os resultados chegam da API.

---

## 6. main.css - O Estilo Visual

O arquivo de estilos define a aparencia da aplicacao. Os principais conceitos utilizados sao:

### Tema Escuro

O projeto usa um esquema de cores com fundo escuro e detalhes em vermelho/laranja, remetendo a uma estetica espacial alinhada com o nome "Nebula".

### CSS Grid para o Layout de Duas Colunas

```css
#main-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
```

Essa regra divide o container principal em duas colunas: a primeira ocupa 1 parte do espaco disponivel, e a segunda ocupa 2 partes. Isso faz com que a area de detalhes seja o dobro da largura da lista.

### Position Sticky nos Detalhes

```css
#details-container {
  position: sticky;
  top: 0;
}
```

`position: sticky` faz com que a coluna de detalhes "grude" no topo da janela enquanto o usuario rola a pagina, mantendo as informacoes do filme selecionado sempre visiveis.

### Layout Responsivo

```css
@media (max-width: 768px) {
  #main-container {
    grid-template-columns: 1fr;
  }
}
```

Em telas menores (como celulares), o layout muda de duas colunas para uma unica coluna, empilhando os elementos verticalmente.

### Item Ativo na Lista

```css
.movie-item.active {
  border-left: 3px solid var(--accent-color);
  background-color: rgba(255, 255, 255, 0.05);
}
```

Quando um filme e selecionado, ele recebe a classe CSS `active`, que adiciona um destaque visual (borda colorida e fundo levemente diferente).

---

## 7. src/main.ts - O Cerebro da Aplicacao

Este e o arquivo mais importante do projeto. Vamos analisar cada parte.

### Definicao dos Tipos TypeScript

```typescript
interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Awards: string;
  Ratings: Array<{ Source: string; Value: string }>;
  BoxOffice: string;
  Language: string;
  Country: string;
  imdbRating: string;
}
```

As interfaces descrevem o formato dos dados que a API vai retornar. Isso e exclusivo do TypeScript: em JavaScript puro, voce nao tem essa garantia de estrutura. Com as interfaces, o editor de codigo consegue te avisar se voce tentar acessar uma propriedade que nao existe no objeto.

`MovieSearchResult` descreve cada item da lista de resultados de busca. `MovieDetails` descreve o objeto completo retornado quando voce busca os detalhes de um filme especifico.

### Selecao de Elementos do DOM

```typescript
const form = document.getElementById('search-form') as HTMLFormElement;
const input = document.getElementById('search-input') as HTMLInputElement;
const movieList = document.getElementById('movie-list') as HTMLUListElement;
const detailsContainer = document.getElementById('details-container') as HTMLDivElement;
```

Aqui o codigo "aponta" para os elementos HTML que existem no `index.html`. O `as HTMLFormElement` e o TypeScript sendo usado para dizer ao compilador exatamente qual tipo de elemento HTML cada variavel representa. Isso permite que o editor saiba quais propriedades e metodos estao disponiveis (por exemplo, `.value` em um `HTMLInputElement`).

### Evento de Submit do Formulario

```typescript
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (query) {
    await searchMovies(query);
  }
});
```

Este bloco registra um "ouvinte" para o evento `submit` do formulario. Quando o usuario pressiona Enter ou clica no botao:

- `event.preventDefault()` impede que a pagina recarregue (comportamento padrao de formularios HTML)
- `input.value.trim()` pega o texto digitado e remove espacos em branco das extremidades
- Se o texto nao estiver vazio, chama a funcao `searchMovies`

A palavra `async` indica que essa funcao pode conter operacoes assincronas (como chamadas de API que levam tempo para responder).

### Funcao searchMovies

```typescript
async function searchMovies(query: string): Promise<void> {
  const apiKey = 'trilogy';
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  movieList.innerHTML = '';

  if (data.Response === 'True') {
    data.Search.forEach((movie: MovieSearchResult) => {
      const li = document.createElement('li');
      li.className = 'movie-item';
      li.textContent = `${movie.Title} (${movie.Year})`;
      li.addEventListener('click', () => loadMovieDetails(movie.imdbID, li));
      movieList.appendChild(li);
    });
  } else {
    movieList.innerHTML = '<li>No movies found.</li>';
  }
}
```

Esta funcao e responsavel por buscar a lista de filmes. Vamos entender cada parte:

- `encodeURIComponent(query)` garante que caracteres especiais no nome do filme (como espacos e acentos) sejam convertidos para um formato valido em URL
- `await fetch(url)` faz a requisicao HTTP e espera a resposta do servidor
- `await response.json()` converte o corpo da resposta (que chega como texto) em um objeto JavaScript
- `movieList.innerHTML = ''` limpa a lista antes de inserir novos resultados
- `data.Search.forEach(...)` percorre cada filme retornado pela API
- Para cada filme, cria um elemento `<li>`, define seu texto e adiciona um evento de clique que vai chamar `loadMovieDetails`
- `movieList.appendChild(li)` insere o elemento na pagina

### Funcao loadMovieDetails

```typescript
async function loadMovieDetails(imdbID: string, listItem: HTMLElement): Promise<void> {
  document.querySelectorAll('.movie-item').forEach(item => item.classList.remove('active'));
  listItem.classList.add('active');

  const apiKey = 'trilogy';
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`;

  const response = await fetch(url);
  const movie: MovieDetails = await response.json();

  detailsContainer.innerHTML = buildDetailsHTML(movie);

  const closeBtn = detailsContainer.querySelector('#close-details');
  closeBtn?.addEventListener('click', () => {
    detailsContainer.innerHTML = '';
    listItem.classList.remove('active');
  });
}
```

Esta funcao carrega e exibe os detalhes de um filme especifico. O que ela faz:

- Remove a classe `active` de todos os itens da lista (para garantir que apenas um fique destacado por vez)
- Adiciona a classe `active` no item clicado
- Faz uma requisicao para a API usando o `imdbID` como identificador e `&plot=full` para pedir a sinopse completa
- Chama `buildDetailsHTML` para montar o HTML dos detalhes
- Insere esse HTML no `detailsContainer`
- Busca o botao de fechar dentro do painel recem-criado e registra um evento de clique nele

O operador `?.` em `closeBtn?.addEventListener` e o "optional chaining" do TypeScript: ele so executa o metodo se `closeBtn` nao for `null` ou `undefined`, evitando erros.

### Funcao buildDetailsHTML

```typescript
function buildDetailsHTML(movie: MovieDetails): string {
  const ratings = movie.Ratings?.map(r => `
    <span class="rating-badge">${r.Source}: ${r.Value}</span>
  `).join('') || '';

  return `
    <div class="movie-details">
      <button id="close-details">X</button>
      <h2>${movie.Title} (${movie.Year})</h2>
      <p><strong>Duration:</strong> ${movie.Runtime}</p>
      <p><strong>Rating:</strong> ${movie.Rated}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Writer:</strong> ${movie.Writer}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>Awards:</strong> ${movie.Awards}</p>
      <div class="ratings">${ratings}</div>
      <p><strong>Box Office:</strong> ${movie.BoxOffice}</p>
      <p><strong>Language:</strong> ${movie.Language}</p>
      <p><strong>Country:</strong> ${movie.Country}</p>
    </div>
  `;
}
```

Esta funcao recebe um objeto `MovieDetails` e retorna uma string HTML pronta para ser inserida na pagina.

- `movie.Ratings?.map(...)` usa optional chaining para evitar erros caso a propriedade `Ratings` nao exista
- `.map()` transforma cada objeto de avaliacao em um trecho HTML
- `.join('')` une todos os trechos em uma unica string
- O `|| ''` garante que se `Ratings` for vazio, a variavel `ratings` seja uma string vazia em vez de `undefined`
- O retorno usa **template literals** (backticks), que permitem escrever HTML com multiplas linhas e inserir variaveis diretamente com `${expressao}`

---

## 8. A API do OMDb - Como Funciona

A OMDb API e um servico REST publico. Ela aceita requisicoes HTTP e responde com dados em formato JSON.

### Parametros da API

| Parametro | Descricao | Exemplo |
|-----------|-----------|---------|
| `apikey` | Chave de autenticacao | `trilogy` |
| `s` | Busca por titulo (retorna lista) | `s=Interstellar` |
| `i` | Busca por ID do IMDb (retorna detalhes) | `i=tt0816692` |
| `plot` | Tamanho da sinopse | `plot=full` ou `plot=short` |

### Exemplo de Resposta de Busca (`?s=`)

```json
{
  "Search": [
    {
      "Title": "Interstellar",
      "Year": "2014",
      "imdbID": "tt0816692",
      "Type": "movie",
      "Poster": "https://..."
    }
  ],
  "totalResults": "1",
  "Response": "True"
}
```

### Exemplo de Resposta de Detalhes (`?i=`)

```json
{
  "Title": "Interstellar",
  "Year": "2014",
  "Rated": "PG-13",
  "Runtime": "169 min",
  "Genre": "Adventure, Drama, Sci-Fi",
  "Director": "Christopher Nolan",
  "Actors": "Matthew McConaughey, Anne Hathaway",
  "Plot": "A team of explorers travel through a wormhole...",
  "Ratings": [
    { "Source": "Internet Movie Database", "Value": "8.7/10" },
    { "Source": "Rotten Tomatoes", "Value": "73%" }
  ],
  "BoxOffice": "$188,020,017",
  "Response": "True"
}
```

O campo `Response` e importante: se for `"True"`, a busca teve resultados. Se for `"False"`, a API retorna uma mensagem de erro no campo `Error`.

---

## 9. TypeScript no Projeto - Por que e Como

### O que e TypeScript

TypeScript e um superset do JavaScript, ou seja, todo JavaScript valido tambem e TypeScript valido. A diferenca e que o TypeScript adiciona **tipagem estatica**: voce declara que tipo de dado cada variavel pode conter.

### Por que usar no projeto

Em JavaScript puro, o seguinte e possivel e nao gera erro:

```javascript
const filme = { titulo: "Interstellar" };
console.log(filme.diretor.nome); // ERRO em tempo de execucao!
```

O erro so aparece quando o codigo roda. Com TypeScript e interfaces bem definidas, o editor ja te avisa **antes** de rodar o codigo que `diretor` nao existe naquele objeto.

### O Fluxo de Desenvolvimento

```
Voce edita    -->    Compilador tsc    -->    Navegador executa
src/main.ts          converte para           dist/main.js
                     dist/main.js
```

O navegador nao entende TypeScript diretamente. Por isso existe o passo de compilacao.

### Funcionalidades TypeScript usadas no projeto

- **Interfaces:** definem a estrutura dos objetos retornados pela API
- **Type assertions (`as`):** informam ao compilador o tipo exato de um elemento do DOM
- **Optional chaining (`?.`):** acessa propriedades de forma segura sem erros se o valor for nulo
- **Tipos de retorno (`Promise<void>`):** declaram o que uma funcao assincrona retorna
- **Parametros tipados (`query: string`):** garantem que so strings sejam passadas para a funcao

---

## 10. tsconfig.json - Configurando o Compilador

O arquivo `tsconfig.json` controla como o compilador TypeScript (`tsc`) vai funcionar.

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ES2020",
    "strict": true,
    "lib": ["ES2015", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### O que cada opcao significa

- **target: "ES2017"** - define qual versao do JavaScript o compilador vai gerar. ES2017 e compativel com a maioria dos navegadores modernos
- **module: "ES2020"** - define o sistema de modulos usado. ES modules usam `import`/`export`
- **strict: true** - ativa todas as verificacoes rigorosas do TypeScript (recomendado para evitar bugs)
- **lib: ["ES2015", "DOM"]** - diz ao compilador quais APIs estao disponiveis: funcoes padrao do ES2015 e as APIs do navegador (DOM, `fetch`, `document`, etc.)
- **outDir: "./dist"** - define onde os arquivos `.js` compilados serao salvos
- **rootDir: "./src"** - define onde estao os arquivos `.ts` de origem

---

## 11. dist/main.js - O Codigo Compilado

Este arquivo e gerado automaticamente pelo comando `tsc`. Ele e essencialmente o mesmo codigo de `src/main.ts`, mas convertido para JavaScript puro (sem tipos, sem interfaces).

**Nunca edite este arquivo diretamente.** Qualquer mudanca feita aqui sera sobrescrita na proxima compilacao. Sempre edite o `src/main.ts`.

O `index.html` referencia este arquivo para carregar o script:

```html
<script type="module" src="dist/main.js"></script>
```

O atributo `type="module"` e necessario porque o codigo usa a sintaxe de modulos ES (`import`/`export`).

---

## 12. Como Rodar o Projeto

### Opcao 1 - Servidor Python (mais simples)

Se voce tem Python instalado, abra o terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000` no navegador.

### Opcao 2 - Servidor Node.js

Se voce tem Node.js instalado:

```bash
npx serve .
```

### Opcao 3 - Live Server no VS Code

Se voce usa o VS Code, instale a extensao "Live Server". Entao clique com o botao direito em `index.html` e selecione **Open with Live Server**. O projeto abre automaticamente no navegador e recarrega quando voce salva alteracoes.

### Por que nao basta abrir o arquivo diretamente?

Navegadores modernos bloqueiam requisicoes de APIs feitas a partir de arquivos abertos diretamente com `file://` por motivos de seguranca (politica CORS). Por isso e necessario usar um servidor local.

---

## 13. Como Modificar e Recompilar

### Instalando o TypeScript

Se ainda nao tiver o TypeScript instalado globalmente:

```bash
npm install -g typescript
```

### Fluxo de desenvolvimento

1. Edite o arquivo `src/main.ts`
2. No terminal, na pasta raiz do projeto, execute:

```bash
tsc
```

3. O compilador gera o `dist/main.js` automaticamente
4. Recarregue o navegador para ver as mudancas

### Modo Watch (compilacao automatica)

Para nao precisar rodar `tsc` manualmente a cada alteracao:

```bash
tsc --watch
```

O compilador fica em modo de observacao e recompila automaticamente sempre que voce salva o `main.ts`.

---

## 14. Conceitos Tecnicos Aprendidos

Este projeto cobre varios conceitos fundamentais do desenvolvimento web moderno:

### TypeScript e Tipagem Estatica

Aprender a descrever a estrutura dos dados com interfaces e um dos passos mais importantes para escrever codigo mais seguro e facil de manter.

### Consumo de APIs REST com fetch

A funcao `fetch` e a maneira moderna de fazer requisicoes HTTP no navegador. O padrao `async/await` torna o codigo mais legivel do que as alternativas mais antigas baseadas em callbacks.

### Manipulacao do DOM

Criar elementos dinamicamente com `document.createElement`, modificar o conteudo com `innerHTML` e adicionar eventos com `addEventListener` sao habilidades essenciais para qualquer desenvolvedor front-end.

### CSS Grid e Flexbox

O layout de duas colunas e construido com CSS Grid, enquanto os elementos internos usam Flexbox para alinhamento. Esses dois sistemas formam a base do layout moderno em CSS.

### Design Responsivo com Media Queries

O projeto adapta seu layout para telas pequenas usando `@media`. Isso garante que a aplicacao seja utilizavel em celulares e tablets, nao apenas em desktops.

### Separacao de Responsabilidades

Cada arquivo tem um papel claro:
- `index.html` cuida da estrutura
- `main.css` cuida da aparencia
- `src/main.ts` cuida do comportamento e da logica

Essa separacao e uma pratica fundamental em desenvolvimento web e facilita a manutencao e evolucao do projeto ao longo do tempo.