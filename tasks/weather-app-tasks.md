# Tasks — Weather App

Backlog ordenado por dependência: tipos → funções puras → services → hook →
componentes → integração → testes → hardening → CI/deploy. Cada tarefa
representa uma unidade pequena, testável e rastreável à especificação e ao
plano técnico.

## Entrega 1 — Fundação e contratos

### T-01 — Preparar bootstrap, estilos e ambiente de testes

- **Descrição:** criar o bootstrap React, estilos globais Tailwind e a
  configuração mínima compartilhada para testes.
- **Critérios de aceite:** `main.tsx` monta a aplicação; estilos globais são
  carregados; o ambiente de testes inicia sem depender de dados externos.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/main.tsx`, `src/styles/index.css`, `tests/setup.ts`.
- **Tipo:** Infra

### T-02 — Definir contratos de domínio e estados

- **Descrição:** criar os tipos `Unit`, `City`, `CurrentWeather`,
  `ForecastDay`, `WeatherData`, `WeatherViewState` e `WeatherError`.
- **Critérios de aceite:** os tipos representam os campos da spec; temperaturas
  de domínio são Celsius; status possíveis são `idle`, `loading`, `success`,
  `empty` e `error`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Tipo:** Data

### T-03 — Implementar conversão de temperatura

- **Descrição:** criar funções puras para converter Celsius em Fahrenheit e
  arredondar o resultado conforme a spec.
- **Critérios de aceite:** `0 °C` resulta em `32 °F`; valores negativos e
  decimais são tratados; nenhuma função realiza acesso à rede ou ao DOM.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Tipo:** Data

### T-04 — Implementar validação e normalização da busca

- **Descrição:** normalizar espaços e validar input vazio, acentos, caracteres
  válidos e limite de 100 caracteres.
- **Critérios de aceite:** entradas vazias ou acima do limite são rejeitadas sem
  chamada de rede; espaços nas extremidades são removidos; acentos são
  preservados.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/validation.ts`.
- **Tipo:** Data

### T-05 — Implementar formatação regional

- **Descrição:** criar funções puras para datas, timezone e unidades em pt-BR.
- **Critérios de aceite:** datas respeitam o timezone da cidade; valores exibem
  `°C`, `°F`, `km/h`, `mm` e `%`; funções não dependem de React ou rede.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/format.ts`.
- **Tipo:** Data

### T-06 — Mapear códigos WMO para apresentação acessível

- **Descrição:** mapear códigos meteorológicos suportados para descrição em
  pt-BR e metadados acessíveis.
- **Critérios de aceite:** categorias previstas possuem descrição; código
  desconhecido retorna “Condição não disponível”; o mapeamento é puro.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Tipo:** Data

## Entrega 2 — Integração de dados

### T-07 — Criar adaptador de geocoding

- **Descrição:** encapsular o endpoint de geocoding da Open-Meteo e normalizar
  resultados válidos para `City`.
- **Critérios de aceite:** usa `name`, `count=10`, idioma português e JSON;
  descarta resultados sem nome, país, latitude ou longitude; retorna lista vazia
  quando não há resultados.
- **Dependências:** T-02, T-04.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-08 — Criar adaptador de forecast

- **Descrição:** consultar o forecast por latitude/longitude e mapear clima
  atual e cinco dias para os modelos internos.
- **Critérios de aceite:** envia `timezone=auto`, `forecast_days=5`, campos
  `current` e `daily` definidos; retorna exatamente cinco `ForecastDay` em
  ordem; mantém temperaturas em Celsius.
- **Dependências:** T-02, T-05, T-06, T-07.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

### T-09 — Implementar timeout e classificação de erros do service

- **Descrição:** mapear falhas de rede, HTTP/rate limit, timeout de 5 segundos,
  JSON inválido e campos obrigatórios ausentes para `WeatherError`.
- **Critérios de aceite:** nenhuma falha expõe detalhes técnicos; erros possuem
  código conhecido; campos opcionais ausentes resultam em “Indisponível”; retry
  pode reutilizar a consulta sem recarregar a página.
- **Dependências:** T-07, T-08.
- **Arquivos prováveis:** `src/services/weatherService.ts`, `src/types/weather.ts`.
- **Tipo:** Data

### T-10 — Implementar cache de sessão por localização

- **Descrição:** armazenar `WeatherData` em memória por latitude e longitude,
  sem `localStorage`, cookies ou servidor.
- **Critérios de aceite:** repetir a mesma localização não faz nova requisição;
  localizações diferentes não compartilham dados; o cache é perdido ao fechar a
  página.
- **Dependências:** T-08, T-09.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Tipo:** Data

## Entrega 3 — Orquestração e estados da aplicação

### T-11 — Implementar `useWeather`

- **Descrição:** coordenar query, busca, seleção, cache, retry e transições de
  estado `idle`, `loading`, `success`, `empty` e `error`.
- **Critérios de aceite:** input inválido não chama service; geocoding vazio
  produz `empty`; sucesso produz `success`; falha produz `error`; retry
  preserva dados anteriores; busca concorrente é bloqueada.
- **Dependências:** T-04, T-07, T-08, T-09, T-10.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Tipo:** Data

### T-12 — Criar `EmptyState`

- **Descrição:** apresentar o estado inicial e o estado de nenhum resultado em
  pt-BR.
- **Critérios de aceite:** o conteúdo orienta uma nova busca; o estado vazio não
  exibe previsão nem chama a rede.
- **Dependências:** T-02, T-11.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`.
- **Tipo:** UI

