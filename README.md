# Atividade01 – TanQuery

## Integrantes
- Carlos Ferraz — RM 555223
-
-

## Descrição
Aplicativo React Native (Expo) que consome a API pública `https://jsonplaceholder.typicode.com/users` usando **TanStack Query**.  
Exibe nome, e-mail e cidade dos usuários, com estados de **carregamento** e **erro**.  
Extras: **botão de atualizar**, **pull-to-refresh** e **paginação simples** (fake).

## Tecnologias
- Expo / React Native
- @tanstack/react-query
- Axios

## Requisitos
- Node.js LTS
- NPM (ou Yarn)
- Expo (via `npx`, não precisa instalar global)

## Como rodar
```bash
npm install
npx expo start
# pressione: a (Android) ou w (Web)
# se precisar limpar cache: npx expo start -c
```
```

## Estrutura do projeto
```
.
├── App.js                      — Componente raiz do app. Envolve a árvore com QueryClientProvider e renderiza <UserList />.
├── index.js                    — Ponto de entrada clássico do Expo. Registra o App com registerRootComponent(App).
├── components/                 — Pasta de componentes de UI (apenas apresentação/estado local).
│   └── UserList.js             — Tela/lista de usuários. Usa useQuery para buscar dados, trata loading/erro e faz paginação fake.
├── services/                   — Camada de acesso a dados (chamadas HTTP, clients).
│   └── users.js                — Serviço dos usuários: axios (baseURL, timeout), flags de teste (erro/delay) e função getUsers().
├── constants/                  — Constantes compartilhadas do projeto.
│   └── index.js                — API_URL, USERS_ENDPOINT e PAGE_SIZE usados por services e componentes.
├── package.json                — Metadados do projeto, dependências (Expo, React Query, axios), scripts (start, web, etc.).
└── README.md                   — Instruções de instalação/execução, como testar loading/erro e checklist dos requisitos.

```

## Entrada do app
Este projeto usa **entrada clássica** (sem `expo-router`):
- `package.json` → `"main": "index.js"`
- `index.js` registra o app:
```js
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```
- `App.js` envolve a árvore com `QueryClientProvider` e renderiza `UserList`.

## Como testar loading e erro
O app usa TanStack Query para buscar `https://jsonplaceholder.typicode.com/users`.

As flags de teste ficam em services/users.js:

```js
export const TEST_FORCE_ERROR = false; // mude p/ true para simular ERRO
export const TEST_DELAY_MS = 800;      // atraso para ver "Carregando..."

```

- **Loading**: mantendo `TEST_DELAY_MS > 0`, ao abrir a tela aparece **“Carregando usuários...”**.
- **Erro**: altere `TEST_FORCE_ERROR` para **true** e salve. A tela exibirá **“Erro ao carregar usuários”** + mensagem do erro.  
  Para voltar ao normal, retorne `TEST_FORCE_ERROR` para **false**.

> Dica para demonstrar o erro logo ao abrir (ignorando cache): no UserList.js, temporariamente use
staleTime: 0 e refetchOnMount: 'always'.

## Critérios atendidos (rubrica)
- ✅ **TanStack Query instalado e configurado** (QueryClient + QueryClientProvider em `App.js`)
- ✅ **Hook `useQuery`** consumindo `https://jsonplaceholder.typicode.com/users`
- ✅ **Exibição dos dados** (nome, e-mail, cidade)
- ✅ **Tratamento de loading e erro** (mensagens visíveis + botão “Tentar novamente”)
- ✅ **Organização e legibilidade** (componentização em `components/UserList.js`)
- ⭐ **Extras**: botão **Atualizar**, **pull-to-refresh**, **paginação** (fake)

## Comandos úteis
```bash
# rodar só Web diretamente
npm run web

# limpar cache do Metro
npx expo start -c
```

## Observações
- Em caso de rede lenta, há um atraso artificial configurável para demonstrar o estado de carregamento.
- A paginação é apenas de interface (não vem da API).
