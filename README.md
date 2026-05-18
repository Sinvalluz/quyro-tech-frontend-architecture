# Quyro Tech Frontend Architecture

## Visão Geral

Este projeto representa a arquitetura front-end base da Quyro Tech para novos projetos React. Ele não deve ser lido apenas como uma aplicação comum, mas como um template arquitetural com separação clara entre inicialização da aplicação, rotas, providers globais, configuração, biblioteca compartilhada, componentes reutilizáveis e features de negócio.

A organização atual segue uma abordagem orientada a features: páginas ficam em `src/app/routes`, regras e fluxos de negócio ficam dentro de `src/features`, componentes visuais reutilizáveis ficam em `src/components`, integrações técnicas ficam em `src/lib` e configurações globais ficam em `src/config`.

O objetivo é criar uma base previsível para que novos desenvolvedores consigam entender onde cada responsabilidade deve viver antes de começar a implementar uma funcionalidade.

## Tecnologias Utilizadas

- **Vite**: ferramenta de build e servidor de desenvolvimento. A configuração está em `vite.config.ts`.
- **React**: biblioteca principal para construção da interface.
- **TypeScript**: tipagem estática da aplicação. As regras principais estão em `tsconfig.app.json`, `tsconfig.node.json` e `tsconfig.json`.
- **React Router**: roteamento client-side via `createBrowserRouter` e `RouterProvider`.
- **TanStack Query**: gerenciamento de cache, queries e mutations assíncronas. A configuração base está em `src/lib/reactQuery.ts`.
- **Axios**: cliente HTTP centralizado em `src/lib/axios.ts`.
- **TailwindCSS v4**: estilização utilitária integrada ao Vite com `@tailwindcss/vite`.
- **shadcn/ui + Radix UI**: base de componentes acessíveis e estilizados em `src/components/ui`.
- **React Hook Form**: gerenciamento de formulários, usado no formulário de registro.
- **Zod**: validação de schemas e inferência de tipos, usado no schema de registro e na validação de env.
- **Biome**: formatação e lint. A configuração está em `biome.json`.
- **Lucide React**: biblioteca de ícones configurada em `components.json`, embora não exista uso direto de ícones nos arquivos atuais.
- **Inter Variable**: fonte global importada em `src/index.css` via `@fontsource-variable/inter`.

## Estrutura do Projeto

```txt
.
├── public/
├── src/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   │   └── Register.tsx
│   │   │   ├── Home.tsx
│   │   │   └── NotFound.tsx
│   │   ├── index.tsx
│   │   └── Router.tsx
│   ├── components/
│   │   └── ui/
│   ├── config/
│   │   ├── env.ts
│   │   └── paths.ts
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       ├── schemas/
│   │       ├── services/
│   │       └── types/
│   ├── lib/
│   │   ├── axios.ts
│   │   ├── reactQuery.ts
│   │   └── utils.ts
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   └── QueryProvider.tsx
│   ├── types/
│   │   └── user.ts
│   ├── index.css
│   └── main.tsx
├── .env.example
├── biome.json
├── components.json
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Explicação das Pastas

### `src/app`

**Responsabilidade:**  
Camada de aplicação. Centraliza a composição inicial do app e o roteamento.

**O que vive aqui:**  
Arquivo de entrada da aplicação React (`index.tsx`), configuração do router (`Router.tsx`) e páginas de rota em `routes`.

**O que não deve viver aqui:**  
Regras de negócio, chamadas HTTP diretas, schemas de validação, tipos específicos de domínio ou componentes internos de uma feature.

**Exemplo real:**  
`src/app/index.tsx` envolve o roteador com `AppProviders`.

```tsx
export const App = () => {
	return (
		<AppProviders>
			<AppRouter />
		</AppProviders>
	);
};
```

**Regra de uso:**  
Use `src/app` para configurar como a aplicação nasce e como as rotas são registradas. A lógica específica de cada domínio deve ser delegada para `src/features`.

### `src/app/routes`

**Responsabilidade:**  
Representar as páginas acessadas pelo React Router.

**O que vive aqui:**  
Componentes de rota, como `Home.tsx`, `NotFound.tsx` e `auth/Register.tsx`.

**O que não deve viver aqui:**  
Implementações completas de regras de negócio. A rota deve montar a tela e chamar componentes de feature quando necessário.

**Exemplo real:**  
`src/app/routes/auth/Register.tsx` importa o formulário da feature de autenticação.

```tsx
import RegisterForm from '@/features/auth/components/RegisterForm';