### T-13 — Criar `LoadingState`

- **Descrição:** apresentar o estado de carregamento da consulta.
- **Critérios de aceite:** o estado é identificável antes da resposta; não
  permite ações conflitantes; possui informação acessível.
- **Dependências:** T-02, T-11.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Tipo:** UI

### T-14 — Criar `ErrorState`

- **Descrição:** apresentar erro seguro em pt-BR e ação de retry.
- **Critérios de aceite:** não exibe detalhes técnicos; oferece nova tentativa;
  permite preservar a previsão anterior quando fornecida.
- **Dependências:** T-02, T-11.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Tipo:** UI

## Entrega 4 — UI de busca e apresentação

### T-15 — Criar `SearchBar` acessível

- **Descrição:** implementar campo, botão, submit por Enter, foco e estados
  disabled/loading.
- **Critérios de aceite:** botão e Enter iniciam busca; input vazio mostra
  validação sem rede; label é acessível; busca fica desabilitada durante loading.
- **Dependências:** T-04, T-11, T-13.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.

- **Tipo:** UI

### T-16 — Criar seleção de cidades

- **Descrição:** apresentar resultados de geocoding e permitir seleção por nome,
  região e país.
- **Critérios de aceite:** múltiplos resultados exigem seleção; resultado único
  segue seleção automática; cada opção é navegável por teclado.
- **Dependências:** T-02, T-11, T-15.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Tipo:** UI

### T-17 — Criar `UnitToggle` e apresentação derivada

- **Descrição:** criar controle de unidade e derivar Celsius/Fahrenheit na
  renderização sem alterar `WeatherData` ou chamar a rede.
- **Critérios de aceite:** inicia em Celsius; alterna todas as temperaturas;
  arredonda corretamente; não realiza nova requisição; é operável por teclado.
- **Dependências:** T-02, T-03, T-11.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI

### T-18 — Criar apresentação do clima atual

- **Descrição:** apresentar os campos do clima atual, unidades e condição WMO
  acessível.
- **Critérios de aceite:** temperatura, sensação, umidade, vento, precipitação e
  condição são exibidos; campo opcional ausente mostra “Indisponível”.
- **Dependências:** T-05, T-06, T-17.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Tipo:** UI

### T-19 — Criar lista e cards de previsão

- **Descrição:** apresentar os cinco dias em cards acessíveis e comparáveis.
- **Critérios de aceite:** são exibidos exatamente cinco cards; cada um mostra
  data, mínima, máxima e condição; códigos desconhecidos têm fallback textual.
