# Especificação de Produto — Weather App

## Overview

### Visão geral

O Weather App é uma aplicação web em pt-BR para consulta rápida de condições
meteorológicas por cidade. O usuário informa uma cidade, seleciona o local
correto quando necessário e visualiza o clima atual e a previsão diária de cinco
dias: hoje e os quatro dias seguintes.

A aplicação utilizará a Open-Meteo como fonte de geocoding e previsão, não
exigirá autenticação e não persistirá dados entre sessões no MVP.

### Objetivos

- Permitir que o usuário encontre uma cidade e consulte sua previsão em até 30
  segundos.
- Exibir clima atual e previsão diária de forma clara e comparável.
- Permitir alternância entre Celsius e Fahrenheit sem nova consulta.
- Oferecer uma experiência acessível e responsiva em mobile, tablet e desktop.
- Tratar falhas de rede, timeout, respostas inválidas e ausência de resultados
  sem quebrar a experiência.

### Público e contexto

- Usuários que precisam consultar o clima rapidamente em dispositivos móveis.
- Usuários que planejam atividades e comparam a previsão em desktop ou tablet.
- Usuários que consultam cidades internacionais e alternam entre Celsius e
  Fahrenheit.

## Functional Requirements

### FR01 — Buscar cidades

O usuário deve poder informar o nome de uma cidade e iniciar a busca pelo botão
ou pela tecla Enter. O sistema deve identificar cada local com nome, estado ou
região, país, latitude e longitude para seleção e consulta precisas. O valor
informado deve ser normalizado removendo espaços no início e no fim.

### FR02 — Selecionar a cidade correta

Quando a busca retornar mais de uma cidade compatível, o usuário deve poder
selecionar explicitamente o local desejado antes de visualizar a previsão.
Quando houver apenas uma correspondência válida, o sistema deve selecioná-la
automaticamente.

### FR03 — Exibir clima atual

Após a seleção de uma cidade, o sistema deve exibir temperatura, sensação
térmica, umidade, velocidade do vento, precipitação e condição climática. A
condição deve possuir descrição textual em pt-BR e uma representação visual com
nome acessível.

### FR04 — Exibir previsão diária de cinco dias

O sistema deve exibir cinco dias, compostos pelo dia atual e pelos quatro dias
seguintes. Cada dia deve apresentar data, temperatura mínima, temperatura máxima
e condição climática. O MVP não inclui previsão horária.

### FR05 — Alternar unidade de temperatura

O usuário deve poder alternar entre Celsius e Fahrenheit. A unidade inicial deve
ser Celsius. A conversão deve ocorrer sobre os dados já carregados e arredondar
o resultado para o inteiro mais próximo. A fórmula de conversão é
`F = (C × 9/5) + 32`.

### FR06 — Exibir estado inicial

Antes da primeira busca, o sistema deve orientar o usuário a informar uma
cidade e não deve realizar uma consulta automática ou solicitar geolocalização.

### FR07 — Exibir estado de carregamento

Após o início de uma busca, o sistema deve exibir o estado de carregamento antes
da resposta da consulta e impedir ações conflitantes enquanto a consulta estiver
sendo processada.

### FR08 — Tratar busca sem resultado

Quando nenhuma cidade compatível for encontrada, o sistema deve informar o fato
em pt-BR e permitir que o usuário faça uma nova busca.

### FR09 — Tratar falhas e permitir recuperação

Em caso de timeout, erro HTTP, resposta inválida ou indisponibilidade da fonte,
o sistema deve sair do estado de carregamento, exibir uma mensagem clara em
pt-BR e oferecer nova tentativa. Uma consulta deve atingir timeout após 5
segundos sem resposta. Se houver uma previsão válida anterior, ela deve ser
preservada enquanto o erro for apresentado. Mensagens não devem expor detalhes
técnicos da API.

### FR10 — Atualizar dados somente por busca

O sistema deve consultar dados quando o usuário realizar uma busca ou uma nova
tentativa. Não deve atualizar automaticamente os dados no MVP.

### FR11 — Reutilizar dados durante a sessão

Para a mesma localização consultada durante a sessão, o sistema deve reutilizar
os dados já obtidos sem realizar nova consulta. Não deve haver persistência após
o fechamento da página.

## Product Rules and Data Contract

### Entrada de busca

- Após remover espaços nas extremidades, a consulta deve conter entre 1 e 100
  caracteres.
- Consultas vazias ou acima de 100 caracteres não devem chamar a API.
- A busca deve preservar acentos e aceitar caracteres válidos de nomes de
  cidades.