export default function RegisterRoute() {
	return (
		<div className='mt-52 flex flex-col items-center font-semibold'>
			<h1>Register Route - Quyro Tech</h1>
			<RegisterForm />
		</div>
	);
}
```

**Regra de uso:**  
Uma rota deve ser fina: organiza layout, conecta a URL a uma feature e evita concentrar validação, mutation ou chamada HTTP.

### `src/components`

**Responsabilidade:**  
Armazenar componentes globais reutilizáveis e sem dependência de domínio.

**O que vive aqui:**  
Atualmente existe a pasta `ui`, que contém componentes base de interface.

**O que não deve viver aqui:**  
Componentes que sabem sobre autenticação, cadastro, usuário ou qualquer regra de negócio específica.

**Exemplo real:**  
`src/components/ui/button.tsx` exporta o componente global `Button`.

**Regra de uso:**  
Se o componente pode ser usado em qualquer feature sem conhecer o domínio, ele pode viver aqui. Se ele pertence a uma funcionalidade específica, coloque em `src/features/[feature]/components`.

### `src/components/ui`

**Responsabilidade:**  
Design system local da aplicação, baseado em shadcn/ui, Radix UI, TailwindCSS e `class-variance-authority`.

**O que vive aqui:**  
Componentes visuais primitivos como `button.tsx`, `card.tsx`, `field.tsx`, `input.tsx`, `label.tsx` e `separator.tsx`.

**O que não deve viver aqui:**  
Estado de negócio, mutations, queries, chamadas HTTP, acesso a `localStorage` ou validações de domínio.

**Exemplo real:**  
`Button` define variantes visuais com `cva`.

```tsx
const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-md ...",
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/80',
				outline: 'border-border bg-background shadow-xs hover:bg-muted ...',
			},
		},
	},
);
```

**Regra de uso:**  
Componentes de `ui` devem ser genéricos, composáveis e controlados por props. Eles não devem importar arquivos de `features`.

### `src/config`

**Responsabilidade:**  
Centralizar configurações globais da aplicação.

**O que vive aqui:**  
Definições de paths e validação/leitura de variáveis de ambiente.

**O que não deve viver aqui:**  
Funções de chamada HTTP, componentes React, schemas de formulário ou lógica específica de uma feature.

**Exemplo real:**  
`src/config/paths.ts` concentra as URLs usadas no router e em links.

```ts
export const paths = {
	home: {
		path: '/',
		getHref: () => '/',
	},
	auth: {
		register: {
			path: '/auth/register',
			getHref: (redirectTo?: string | null | undefined) =>
				`/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
		},
	},
} as const;
```

**Regra de uso:**  
Rotas e URLs internas devem ser adicionadas em `paths.ts` antes de serem usadas nas telas.

### `src/features`

**Responsabilidade:**  
Organizar as funcionalidades de negócio por domínio.

**O que vive aqui:**  
Pastas de feature. No estado atual do projeto existe `auth`, responsável pelo fluxo de registro/autenticação inicial.

**O que não deve viver aqui:**  
Componentes visuais totalmente genéricos, configuração global da aplicação ou inicialização de providers globais.

**Exemplo real:**  
`src/features/auth` contém `components`, `schemas`, `services` e `types`.

**Regra de uso:**  
Toda nova funcionalidade de negócio deve nascer como uma pasta dentro de `src/features`.

### `src/features/auth`

**Responsabilidade:**  
Concentrar a lógica de autenticação presente no projeto.

**O que vive aqui:**  
Formulário de registro, schema de validação do registro, serviço HTTP de registro e tipos da resposta de autenticação.

**O que não deve viver aqui:**  
Componentes globais de UI, configurações globais do router ou tipos globais que servem para toda a aplicação.

**Exemplo real:**  
`src/features/auth/services/register.ts` envia os dados para `/auth/register` e salva o token retornado no `localStorage`.

```ts
export async function registerUser(data: RegisterFormData): Promise<RegisterResponse> {
	const response = await api.post<RegisterResponse>('/auth/register', data);

	localStorage.setItem('token', response.data.token);

	return response.data;
}
```

**Regra de uso:**  
Tudo que pertence ao domínio de autenticação deve ficar nesta feature. Caso surjam login, logout, recuperação de senha ou busca do usuário logado, eles devem ser adicionados aqui ou em subpastas equivalentes.

### `src/features/auth/components`

**Responsabilidade:**  
Componentes React específicos da feature de autenticação.

**O que vive aqui:**  
Componentes que sabem sobre campos, fluxo e comportamento de auth.

**O que não deve viver aqui:**  
Componentes de UI genéricos que poderiam ser usados por qualquer domínio.

**Exemplo real:**  
`RegisterForm.tsx` usa `react-hook-form`, `zodResolver`, `useMutation`, componentes de UI e o service `registerUser`.

**Regra de uso:**  
Componentes desta pasta podem orquestrar schemas, services e componentes globais, mas devem continuar pertencendo apenas ao domínio de autenticação.

### `src/features/auth/schemas`

**Responsabilidade:**  
Definir schemas de validação e tipos inferidos a partir desses schemas.

**O que vive aqui:**  
Schemas Zod usados pelos formulários e fluxos da feature.

**O que não deve viver aqui:**  
Tipos de resposta da API que não dependem de validação de formulário, chamadas HTTP ou componentes React.

**Exemplo real:**  
`register.schema.ts` define `RegisterSchema` e infere `RegisterFormData`.

```ts
export const RegisterSchema = z.object({
	name: z.string().min(2, 'Digite um nome válido'),
	email: z.email('Digite um email válido'),
	password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
```

**Regra de uso:**  
Quando um formulário precisa de validação, crie um schema na feature e derive o tipo com `z.infer`.

### `src/features/auth/services`

**Responsabilidade:**  
Encapsular chamadas HTTP da feature.

**O que vive aqui:**  
Funções assíncronas que conversam com a API usando o client central `api`.

**O que não deve viver aqui:**  
Componentes React, JSX, estilos ou regras de apresentação.

**Exemplo real:**  
`register.ts` expõe `registerUser`.

**Regra de uso:**  
Services devem receber dados tipados, chamar endpoints e retornar dados tipados. O componente ou hook decide como usar loading, erro, sucesso e cache.

### `src/features/auth/types`

**Responsabilidade:**  
Tipos específicos da feature de autenticação.

**O que vive aqui:**  
Tipos como `RegisterResponse`, que representa a resposta do endpoint de registro.

**O que não deve viver aqui:**  
Schemas Zod ou tipos globais compartilhados por toda a aplicação.

**Exemplo real:**  
`auth.types.ts` compõe a resposta de registro com o tipo global `User`.

```ts
import type { User } from '@/types/user';

export type RegisterResponse = {
	user: User;
	token: string;
};
```

**Regra de uso:**  
Tipos que pertencem apenas ao domínio de auth ficam aqui. Tipos compartilhados por vários domínios devem ir para `src/types`.

### `src/lib`

**Responsabilidade:**  
Centralizar integrações técnicas e helpers compartilhados.

**O que vive aqui:**  
Cliente Axios, configuração do TanStack Query e função utilitária para classes CSS.

**O que não deve viver aqui:**  
Componentes React de domínio, páginas, schemas de formulário ou services específicos de feature.

**Exemplo real:**  
`src/lib/axios.ts` configura `baseURL`, header JSON e interceptors.

**Regra de uso:**  
Bibliotecas externas com configuração própria devem ser encapsuladas aqui antes de serem usadas pelas features.

### `src/providers`

**Responsabilidade:**  
Agrupar providers globais da aplicação.

**O que vive aqui:**  
`AppProviders.tsx` e `QueryProvider.tsx`.

**O que não deve viver aqui:**  
Providers específicos de uma única feature, componentes de tela ou chamadas HTTP.

**Exemplo real:**  
`QueryProvider.tsx` instancia um `QueryClient` com `queryConfig`.

```tsx
const [queryClient] = useState(
	() =>
		new QueryClient({
			defaultOptions: queryConfig,
		}),
);
```

**Regra de uso:**  
Todo provider global deve ser registrado em `AppProviders`, mantendo `main.tsx` limpo.

### `src/types`

**Responsabilidade:**  
Guardar tipos globais compartilhados entre múltiplas camadas ou features.

**O que vive aqui:**  
Tipos de domínio usados de forma ampla, como `User`.

**O que não deve viver aqui:**  
Tipos que pertencem a uma única feature.

**Exemplo real:**  
`src/types/user.ts` define o usuário usado pela resposta de auth.

```ts
type Roles = 'ADMIN' | 'USER';

export type User = {
	id: string;
	name: string;
	email: string;
	roles: Roles;
};
```

**Regra de uso:**  
Antes de criar um tipo global, confirme se ele realmente será compartilhado. Se for local de uma feature, mantenha dentro da feature.

### `public`

**Responsabilidade:**  
Armazenar arquivos estáticos servidos diretamente pelo Vite.

**O que vive aqui:**  
Assets públicos que não precisam passar pelo pipeline de importação do React.

**O que não deve viver aqui:**  
Componentes, código TypeScript, regras de negócio ou assets que precisam ser importados e versionados junto ao bundle.

**Exemplo real:**  
A pasta existe no projeto como diretório público padrão do Vite.

**Regra de uso:**  
Use apenas para arquivos que devem ser acessados diretamente pela URL pública.

## Explicação dos Arquivos Principais

### `src/main.tsx`

Ponto de entrada React. Importa `src/index.css`, renderiza `<App />` e usa `StrictMode`.

### `src/app/index.tsx`

Componente raiz da aplicação. Envolve `AppRouter` com `AppProviders`.

### `src/app/Router.tsx`

Define o roteador com `createBrowserRouter`. As rotas são carregadas de forma lazy:

- `/` carrega `src/app/routes/Home.tsx`;
- `/auth/register` carrega `src/app/routes/auth/Register.tsx`;
- `*` carrega `src/app/routes/NotFound.tsx`.

O arquivo também possui a função `convert`, que adapta exports opcionais chamados `clientLoader` e `clientAction` para `loader` e `action`, injetando o `QueryClient`. Hoje as rotas existentes exportam apenas o componente padrão, mas o padrão já está preparado para rotas que precisem conversar com o cache do TanStack Query.

### `src/providers/AppProviders.tsx`

Agrupa providers globais. Atualmente registra apenas `QueryProvider`.

### `src/providers/QueryProvider.tsx`

Cria uma instância de `QueryClient` e registra `QueryClientProvider`.

### `src/lib/reactQuery.ts`

Define a configuração padrão do TanStack Query:

- `refetchOnWindowFocus: false`;
- `retry: false`;
- `staleTime: 1000 * 60`.

Também exporta tipos auxiliares `ApiFnReturnType`, `QueryConfig` e `MutationConfig`.

### `src/lib/axios.ts`

Cria o client HTTP `api` com `axios.create`.

Comportamentos atuais:

- usa `import.meta.env.VITE_API_URL` como `baseURL`;
- envia `Content-Type: application/json`;
- adiciona `Authorization: Bearer <token>` quando existe token no `localStorage`;
- em respostas `401`, remove o token e redireciona para `/auth/register`.

### `src/config/paths.ts`

Centraliza paths da aplicação e funções `getHref`. Deve ser a fonte principal para URLs internas.

### `src/config/env.ts`

Define uma validação de variáveis de ambiente com Zod. O arquivo procura variáveis iniciadas com `VITE_APP_` e espera uma chave `API_URL`.

Observação importante: no estado atual do projeto, `src/lib/axios.ts` usa diretamente `import.meta.env.VITE_API_URL`, e `.env.example` também declara `VITE_API_URL=http://localhost:3000`. Portanto, `env.ts` existe como estrutura de validação, mas não é usado pelo client Axios atual.

### `src/features/auth/components/RegisterForm.tsx`

Implementa o formulário de registro. Ele combina:

- `useForm` do React Hook Form;
- `zodResolver(RegisterSchema)`;
- `Controller` para conectar campos controlados;
- componentes de UI (`Card`, `Field`, `Input`, `Button`);
- `useMutation` do TanStack Query;
- service `registerUser`.

O estado de loading vem de `isPending`, erros são exibidos quando `isError` é verdadeiro e o submit chama `mutate(data)`.

### `src/features/auth/schemas/register.schema.ts`

Define o contrato de validação do formulário de registro. O schema valida:

- `name` com mínimo de 2 caracteres e sem números/símbolos;
- `email` válido;
- `password` com mínimo de 8 caracteres, letra maiúscula, letra minúscula, número e símbolo.

O tipo `RegisterFormData` é derivado do schema.

### `src/features/auth/services/register.ts`

Service responsável por registrar usuário na API. Faz `POST /auth/register`, salva `response.data.token` no `localStorage` e retorna `response.data`.

### `src/features/auth/types/auth.types.ts`

Define `RegisterResponse`, composto por `user: User` e `token: string`.

### `src/types/user.ts`

Define o tipo global `User` e os papéis possíveis `ADMIN` e `USER`.

### `src/lib/utils.ts`

Exporta `cn`, helper que combina `clsx` e `tailwind-merge` para montar classes Tailwind sem conflitos.

### `src/index.css`

Arquivo global de estilos. Importa TailwindCSS, animações, shadcn, fonte Inter e define tokens CSS de tema claro/escuro usando variáveis como `--background`, `--foreground`, `--primary`, `--border`, `--radius` e outras.

### `vite.config.ts`

Configura Vite com React, TailwindCSS e alias `@` apontando para `./src`.

### `components.json`

Configuração do shadcn/ui. Define uso de TSX, CSS em `src/index.css`, biblioteca de ícones `lucide`, aliases e estilo `radix-vega`.

### `biome.json`

Configuração de formatação e lint. O projeto usa tabs, largura de linha 120, aspas simples em JavaScript/JSX, ponto e vírgula e organização automática de imports.

### `.env.example`

Exemplo de variável de ambiente:

```env
VITE_API_URL=http://localhost:3000
```

### `index.html`

HTML base do Vite. Contém `<div id="root"></div>` e carrega `/src/main.tsx`.

## Fluxo de Dados da Aplicação

O fluxo atual pode ser entendido assim:

```txt
main.tsx
  -> App
    -> AppProviders
      -> QueryProvider
        -> AppRouter
          -> Route
            -> Feature component
              -> Schema / Types
              -> Service
                -> api (Axios)
                  -> Backend
              -> TanStack Query mutation/cache
```

Exemplo real no registro:

1. O usuário acessa `/auth/register`.
2. `AppRouter` carrega `src/app/routes/auth/Register.tsx`.
3. A rota renderiza `RegisterForm`.
4. `RegisterForm` usa `RegisterSchema` para validar os campos com Zod.
5. Ao enviar o formulário, `useMutation` executa `registerUser`.
6. `registerUser` chama `api.post('/auth/register', data)`.
7. `api` usa a configuração global do Axios e interceptors.
8. A resposta esperada segue `RegisterResponse`.
9. O token retornado é salvo no `localStorage`.
10. O componente reage a loading, sucesso e erro com estados da mutation.

## Fluxo de Autenticação

A autenticação existente no projeto ainda é inicial, mas já possui os seguintes comportamentos:

- A rota pública de registro é `/auth/register`.
- O formulário de registro envia dados para `POST /auth/register`.
- A resposta esperada contém `user` e `token`.
- O token é salvo no `localStorage` pelo service `registerUser`.
- O interceptor de request em `src/lib/axios.ts` lê o token do `localStorage` e envia `Authorization: Bearer <token>`.
- O interceptor de response remove o token em erro `401` e redireciona para `/auth/register`.

Não há, no estado atual do projeto, implementação de:

- rota protegida;
- componente de guarda de rota;
- busca do usuário logado;
- refresh token;
- logout dedicado;
- provider de sessão/autenticação;
- armazenamento em cookie.

Se esses recursos forem adicionados, devem manter a separação atual: regras de auth em `src/features/auth`, configuração global de rotas em `src/app/Router.tsx` e client HTTP em `src/lib/axios.ts`.

## Convenções do Projeto

### Organização por feature

Funcionalidades de negócio devem ficar em `src/features/[nome-da-feature]`.

Exemplo atual:

```txt
src/features/auth/
├── components/
├── schemas/
├── services/
└── types/
```

### Rotas finas

Arquivos de `src/app/routes` devem montar a página e delegar comportamento para features.

### Services por domínio

Chamadas HTTP específicas de uma feature devem ficar em `src/features/[feature]/services`.

Exemplo: `src/features/auth/services/register.ts`.

### Schemas separados dos tipos de API

Schemas Zod validam entrada de dados, principalmente formulários. Tipos de resposta da API vivem em `types`.

Exemplo:

- `RegisterSchema` e `RegisterFormData` ficam em `schemas/register.schema.ts`;
- `RegisterResponse` fica em `types/auth.types.ts`.

### Alias de importação

Use `@/` para importar a partir de `src`.

Exemplo:

```ts
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
```

### Componentes de UI

Componentes em `src/components/ui` devem ser reutilizáveis e sem domínio. Eles podem usar `cn`, Tailwind, Radix UI e variantes com `cva`.

### Formulários

O padrão atual para formulários é:

- React Hook Form para estado;
- Zod para validação;
- `@hookform/resolvers/zod` para integração;
- componentes de UI para renderização;
- service + mutation para envio.

### TanStack Query

Mutations e queries devem usar a configuração global do `QueryClient`. Para mutations, o exemplo atual usa `useMutation` diretamente no componente `RegisterForm`.

### Estilo e formatação

O projeto usa Biome com:

- tabs;
- aspas simples;
- ponto e vírgula;
- trailing commas;
- line width 120;
- organização de imports.

## Como Criar uma Nova Feature

1. Crie a pasta da feature:

```txt
src/features/minha-feature/
```

2. Adicione componentes específicos da feature:

```txt
src/features/minha-feature/components/
```

Use essa pasta para componentes que conhecem o domínio da feature.

3. Adicione schemas quando houver validação:

```txt
src/features/minha-feature/schemas/
```

Siga o padrão de `register.schema.ts`: exporte o schema e derive o tipo com `z.infer`.

4. Adicione tipos específicos da feature:

```txt
src/features/minha-feature/types/
```

Use para respostas de API, payloads e tipos que não são globais.

5. Adicione services HTTP:

```txt
src/features/minha-feature/services/
```

Services devem usar `api` de `src/lib/axios.ts`.

6. Crie a página de rota:

```txt
src/app/routes/MinhaFeature.tsx
```

Ou agrupe por domínio quando fizer sentido:

```txt
src/app/routes/minha-feature/MinhaPagina.tsx
```

7. Registre o path:

```ts
// src/config/paths.ts
export const paths = {
	// ...
	minhaFeature: {
		path: '/minha-feature',
		getHref: () => '/minha-feature',
	},
} as const;
```

8. Registre a rota no router:

```tsx
// src/app/Router.tsx
{
	path: paths.minhaFeature.path,
	lazy: () => import('./routes/MinhaFeature').then(convert(queryClient)),
	HydrateFallback: () => null,
}
```

9. Se precisar de dados assíncronos, use TanStack Query:

- queries para leitura/cache;
- mutations para criação, atualização e remoção;
- services para comunicação HTTP.

10. Se a feature começar a crescer, mantenha a separação:

```txt
components/  -> UI com domínio da feature
schemas/     -> validação e tipos inferidos de entrada
services/    -> chamadas HTTP
types/       -> tipos específicos da feature
```

## Decisões Arquiteturais

### Separar `app` de `features`

`app` sabe como iniciar e rotear a aplicação. `features` sabe como executar regras de negócio. Essa separação evita que páginas virem arquivos grandes com formulário, validação, request e tratamento de erro misturados.

### Centralizar HTTP em `src/lib/axios.ts`

O client Axios único permite padronizar `baseURL`, headers, token e tratamento de erro `401`. Assim, services de feature não precisam repetir configuração técnica.

### Usar TanStack Query como camada assíncrona

TanStack Query padroniza loading, erro, cache, mutations e invalidações futuras. Mesmo que o exemplo atual use apenas mutation de registro, a base já possui `QueryClient` global.

### Usar Zod junto com React Hook Form

Zod mantém o contrato de validação explícito e permite derivar tipos TypeScript do próprio schema. Isso reduz divergência entre o que o formulário aceita e o que o TypeScript acredita que ele aceita.

### Manter componentes globais sem domínio

`src/components/ui` é uma base visual compartilhada. Ao impedir regras de negócio nessa pasta, os componentes ficam mais reutilizáveis e fáceis de manter.

### Centralizar paths

`src/config/paths.ts` evita strings de rota espalhadas pela aplicação e reduz erro em redirects, links e registro de rotas.

## Boas Práticas

- Mantenha rotas pequenas e delegue lógica para features.
- Use `@/` nos imports internos.
- Crie services tipados para chamadas HTTP.
- Derive tipos de formulário a partir dos schemas Zod.
- Use `src/types` apenas para tipos realmente globais.
- Evite duplicar URLs; registre paths em `src/config/paths.ts`.
- Use componentes de `src/components/ui` para manter consistência visual.
- Centralize novos providers globais em `src/providers/AppProviders.tsx`.
- Preserve o padrão de formatação definido no `biome.json`.
- Mantenha interceptors e configuração de API em `src/lib/axios.ts`.
- Prefira nomes explícitos, como `RegisterForm`, `RegisterSchema`, `RegisterFormData` e `registerUser`.

## O que Evitar

- Não colocar chamada HTTP diretamente em arquivos de rota.
- Não colocar regra de negócio dentro de `src/components/ui`.
- Não criar tipos globais para conceitos usados por apenas uma feature.
- Não espalhar strings de rotas pela aplicação.
- Não duplicar configuração de Axios dentro de services.
- Não misturar schema de validação com componente visual.
- Não usar `localStorage` diretamente em vários pontos sem necessidade; hoje o acesso ao token está concentrado no service de registro e no client Axios.
- Não documentar ou usar pastas que ainda não existem como se fossem obrigatórias. Por exemplo, não existe `src/hooks` global no estado atual do projeto.
- Não criar uma feature nova dentro de `src/app/routes`; a rota só deve apontar para a feature.
- Não ignorar estados de loading e erro em mutations e queries.

## Scripts Disponíveis

```bash
npm run dev
npm run build
npm run biome
npm run preview
```

- `npm run dev`: inicia o servidor de desenvolvimento Vite.
- `npm run build`: executa TypeScript em modo build e gera o build Vite.
- `npm run biome`: formata `./src` com Biome.
- `npm run preview`: serve localmente o build gerado.

## Observações de Manutenção

Este projeto deve ser mantido como referência oficial. Sempre que a arquitetura base evoluir, este README deve ser atualizado junto com o código.

Pontos que merecem atenção em evoluções futuras:

- alinhar `src/config/env.ts`, `.env.example` e `src/lib/axios.ts` em torno de um único padrão de variável de ambiente;
- adicionar guards de rota quando existirem páginas protegidas;
- criar fluxo explícito de logout quando necessário;
- adicionar busca do usuário logado quando a aplicação precisar de sessão carregada no front-end;
- avaliar criação de hooks específicos por feature quando a lógica de queries/mutations crescer.