- **Dependências:** T-05, T-06, T-17.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`,
  `src/components/ForecastCard.tsx`.
- **Tipo:** UI

### T-20 — Compor `App` e layout responsivo

- **Descrição:** integrar hook, busca, seleção, toggle, clima atual, previsão e
  estados em uma tela pt-BR responsiva.
- **Critérios de aceite:** fluxo idle/loading/empty/error/success é renderizado;
  não há rolagem horizontal nas viewports definidas; layout funciona em
  `375x667`, `768x1024` e `1440x900`.
- **Dependências:** T-12, T-13, T-14, T-15, T-16, T-17, T-18, T-19.
- **Arquivos prováveis:** `src/App.tsx`, `src/styles/index.css`.
- **Tipo:** UI

## Entrega 5 — Integração da aplicação

## Entrega 6 — Testes automatizados

### T-21 — Testar conversão de unidade com Vitest

- **Descrição:** implementar testes unitários para conversão Celsius/Fahrenheit.
- **Critérios de aceite:** `0 °C` resulta em `32 °F`; valores decimais,
  negativos e arredondamento são cobertos; os testes não usam DOM ou rede.
- **Dependências:** T-03.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Tipo:** Test

### T-22 — Testar validação, formatação e códigos WMO

- **Descrição:** implementar testes unitários para input, datas, unidades e
  códigos WMO.
- **Critérios de aceite:** vazio, espaços, acentos e limites de 100/101
  caracteres são cobertos; timezone, formatos pt-BR e fallback WMO passam.
- **Dependências:** T-04, T-05, T-06.
- **Arquivos prováveis:** `tests/unit/validation.test.ts`,
  `tests/unit/format.test.ts`,
  `tests/unit/weatherCodes.test.ts`.
- **Tipo:** Test

### T-23 — Cobrir services com mock de fetch

- **Descrição:** testar endpoints, mapeamento, validação, timeout, rede, HTTP,
  payload inválido e resposta parcial sem acessar a internet.
- **Critérios de aceite:** todos os códigos de erro são exercitados; geocoding
  vazio não chama forecast; forecast válido gera cinco dias; campos opcionais
  ausentes são tratados.
- **Dependências:** T-07, T-08, T-09, T-10.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`,
  `tests/unit/cache.test.ts`.
- **Tipo:** Test

### T-24 — Testar transições do `useWeather`

- **Descrição:** testar o hook e suas transições de estado com services
  controlados.
- **Critérios de aceite:** idle, loading, success, empty e error são cobertos;
  retry preserva dados anteriores e buscas concorrentes são bloqueadas.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Tipo:** Test

### T-25 — Testar componentes de busca e seleção

- **Descrição:** testar SearchBar e seleção de cidades.
- **Critérios de aceite:** botão/Enter, foco, input inválido, seleção múltipla e
  seleção automática são cobertos.
- **Dependências:** T-12, T-13, T-14, T-15, T-16.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`,
  `tests/unit/CityResults.test.tsx`.
- **Tipo:** Test

### T-26 — Testar componentes de estados

- **Descrição:** testar os componentes idle, loading, empty e error.
- **Critérios de aceite:** cada estado possui conteúdo identificável, erro não
  expõe detalhes técnicos, loading comunica o estado e retry é acionável.
- **Dependências:** T-12, T-13, T-14.
- **Arquivos prováveis:** `tests/unit/states.test.tsx`.
- **Tipo:** Test

### T-27 — Testar componentes meteorológicos e unidade

- **Descrição:** testar clima atual, previsão, cards e UnitToggle.
- **Critérios de aceite:** cinco dias, campos indisponíveis, códigos WMO,
  conversão e ausência de nova chamada são cobertos.
- **Dependências:** T-17, T-18, T-19.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`,
  `tests/unit/CurrentWeather.test.tsx`, `tests/unit/ForecastList.test.tsx`.
- **Tipo:** Test

### T-28 — Criar fluxos E2E com Playwright

- **Descrição:** validar o caminho integrado com interceptação determinística
  das APIs.
- **Critérios de aceite:** busca válida, cidade homônima, resultado único,
  vazio, erro, timeout, retry e alternância de unidade passam sem recarregar a
  página.
- **Dependências:** T-20, T-21, T-22, T-23, T-24, T-25, T-26, T-27.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test

