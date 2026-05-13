# Arquitetura do Projeto - Quyro Tech Frontend

Este projeto utiliza uma arquitetura modular baseada em funcionalidades (features), focada em escalabilidade, manutenção e separação de responsabilidades.

## Estrutura de Pastas

Abaixo está uma descrição detalhada da estrutura de diretórios e arquivos principais:

### Raiz do Projeto

-   **`index.html`**: O ponto de entrada HTML da aplicação Vite.
-   **`package.json`**: Gerenciamento de dependências, scripts e metadados do projeto.
-   **`tsconfig.json`** (e variantes): Configurações do TypeScript para o projeto, aplicação e ambiente Node.
-   **`vite.config.ts`**: Configuração do Vite para o build e servidor de desenvolvimento.

### Diretório `src/`

O coração da aplicação.

-   **`main.tsx`**: Ponto de entrada do React. Ele inicializa o nó raiz do DOM e renderiza o componente principal `App`.
-   **`index.css`**: Estilos globais da aplicação.

#### `src/app/`
Contém a configuração global da aplicação que envolve toda a estrutura.
-   **`index.tsx`**: Componente raiz que combina provedores (`AppProvider`) e o roteamento (`AppRouter`).
-   **`Provider.tsx`**: Centraliza todos os Context Providers (React Query, Auth, Theme, etc.).
-   **`Router.tsx`**: Configuração principal de rotas da aplicação.
-   **`routes/`**: Componentes de página de nível superior (ex: Home, NotFound).

#### `src/config/`
Armazena constantes e configurações globais.
-   **`paths.ts`**: Definição centralizada de caminhos (URLs) usados na aplicação para evitar strings mágicas.

#### `src/features/`
Esta pasta deve conter módulos independentes baseados em funcionalidades do negócio (ex: `auth`, `users`, `dashboard`). Cada funcionalidade geralmente contém suas próprias pastas `api`, `components`, `hooks`, `types` e `routes`.

#### `src/lib/`
Configurações de bibliotecas externas.
-   **`reactQuery.ts`**: Configuração do cliente e padrões do React Query (TanStack Query).

## Fluxo de Desenvolvimento

1.  **Novas Funcionalidades**: Devem ser criadas dentro de `src/features/`.
2.  **Configurações**: Qualquer nova biblioteca ou chave de configuração deve ir para `src/lib/` ou `src/config/`.
3.  **Rotas**: Rotas globais são gerenciadas em `src/app/Router.tsx`.