### Resultado de geocoding

- `name`, `country`, `latitude` e `longitude` são obrigatórios para uma cidade
  selecionável.
- `admin1` ou região deve ser exibido quando fornecido pela fonte.
- Resultado sem algum campo obrigatório deve ser descartado e não pode gerar
  chamada de previsão.

### Dados meteorológicos

- Para considerar a consulta bem-sucedida, a resposta deve conter temperatura
  atual, código da condição atual e cinco datas diárias com mínima, máxima e
  código de condição.
- Sensação térmica, umidade, vento e precipitação são campos esperados, mas, se
  ausentes individualmente, devem ser exibidos como “Indisponível”.
- Código meteorológico desconhecido deve ser exibido como “Condição não
  disponível”, sem impedir a exibição dos demais dados válidos.

### Erros

O produto deve distinguir os estados de validação de entrada, nenhum resultado,
erro de rede ou HTTP, timeout e resposta inválida. Todos devem apresentar uma
mensagem em pt-BR e manter o usuário em um estado recuperável.

## User Stories

### US01 — Consulta rápida em mobile

Como Marina, uma viajante em deslocamento, quero buscar uma cidade e visualizar
o clima atual para decidir o que levar e como me preparar.

**Requisitos relacionados:** FR01, FR03, FR04 e FR07.

### US02 — Planejamento de atividade

Como Carlos, um planejador de atividades, quero consultar a previsão diária de
cinco dias para escolher a melhor data para uma atividade externa.

**Requisitos relacionados:** FR04 e FR10.

### US03 — Uso de unidades diferentes

Como Ana, uma usuária que consulta cidades internacionais, quero alternar entre
Celsius e Fahrenheit para interpretar a temperatura na unidade que conheço.

**Requisito relacionado:** FR05.

### US04 — Seleção de cidade correta

Como Ana, uma usuária que consulta cidades internacionais, quero ver país e
região nos resultados para selecionar a cidade correta antes de consultar a
previsão.

**Requisito relacionado:** FR02.

### US05 — Recuperação de falha

Como Marina, uma viajante em deslocamento, quero receber uma mensagem clara e
tentar novamente quando a consulta falhar para obter a previsão sem recarregar
a página.

**Requisitos relacionados:** FR08 e FR09.

### US06 — Estado inicial orientado

Como Carlos, um planejador de atividades, quero receber orientação antes da
primeira busca para saber como iniciar uma consulta.

**Requisito relacionado:** FR06.

### US07 — Reuso durante a sessão

Como Ana, uma usuária que consulta cidades internacionais, quero consultar
novamente uma cidade já pesquisada sem uma requisição desnecessária para obter
o resultado com mais rapidez.

**Requisito relacionado:** FR11.

## Acceptance Criteria

Cada requisito funcional possui critérios verificáveis no formato
Given/When/Then.

### AC01 — FR01: Buscar cidades

- **Given** que o campo contém apenas espaços ou mais de 100 caracteres, **When**
  o usuário tenta buscar, **Then** o sistema exibe validação em pt-BR e não
  realiza chamada à API.
- **Given** que o estado inicial está sendo exibido e o campo contém um nome de
  cidade válido, **When** o usuário clica no botão de busca, **Then** o sistema
  inicia uma consulta de cidades e apresenta resultados ou o estado de nenhum
  resultado.
- **Given** que o campo contém um nome de cidade válido, **When** o usuário
  pressiona Enter no campo, **Then** o sistema inicia uma consulta de cidades.

### AC02 — FR02: Selecionar a cidade correta

- **Given** que a busca retornou duas ou mais cidades, **When** os resultados são
  exibidos, **Then** cada resultado apresenta nome, região ou estado e país.
- **Given** que existem duas cidades com o mesmo nome, **When** o usuário
  seleciona um resultado, **Then** a previsão consultada corresponde à latitude
  e longitude daquele resultado.
- **Given** que a busca retornou uma única cidade válida, **When** os resultados
  são processados, **Then** o sistema seleciona essa cidade sem exigir uma
  segunda ação do usuário.

### AC03 — FR03: Exibir clima atual

- **Given** que uma cidade válida foi selecionada, **When** a consulta é
  concluída com sucesso, **Then** o sistema exibe temperatura, sensação térmica,
  umidade, velocidade do vento, precipitação e condição climática.
- **Given** que a condição climática está sendo exibida, **When** o usuário
  navega até a informação, **Then** existe uma descrição textual em pt-BR e o
  nome acessível da representação visual está disponível para tecnologia
  assistiva.