### T-29 — Validar responsividade, acessibilidade e performance

- **Descrição:** executar E2E nas três viewports, verificar teclado/labels,
  ausência de overflow e medir a meta de 19 de 20 execuções até 3 segundos.
- **Critérios de aceite:** os fluxos principais passam em `375x667`, `768x1024`
  e `1440x900`; não há rolagem horizontal; a meta de performance é atendida em
  ambiente controlado.
- **Dependências:** T-28.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`,
  `playwright.config.ts`.
- **Tipo:** Test

## Entrega 7 — Hardening

### T-30 — Executar hardening funcional e não funcional

- **Descrição:** revisar a implementação contra a spec, edge cases, acessibilidade,
  responsividade, performance e tratamento de erros.
- **Critérios de aceite:** todos os ACs aplicáveis passam; input vazio, timeout,
  resposta parcial e retry são verificados; não há overflow nas três viewports;
  a meta de 19 de 20 execuções em até 3 segundos é registrada.
- **Dependências:** T-21, T-22, T-23, T-24, T-25, T-26, T-27, T-28, T-29.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`,
  `tasks/weather-app-tasks.md`, `tests/e2e/weather.spec.ts`.
- **Tipo:** Test

## Entrega 8 — CI e publicação

### T-31 — Automatizar gates de qualidade

- **Descrição:** configurar pipeline para lint, build, testes unitários e E2E.
- **Critérios de aceite:** o pipeline falha quando qualquer gate falha e passa
  em uma branch com a aplicação validada.
- **Dependências:** T-30.
- **Arquivos prováveis:** `.github/workflows/ci.yml`, `package.json`.
- **Tipo:** Infra

### T-32 — Configurar deploy no GitHub Pages

- **Descrição:** publicar o build estático no GitHub Pages após validação do CI.
- **Critérios de aceite:** o workflow gera o build, publica a aplicação e a URL
  pública carrega a busca e a previsão; nenhum segredo é exposto no cliente.
- **Dependências:** T-31.
- **Arquivos prováveis:** `.github/workflows/deploy-pages.yml`, `vite.config.ts`.
- **Tipo:** Infra

## Traceability Matrix

