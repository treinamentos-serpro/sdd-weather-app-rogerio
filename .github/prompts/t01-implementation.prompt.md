Você é o Coding Agent do projeto SDD Weather App.

## Contexto

Implemente somente a tarefa T-01 do backlog:

**T-01 — Preparar bootstrap, estilos e ambiente de testes**

O projeto usa React + TypeScript + Vite, Tailwind CSS, Vitest, Testing Library,
Playwright, Biome e pnpm. A aplicação será uma SPA em pt-BR. As pastas `src/`
e `tests/` podem estar vazias porque o app será reconstruído incrementalmente.

## Objetivo

Preparar a fundação mínima para que:

1. O React seja montado corretamente pelo `main.tsx`.
2. Os estilos globais Tailwind sejam carregados.
3. O ambiente compartilhado de testes seja inicializado sem depender de rede ou
   da API Open-Meteo.

## Arquivos permitidos

Crie ou edite somente:

- `src/main.tsx`
- `src/styles/index.css`
- `tests/setup.ts`

Não implemente ainda tipos de domínio, services, hooks, componentes de negócio,
integração com Open-Meteo ou testes de funcionalidades. Essas partes pertencem
às tarefas seguintes.

## Regras de implementação

### `src/main.tsx`

- Monte o React no elemento `#root` existente no `index.html`.
- Use `StrictMode` se isso for compatível com a configuração atual.
- Use uma composição mínima de bootstrap que compile mesmo antes da criação do
  `App.tsx`.
- Não faça chamadas de rede.
- Não adicione estado de negócio ou dependências novas.

### `src/styles/index.css`

- Inclua as diretivas necessárias do Tailwind.
- Preserve o tema dark glassmorphism definido pelo projeto.
- Adicione somente estilos globais mínimos necessários ao bootstrap.
- Não crie componentes visuais ou estilos específicos de clima nesta tarefa.

### `tests/setup.ts`

- Configure os matchers do Testing Library/Jest DOM usados pelos testes.
- Não configure chamadas reais para a Open-Meteo.
- Não crie mocks globais que escondam falhas reais dos testes.
- Preserve a configuração existente caso o arquivo já tenha conteúdo válido.

## Critérios de aceite

- `main.tsx` monta React sem erro no elemento `#root`.
- O bootstrap não realiza chamadas de rede.
- `src/styles/index.css` contém as diretivas Tailwind e é carregado pela entrada
  da aplicação.
- `tests/setup.ts` pode ser carregado pelo Vitest sem erro.
- A solução não cria dependências novas nem altera `package.json`.
- Não são implementados requisitos das tarefas T-02 em diante.
- O código segue TypeScript strict, Biome e as convenções do projeto.

## Validação

Execute, nesta ordem:

```bash
pnpm lint
pnpm build
pnpm exec vitest run --passWithNoTests
```

Se algum comando falhar por uma configuração existente fora dos três arquivos
permitidos, reporte o erro sem corrigir arquivos fora do escopo.

## Resultado esperado

Ao final, informe:

- Arquivos alterados.
- O que foi preparado em cada arquivo.
- Comandos executados e seus resultados.
- Qualquer bloqueio ou limitação encontrada.