### AC04 — FR04: Exibir previsão diária de cinco dias

- **Given** que uma cidade válida foi selecionada, **When** a previsão é
  carregada, **Then** o sistema exibe exatamente cinco itens diários.
- **Given** que os cinco itens estão visíveis, **When** o usuário os consulta,
  **Then** o primeiro representa a data atual no fuso da cidade, os quatro
  seguintes representam os dias posteriores e cada item contém data,
  temperatura mínima, máxima e condição climática.

### AC05 — FR05: Alternar unidade de temperatura

- **Given** que uma consulta foi concluída com sucesso, **When** a tela é
  exibida pela primeira vez, **Then** as temperaturas aparecem em Celsius.
- **Given** que as temperaturas estão visíveis, **When** o usuário seleciona
  Fahrenheit, **Then** todas as temperaturas visíveis são convertidas,
  arredondadas para o inteiro mais próximo e permanecem na tela.
- **Given** que uma temperatura de 0 °C está visível, **When** o usuário
  seleciona Fahrenheit, **Then** o valor correspondente exibido é 32 °F.
- **Given** que os dados meteorológicos já foram carregados, **When** o usuário
  alterna a unidade, **Then** nenhuma nova requisição de rede é realizada.

### AC06 — FR06: Exibir estado inicial

- **Given** que a aplicação foi aberta sem consulta anterior na sessão, **When**
  a tela inicial é exibida, **Then** o sistema orienta o usuário a informar uma
  cidade.
- **Given** que a aplicação está no estado inicial, **When** nenhuma ação de
  busca foi realizada, **Then** o sistema não solicita geolocalização nem
  consulta uma cidade automaticamente.

### AC07 — FR07: Exibir estado de carregamento

- **Given** que o usuário iniciou uma busca, **When** a consulta ainda não foi
  concluída e a resposta ainda não foi recebida, **Then** uma indicação de
  carregamento é exibida antes de qualquer resultado da consulta.
- **Given** que uma busca está em andamento, **When** o usuário tenta iniciar
  uma consulta conflitante, **Then** o controle de busca permanece desabilitado
  até a consulta terminar.

### AC08 — FR08: Tratar busca sem resultado

- **Given** que o usuário realizou uma busca sem correspondências, **When** a
  consulta é concluída, **Then** o sistema informa em pt-BR que nenhuma cidade
  foi encontrada.
- **Given** que o estado de nenhum resultado está visível, **When** o usuário
  altera a consulta e inicia nova busca, **Then** o sistema aceita a nova
  consulta.

### AC09 — FR09: Tratar falhas e permitir recuperação

- **Given** que uma consulta sofreu timeout, erro HTTP ou resposta inválida,
  **When** o erro é identificado, **Then** o loading é encerrado e uma mensagem
  clara em pt-BR é exibida.
- **Given** que a resposta contém campos obrigatórios ausentes, **When** o
  payload é validado, **Then** o sistema trata a resposta como inválida e não
  exibe uma previsão incompleta como se fosse válida.
- **Given** que a resposta contém apenas um campo opcional ausente, **When** o
  payload é validado, **Then** os demais dados são exibidos e o campo ausente é
  marcado como indisponível.
- **Given** que uma consulta falhou, **When** o usuário seleciona tentar
  novamente, **Then** uma nova consulta é iniciada sem recarregar a página.
- **Given** que existe uma previsão válida anterior, **When** uma nova consulta
  falha, **Then** a previsão anterior permanece disponível enquanto o erro é
  apresentado.
- **Given** que uma consulta falhou, **When** a mensagem de erro é exibida,
  **Then** ela não contém URL, stack trace, código interno ou outro detalhe
  técnico da API.

### AC10 — FR10: Atualizar dados somente por busca

- **Given** que o usuário realizou uma busca válida, **When** não inicia uma
  nova busca ou tentativa, **Then** o sistema não realiza atualização automática
  dos dados.
- **Given** que o usuário inicia uma nova busca ou tentativa, **When** a ação é
  processada, **Then** o sistema realiza uma consulta para obter os dados
  correspondentes.

### AC11 — FR11: Reutilizar dados durante a sessão

- **Given** que uma localização já foi consultada com sucesso na sessão, **When**
  o usuário consulta novamente a mesma latitude e longitude, **Then** o sistema
  exibe os dados disponíveis sem realizar uma nova requisição de rede.