| Tarefa | Referência na spec | Verificação objetiva |
|---|---|---|
| T-01 | Tech Stack, NFR04 | O bootstrap monta a aplicação e o ambiente de teste inicia sem rede. |
| T-02 | Data Model, FR01–FR11 | TypeScript aceita os contratos e restringe `Unit` e `WeatherStatus` aos valores definidos. |
| T-03 | FR05, AC05 | Testes confirmam `0 °C = 32 °F`, arredondamento e valores negativos. |
| T-04 | FR01, AC01, AC12 | Testes confirmam rejeição de vazio, 101 caracteres e preservação de acentos. |
| T-05 | FR03, FR04, NFR06, AC03–AC04 | Testes confirmam formato pt-BR, timezone e unidades esperadas. |
| T-06 | FR03, FR04, AC03–AC04 | Cada código suportado retorna descrição; código desconhecido retorna fallback. |
| T-07 | FR01–FR02, AC01–AC02 | Testes confirmam parâmetros, normalização e descarte de cidades inválidas. |
| T-08 | FR03–FR04, AC03–AC04 | Testes confirmam parâmetros do forecast e exatamente cinco dias ordenados. |
| T-09 | FR09, AC09, AC12, NFR05 | Cada erro de rede, HTTP, timeout e payload inválido gera código e mensagem segura. |
| T-10 | FR11, AC11, NFR01, NFR07 | Segunda consulta da mesma localização não chama a rede; nova sessão não recupera cache. |
| T-11 | FR06–FR11, AC06–AC11 | Testes de hook percorrem todos os estados e bloqueiam busca concorrente. |
| T-12 | FR06, FR08, AC06, AC08 | Idle e empty exibem orientação ou ausência de resultado e permitem nova busca. |
| T-13 | FR07, AC07 | Loading aparece antes da resposta e bloqueia busca conflitante. |
| T-14 | FR09, AC09 | Erro não exibe detalhes técnicos e o controle de retry dispara nova tentativa. |
| T-15 | FR01, FR07, AC01, AC07, NFR02 | Botão e Enter submetem; input inválido mantém foco; controle desabilita em loading. |
| T-16 | FR02, AC02, NFR02–NFR03 | Resultados exibem contexto e podem ser selecionados por teclado. |
| T-17 | FR05, AC05, NFR01–NFR02 | Toggle altera todas as temperaturas sem modificar dados ou fazer request. |
| T-18 | FR03, AC03, NFR02, NFR06 | Campos atuais, unidades e descrição acessível são renderizados. |
| T-19 | FR04, AC04, NFR03, NFR06 | Exatamente cinco cards são renderizados com data, mínima, máxima e condição. |
| T-20 | FR01–FR11, AC01–AC11, NFR03 | App renderiza cada estado e não apresenta overflow nas três viewports. |
| T-21 | FR05, AC05 | Suite dedicada confirma fórmula, arredondamento e `0 °C = 32 °F` sem DOM ou rede. |
| T-22 | FR01, FR03–FR04, AC01, AC03–AC04, AC12, NFR06 | Suite confirma validação de input, timezone, unidades, formatos e fallback WMO. |
| T-23 | FR01–FR04, FR09, FR11, AC01–AC05, AC09, AC11 | Mocks confirmam requests, mapeamentos, erros, timeout, parcial e cache. |
| T-24 | FR06–FR11, AC06–AC11 | Hook passa por idle/loading/success/empty/error e preserva dados no retry. |
| T-25 | FR01–FR02, FR06–FR07, AC01–AC02, AC06–AC07 | Componentes de busca e seleção passam teclado, foco, múltiplos e resultado único. |
| T-26 | FR06–FR09, AC06–AC09 | Cada componente de estado tem mensagem, role/label e ação esperada. |
| T-27 | FR03–FR05, AC03–AC05 | Componentes meteorológicos passam cinco dias, indisponível, WMO e unidade. |
| T-28 | US01–US07, AC01–AC12 | Fluxos E2E cobrem caminho válido, vazio, seleção, erro, retry e toggle. |
| T-29 | NFR01–NFR04, AC12 | Três viewports passam sem overflow; 19 de 20 execuções ficam em até 3 segundos. |
| T-30 | AC01–AC12, NFR01–NFR05, Risks | Checklist final confirma critérios, edge cases, acessibilidade, performance e ausência de regressões. |
| T-31 | Tech Stack, NFR01–NFR05 | CI falha em qualquer gate e passa com lint, build, unitários e E2E verdes. |
| T-32 | Production Decisions, Out of Scope | Deploy Pages carrega a URL pública sem segredos expostos no cliente. |

## Functional Requirements Coverage

| Requisito funcional | Tarefas de implementação | Tarefas de teste/validação | Status |
|---|---|---|---|
| FR01 — Buscar cidades | T-04, T-07, T-11, T-15 | T-21, T-23, T-25, T-28 | Coberto |
| FR02 — Selecionar a cidade correta | T-07, T-11, T-16 | T-23, T-25, T-28 | Coberto |
| FR03 — Exibir clima atual | T-06, T-08, T-11, T-18 | T-22, T-23, T-27, T-28 | Coberto |
| FR04 — Exibir previsão diária de cinco dias | T-06, T-08, T-11, T-19 | T-22, T-23, T-27, T-28 | Coberto |
| FR05 — Alternar unidade de temperatura | T-03, T-17 | T-21, T-27, T-28 | Coberto |
| FR06 — Exibir estado inicial | T-11, T-12, T-20 | T-24, T-26, T-28 | Coberto |
| FR07 — Exibir estado de carregamento | T-11, T-13, T-15 | T-24, T-26, T-28 | Coberto |
| FR08 — Tratar busca sem resultado | T-07, T-11, T-12 | T-23, T-24, T-26, T-28 | Coberto |
| FR09 — Tratar falhas e permitir recuperação | T-09, T-11, T-14 | T-23, T-24, T-26, T-28, T-30 | Coberto |
| FR10 — Atualizar dados somente por busca | T-11, T-20 | T-24, T-28 | Coberto |
| FR11 — Reutilizar dados durante a sessão | T-10, T-11 | T-23, T-24, T-28 | Coberto |

### Requisitos sem tarefa correspondente

Nenhum requisito funcional da spec está sem tarefa de implementação e validação.

## Priority and Size

Legenda: **P0** bloqueia o caminho feliz ou a primeira entrega utilizável;
**P1** é necessário para completar a qualidade do MVP; **P2** é posterior ou
operacional. **S** cabe em uma unidade pequena, **M** envolve poucos arquivos
relacionados e **G** cruza camadas ou exige validação ampla.

| Tarefa | Prioridade | Tamanho | Justificativa curta |
|---|---|---|---|
| T-01 | P0 | M | Fundação do app e testes. |
| T-02 | P0 | S | Contratos bloqueiam todas as camadas. |
| T-03 | P0 | S | Regra de unidade usada pela UI. |
| T-04 | P0 | S | Validação necessária antes da rede. |
| T-05 | P0 | S | Formatação usada na apresentação. |
| T-06 | P0 | S | Condições WMO precisam de fallback. |
| T-07 | P0 | M | Primeiro adaptador externo. |
| T-08 | P0 | M | Dados necessários para clima visível. |
| T-09 | P1 | M | Resiliência além do caminho feliz. |
| T-10 | P1 | M | Otimização e regra de sessão. |
| T-11 | P0 | G | Orquestra todo o fluxo de dados. |
| T-12 | P1 | S | Estado vazio e orientação. |
| T-13 | P0 | S | Feedback obrigatório de loading. |
| T-14 | P1 | S | Erro e recuperação. |
| T-15 | P0 | M | Entrada principal do usuário. |
| T-16 | P0 | M | Resolve cidades homônimas. |
| T-17 | P0 | S | Controle de unidade. |
| T-18 | P0 | M | Exibe o clima atual. |
| T-19 | P0 | M | Exibe os cinco dias. |
| T-20 | P0 | G | Primeira composição visível completa. |
| T-21 | P0 | S | Protege conversão crítica. |
| T-22 | P1 | M | Protege validação e apresentação. |
| T-23 | P1 | G | Cobre o contrato externo e falhas. |
| T-24 | P1 | M | Protege a máquina de estados. |
| T-25 | P1 | M | Protege busca e seleção na UI. |
| T-26 | P1 | S | Protege loading, erro, vazio e idle. |
| T-27 | P1 | M | Protege apresentação meteorológica. |
| T-28 | P0 | G | Smoke E2E do produto utilizável. |
| T-29 | P1 | M | Valida mobile, acessibilidade e performance. |
| T-30 | P1 | G | Hardening contra regressões e edge cases. |
| T-31 | P1 | M | Gate automatizado antes de publicar. |
| T-32 | P1 | M | Entrega pública do MVP. |

## Vertical Delivery Slices

As fatias abaixo entregam valor visível progressivamente. Dentro de cada fatia,
as tarefas seguem as dependências do backlog.

### Fatia 1 — Caminho feliz visível

**Tarefas:** T-01, T-02, T-03, T-04, T-05, T-06, T-07, T-08, T-11, T-12,
T-13, T-15, T-16, T-17, T-18, T-19, T-20.

**Resultado visível:** usuário busca uma cidade, seleciona o local quando
necessário, vê clima atual e cinco dias vindos da Open-Meteo, recebe feedback de
loading e pode alternar a unidade.

### Fatia 2 — Estados e recuperação

**Tarefas:** T-09, T-10, T-14, T-24, T-25, T-26, T-27, T-28.

**Resultado visível:** cidade inexistente, timeout, erro de API, resposta
parcial, retry e reuso durante a sessão têm comportamento completo e testado.

### Fatia 3 — Qualidade de produto

**Tarefas:** T-21, T-22, T-23, T-29, T-30.

**Resultado visível:** conversão, contrato externo, acessibilidade,
responsividade, performance e edge cases estão protegidos por testes.

### Fatia 4 — Entrega repetível

**Tarefas:** T-31, T-32.

**Resultado visível:** o projeto passa pelos gates automatizados e fica publicado
no GitHub Pages.