- **Given** que a página foi fechada e aberta novamente, **When** o usuário
  acessa a aplicação, **Then** o sistema exibe o estado inicial em Celsius e não
  recupera a consulta, a unidade ou qualquer outro dado da sessão anterior.

### AC12 — Regras de edge cases

- **Given** que o campo de busca está vazio ou contém apenas espaços, **When** o
  usuário tenta buscar, **Then** o foco permanece no campo, uma validação em
  pt-BR é exibida e nenhuma chamada é realizada.
- **Given** que o geocoding não encontrou correspondências, **When** a resposta
  chega, **Then** o sistema exibe o estado de nenhum resultado e não chama a
  previsão meteorológica.
- **Given** que a API excedeu o timeout configurado, **When** a consulta é
  encerrada após 5 segundos sem resposta, **Then** o sistema mostra a mensagem
  de timeout, sai do loading e oferece nova tentativa.
- **Given** que a resposta contém um campo opcional ausente, **When** os dados
  são exibidos, **Then** o campo correspondente aparece como “Indisponível” e
  os demais valores válidos permanecem visíveis.

## Traceability Matrix

| User Story | Acceptance Criteria | Requisitos não funcionais relevantes |
|---|---|---|
| US01 — Consulta rápida em mobile | AC01, AC03, AC04, AC07 | NFR01 Performance, NFR02 Acessibilidade, NFR03 Responsividade, NFR04 Compatibilidade, NFR06 Localização |
| US02 — Planejamento de atividade | AC04, AC10 | NFR01 Performance, NFR02 Acessibilidade, NFR03 Responsividade, NFR06 Localização |
| US03 — Uso de unidades diferentes | AC05 | NFR01 Performance, NFR02 Acessibilidade, NFR06 Localização |
| US04 — Seleção de cidade correta | AC02 | NFR02 Acessibilidade, NFR03 Responsividade, NFR04 Compatibilidade, NFR06 Localização |
| US05 — Recuperação de falha | AC08, AC09, AC12 | NFR02 Acessibilidade, NFR05 Confiabilidade e resiliência, NFR06 Localização |
| US06 — Estado inicial orientado | AC06 | NFR02 Acessibilidade, NFR03 Responsividade, NFR06 Localização, NFR07 Privacidade e dados |
| US07 — Reuso durante a sessão | AC11 | NFR01 Performance, NFR05 Confiabilidade e resiliência, NFR07 Privacidade e dados, NFR08 Manutenibilidade do contrato externo |

### Cobertura transversal

Os cenários de AC12 devem ser exercitados sempre que aplicáveis às stories:

- **Input vazio e caracteres especiais:** US01, US04 e US05.
- **Cidade inexistente e geocoding sem resultados:** US01, US04 e US05.
- **Falha de API, timeout e resposta parcial:** US01, US02 e US05.
- **Mudança de unidade durante carregamento:** US03 e US05.
- **Viewport estreita e navegação assistiva:** todas as stories.

## Non-Functional Requirements

### NFR01 — Performance

- O estado de carregamento deve ser renderizado antes de qualquer resposta
  assíncrona da busca.
- Em um teste controlado no qual a API responde em até 1 segundo, pelo menos
  95% das buscas devem exibir o resultado em até 3 segundos após o envio.
- A troca de unidade não deve gerar nova requisição de rede.

### NFR02 — Acessibilidade

- Todos os controles devem ser operáveis por teclado, com ordem de foco lógica e
  indicador de foco visível.
- Resultados, carregamento, erros e mudanças de estado devem ser compreensíveis
  para leitores de tela.
- Ícones meteorológicos devem ter texto alternativo ou descrição acessível.
- A interface deve atender ao nível WCAG 2.2 AA para contraste e interação,
  salvo impossibilidade documentada.

### NFR03 — Responsividade

- A interface deve funcionar em mobile, tablet e desktop sem sobreposição,
  perda de conteúdo essencial ou rolagem horizontal indevida.
- Os fluxos principais devem funcionar nas viewports de referência 375x667,
  768x1024 e 1440x900.

### NFR04 — Compatibilidade

- O produto deve funcionar na versão estável mais recente de Chrome, Edge,
  Firefox e Safari disponível no momento de cada release.

### NFR05 — Confiabilidade e resiliência

- Erros HTTP, timeout, payload inválido e campos obrigatórios ausentes não devem
  quebrar a aplicação.
- Uma falha deve sair do loading, apresentar mensagem clara e permitir nova
  tentativa.
- O último resultado válido deve permanecer visível durante uma falha posterior.

### NFR06 — Localização

- Todos os textos da interface e mensagens de erro devem estar em pt-BR.
- Datas devem seguir o formato brasileiro e o fuso horário da cidade consultada.
- A unidade inicial deve ser Celsius.

### NFR07 — Privacidade e dados

- Não deve haver autenticação, coleta obrigatória de dados pessoais ou
  persistência de dados em servidor no MVP.
- A aplicação não deve solicitar geolocalização automática.

### NFR08 — Manutenibilidade do contrato externo

- A integração com a Open-Meteo deve ser tratada como uma dependência externa e
  seus dados devem ser validados antes da apresentação.
- A solução deve preservar a separação entre regras do produto e o formato da
  fonte externa.

## Edge Cases

### Campo de busca vazio

Quando o campo estiver vazio ou contiver apenas espaços, o sistema não deve
realizar chamada à API. Deve exibir uma validação em pt-BR, manter o foco no
campo e permitir nova entrada.

### Cidade inexistente

Quando o nome informado não corresponder a uma cidade, o sistema deve informar
que nenhuma cidade foi encontrada, manter a busca disponível e permitir nova
tentativa sem quebrar a tela.

### Caracteres especiais

O sistema deve aceitar acentos e caracteres válidos de nomes de cidades,
normalizar espaços excedentes e tratar entradas inválidas sem exibir erro
técnico ao usuário.

### Falha de API

Quando ocorrer erro de rede, erro HTTP, rate limit ou indisponibilidade da API,
o sistema deve encerrar o loading, exibir mensagem clara em pt-BR e oferecer
nova tentativa. A última previsão válida deve ser preservada quando existir.

### Timeout

Quando a consulta exceder o limite definido, o sistema deve encerrá-la, informar
que a resposta demorou e permitir nova tentativa sem recarregar a página.

### Geocoding sem resultados

Quando o geocoding não retornar resultados, o sistema não deve chamar o serviço
de previsão. Deve informar que nenhuma cidade correspondente foi encontrada e
permitir que o usuário altere a busca.

### Resposta parcial

Quando a API retornar dados incompletos, o sistema deve validar os campos
obrigatórios, exibir os dados disponíveis quando isso for seguro, indicar as
informações indisponíveis e evitar valores incorretos ou uma interface quebrada.

- Várias cidades com o mesmo nome em regiões ou países diferentes.
- Resultado de geocoding sem país, região, latitude ou longitude válidos.
- Código meteorológico desconhecido ou sem descrição disponível.
- Temperaturas negativas, valores extremos ou valores nulos.
- Precipitação igual a zero ou ausente na resposta.
- Mudança de unidade durante ou imediatamente após o carregamento.
- Nova busca iniciada após uma busca anterior bem-sucedida.
- Cidade localizada em outro fuso horário ou mudança de data entre UTC e hora
  local.
- Viewport estreita, zoom do navegador ou texto ampliado por acessibilidade.
- Usuário navegando exclusivamente por teclado ou leitor de tela.

## Assumptions

- A Open-Meteo fornecerá geocoding e dados diários suficientes para clima atual
  e cinco dias, sem exigir API key.
- A previsão de cinco dias significa hoje mais os quatro dias seguintes.
- A Open-Meteo fornecerá o fuso horário da localização consultada.
- A unidade padrão será Celsius e a conversão para Fahrenheit será local.
- A conversão usará arredondamento para o inteiro mais próximo.
- A interface será exclusivamente pt-BR no MVP.
- Uma cidade será selecionada por vez.
- O estado inicial será vazio e não haverá geolocalização automática.
- O usuário não precisará criar uma conta.
- Não haverá persistência local ou em servidor após o encerramento da sessão.
- O cache durante a sessão será usado para reduzir consultas repetidas da mesma
  latitude e longitude.
- “Condições normais de rede” para o objetivo de 3 segundos será definido e
  medido no plano de testes.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Open-Meteo indisponível ou lenta | Média | Consultas falham ou excedem a meta de resposta. | Timeout, mensagem clara, retry manual e preservação do último resultado válido. |
| Payload externo inválido ou incompleto | Média | Dados incorretos ou tela quebrada. | Validar respostas e tratar campos ausentes antes da apresentação. |
| Cidades homônimas | Alta | Previsão do local errado. | Exibir região e país e exigir seleção explícita quando houver múltiplos resultados. |
| Conversão de temperatura incorreta | Baixa | Informação meteorológica errada. | Regra única de conversão, arredondamento definido e testes de casos-limite. |
| Limite de requisições | Média | Consultas bloqueadas ou degradadas. | Evitar requisições na troca de unidade e reutilizar dados durante a sessão. |
| Falhas de acessibilidade ou responsividade | Média | Exclusão de usuários e dificuldade de uso em mobile. | Critérios de teclado, leitor de tela, contraste e viewport incluídos nos testes. |
| Escopo crescer durante o MVP | Alta | Atraso e retrabalho. | Manter o fora do escopo explícito e exigir decisão para qualquer mudança. |
| Mudança de contrato ou política da fonte | Baixa | Integração deixa de funcionar. | Isolar a dependência externa, validar o contrato e acompanhar a documentação da fonte. |

## Out of Scope

- Autenticação, contas e perfis de usuário.
- Persistência local ou em servidor de preferências, histórico e favoritos.
- Geolocalização automática.
- Sugestões de busca durante a digitação.
- Previsão horária.
- Alertas meteorológicos, notificações e atualizações automáticas.
- Internacionalização além de pt-BR.
- Compartilhamento por URL e SEO específico para previsões.
- Funcionamento offline.
- Mapas, radar, camadas geográficas ou visualização de múltiplas cidades
  simultâneas.
- Administração de cidades, edição manual de dados ou exportação de previsões.
- Analytics de produto, personalização e recomendações.

## Production Decisions

### Open-Meteo contract

- Geocoding: `geocoding-api.open-meteo.com/v1/search`, com nome da cidade,
  limite de até 10 resultados, idioma pt-BR e formato JSON.
- Forecast: `api.open-meteo.com/v1/forecast`, usando latitude, longitude,
  `timezone=auto` e `forecast_days=5`.
- Dados atuais: temperatura, sensação térmica, umidade relativa, velocidade do
  vento, precipitação e código meteorológico.
- Dados diários: data, temperatura mínima, temperatura máxima e código
  meteorológico.

**Decisão:** esses são os únicos dados externos necessários para o MVP; os
demais campos retornados pela API serão ignorados.

### Weather code mapping

Os códigos WMO retornados pela Open-Meteo serão convertidos para descrições em
pt-BR e nomes acessíveis. O MVP usará as categorias: céu limpo, parcialmente
nublado, nublado, neblina, chuva, chuva forte, neve, tempestade e condição não
disponível. Um código não reconhecido usará a última categoria.

**Decisão:** a descrição textual será obrigatória; o ícone é complementar e
nunca será a única representação da condição.

### Display units

- Temperatura: Celsius por padrão ou Fahrenheit após conversão local.
- Velocidade do vento: km/h.
- Precipitação: mm.
- Umidade relativa: percentual (%).
- Datas: formato brasileiro `dd/MM` para previsão e data completa localizada
  quando necessário.

**Decisão:** todas as unidades serão exibidas explicitamente junto ao valor,
evitando depender de contexto ou preferência regional.

### Attribution and legal text

A aplicação exibirá no rodapé um link visível para a Open-Meteo com o texto
“Dados meteorológicos por Open-Meteo”. A publicação deverá respeitar os termos
de uso e as exigências de atribuição vigentes da Open-Meteo e de suas fontes de
dados.

**Decisão:** não serão exibidos dados sem atribuição. Qualquer mudança de uso
comercial ou de termos deverá ser reavaliada antes do deploy.

### Release and runtime operations

O MVP será publicado no GitHub Pages por GitHub Actions. A URL pública será a
URL de Pages do repositório. Não haverá backend próprio nem monitoramento de
runtime no MVP; falhas serão tratadas na interface e a saúde do produto será
verificada pelo pipeline de build, lint e testes.

**Decisão:** a entrega é estática, sem armazenamento de segredos no cliente e
sem coleta de telemetria de usuários.

### Performance measurement

A meta de performance será validada com 20 execuções por viewport de referência
em ambiente controlado, com a resposta da API disponível em até 1 segundo. Pelo
menos 19 de 20 execuções em cada viewport devem exibir o resultado em até 3
segundos após o envio da busca.

**Decisão:** a amostra mínima é 20 execuções por viewport; falhas de
disponibilidade externa não serão contabilizadas como tempo de processamento da
interface, mas deverão ser testadas separadamente nos cenários de erro.

## Open Questions

Nenhuma pergunta de produto ou de entrega permanece aberta para o MVP. As
decisões acima devem ser tratadas como fonte de verdade no plano técnico e nos
testes. Qualquer alteração posterior deve ser registrada como mudança de
escopo.
