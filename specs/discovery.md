# Discovery — Weather App

## Contexto

A empresa deseja disponibilizar uma aplicação web de previsão do tempo para que
usuários consultem as condições meteorológicas de diferentes cidades de forma
simples e acessível.

O escopo inicial inclui busca de cidades, visualização do clima atual, previsão
para cinco dias, alternância entre Celsius e Fahrenheit e uso em dispositivos
móveis.

## Requisitos Funcionais

### RF01 — Buscar cidades

O usuário deve poder informar o nome de uma cidade e iniciar uma consulta por
botão ou pela tecla Enter. A busca deve retornar cidades com nome, estado ou
região, país, latitude e longitude para permitir a seleção correta.

### RF02 — Exibir o clima atual

Após uma busca válida, o sistema deve exibir o clima atual da cidade selecionada,
incluindo temperatura, sensação térmica, umidade, velocidade do vento,
precipitação e condição climática com texto e ícone acessível.

### RF03 — Exibir previsão de cinco dias

O sistema deve exibir o dia atual e os quatro dias seguintes, totalizando cinco
dias. Para cada dia, deve apresentar data, temperatura mínima e máxima e
condição climática. A previsão será diária, sem previsão horária no MVP.

### RF04 — Alternar unidade de temperatura

O usuário deve poder alternar a exibição da temperatura entre Celsius e
Fahrenheit. A conversão deve ser feita localmente, com arredondamento para o
inteiro mais próximo, sem nova requisição.

### RF05 — Informar estados da consulta

O sistema deve informar ao usuário quando a consulta estiver carregando, quando
nenhuma cidade for encontrada e quando ocorrer um erro.

### RF06 — Exibir estado inicial

Antes de uma busca, o sistema deve apresentar uma orientação para que o usuário
informe uma cidade.

## Requisitos Não-Funcionais

### RNF01 — Responsividade

A aplicação deve funcionar adequadamente em dispositivos móveis, tablets e
desktops.

### RNF02 — Usabilidade

A interface deve permitir que o usuário encontre uma cidade e compreenda as
informações meteorológicas com pouco esforço.

### RNF03 — Acessibilidade

A aplicação deve oferecer controles navegáveis por teclado, labels semânticos,
mensagens compreensíveis e contraste suficiente para leitura.

### RNF04 — Desempenho

O sistema deve iniciar o feedback de carregamento imediatamente e apresentar o
resultado em até 3 segundos em condições normais de rede e disponibilidade da
API. A troca de unidade não deve gerar nova requisição.

### RNF05 — Confiabilidade

Falhas de rede, respostas inválidas e cidades inexistentes devem ser tratadas
sem interromper ou quebrar a aplicação.

### RNF06 — Compatibilidade

A aplicação deve funcionar nas versões atuais de Chrome, Edge, Firefox e
Safari, em dispositivos móveis, tablets e desktops.

## Requisitos Não-Funcionais Detalhados

Os requisitos adicionais de performance, acessibilidade, responsividade e
disponibilidade estão detalhados em [Requisitos Não Funcionais](non-functional-requirements.md).

## Riscos

- A fonte de dados meteorológicos pode ficar indisponível, lenta ou retornar
	informações inválidas.
- O nome informado pode ser ambíguo e corresponder a mais de uma cidade.
- Cidades com o mesmo nome podem exigir informações adicionais, como país ou
	estado, para desambiguar o resultado.
- A API pode não encontrar resultados para grafias incompletas ou alternativas.
- Dados ausentes podem impedir a exibição completa da previsão de cinco dias.
- Uma conversão incorreta pode apresentar temperaturas erradas em Fahrenheit.
- A interface pode ficar difícil de usar ou ler em telas pequenas.
- Consultas repetidas podem causar lentidão ou atingir limites do serviço
	externo.

## Suposições

- A aplicação será uma interface web responsiva.
- Os dados serão obtidos de um serviço externo de previsão do tempo.
- A busca inicial será feita pelo nome da cidade.
- A primeira versão exibirá uma cidade por vez.
- A API fornecerá dados suficientes para o clima atual e uma previsão de cinco
	dias.
- A conversão entre Celsius e Fahrenheit será feita localmente a partir dos
	dados carregados, arredondando o resultado para o inteiro mais próximo.
- Alternar a unidade não deverá exigir uma nova consulta à API.
- O usuário não precisará criar uma conta para consultar o clima.
- A preferência de unidade será mantida apenas durante a sessão; não haverá
	persistência local ou em servidor no MVP.
- A localização automática do usuário não será obrigatória para a primeira
	versão.

## Decisões

### Fonte de dados: Open-Meteo

O app utilizará a Open-Meteo para geocoding e previsão do tempo, sem exigir uma
API key.

**Justificativa:** a API atende ao escopo inicial e reduz o atrito de
configuração, distribuição e desenvolvimento local.

**Perguntas resolvidas:** qual serviço fornecerá os dados meteorológicos e se a
integração exigirá autenticação ou chave de API.

### Período de previsão: hoje + quatro dias

Os "5 dias" serão interpretados como o dia atual mais os quatro dias seguintes.

**Justificativa:** elimina a ambiguidade sobre incluir ou não o dia atual e
define um critério objetivo para a interface e os testes.

**Pergunta resolvida:** se a previsão de cinco dias inclui o dia atual.

### Unidade padrão: Celsius

As temperaturas serão exibidas inicialmente em Celsius, com possibilidade de
alternância para Fahrenheit.

**Justificativa:** Celsius é a unidade padrão adequada ao público e ao idioma
pt-BR definidos para a primeira versão.

**Perguntas resolvidas:** qual unidade deve ser usada por padrão e qual público
deve orientar a experiência inicial de unidades.

### Autenticação e persistência: não aplicáveis ao MVP

O app não terá autenticação de usuários nem persistência de dados em servidor.

**Justificativa:** mantém o MVP simples, reduz dependências de infraestrutura e
permite consultar o clima sem criar uma conta.

**Perguntas resolvidas:** se será necessário login e se dados de usuário,
histórico ou preferências serão persistidos no servidor.

### Idioma da interface: pt-BR

Todos os textos da interface serão apresentados em português do Brasil.

**Justificativa:** define o público linguístico inicial e permite padronizar
mensagens, formatos de data e comunicação de erros.

**Perguntas resolvidas:** se haverá internacionalização na primeira versão e
qual idioma e formato regional devem ser usados.

### Busca e cidades homônimas

A busca será iniciada pelo botão ou pela tecla Enter. Não haverá sugestões
automáticas durante a digitação no MVP. Quando houver cidades homônimas, o
usuário deverá selecionar o resultado identificado por cidade, estado ou região
e país. A cidade selecionada será representada internamente por latitude e
longitude.

**Justificativa:** reduz chamadas desnecessárias à API e evita exibir a previsão
de uma cidade incorreta.

**Perguntas resolvidas:** comportamento da busca, uso de sugestões, tratamento
de nomes iguais e dados mínimos de identificação da localização.

### Dados exibidos e granularidade

O clima atual exibirá temperatura, sensação térmica, umidade, velocidade do
vento, precipitação e condição climática. A previsão será diária e exibirá
temperaturas mínima e máxima e condição climática para hoje e os quatro dias
seguintes. Não haverá previsão horária no MVP.

**Justificativa:** define um conjunto de dados útil sem ampliar o escopo para
uma experiência horária mais complexa.

**Perguntas resolvidas:** quais campos serão exibidos e qual granularidade será
usada na previsão.

### Datas e fuso horário

As datas serão exibidas no formato brasileiro e respeitarão o fuso horário da
cidade consultada, informado pela Open-Meteo.

**Justificativa:** evita que uma cidade em outro fuso seja apresentada com data
incorreta.

**Perguntas resolvidas:** formato regional e fuso usado para interpretar as
datas da previsão.

### Atualização e cache

Os dados serão consultados quando o usuário realizar uma busca. Não haverá
atualização automática no MVP. Resultados poderão ser reutilizados em cache
durante a sessão para a mesma localização, sem persistência após o fechamento
da página.

**Justificativa:** limita o consumo da API e mantém o comportamento previsível.

**Perguntas resolvidas:** frequência de atualização, necessidade de cache e
persistência de resultados.

### Localização automática

O app não solicitará permissão de geolocalização e não definirá uma cidade
automaticamente no primeiro acesso. O estado inicial será vazio, com orientação
para realizar uma busca.

**Justificativa:** evita permissões desnecessárias e mantém o fluxo explícito.

**Pergunta resolvida:** uso de geolocalização automática e cidade inicial.

### Tratamento de indisponibilidade

Consultas com timeout, erro HTTP ou resposta inválida devem sair do loading,
preservar a última previsão válida quando existir e oferecer uma ação de nova
tentativa. Na ausência de resultado anterior, será exibida uma mensagem de erro
em pt-BR.

**Justificativa:** garante degradação controlada sem esconder falhas ou deixar
o usuário preso em um estado de carregamento.

**Perguntas resolvidas:** timeout, comportamento em indisponibilidade e
recuperação após falhas.

## Fora do Escopo do MVP

- Autenticação e contas de usuário.
- Persistência local ou em servidor de preferências, histórico e favoritos.
- Geolocalização automática.
- Sugestões de busca enquanto o usuário digita.
- Previsão horária, alertas meteorológicos e notificações.
- Internacionalização além da interface pt-BR.
- Compartilhamento por URL, SEO específico e funcionamento offline.

## Critérios de Sucesso do Produto

- O usuário consegue encontrar e selecionar uma cidade válida em até 30
	segundos.
- Uma busca válida exibe clima atual e cinco dias de previsão em até 3 segundos
	em condições normais de rede e disponibilidade da API.
- O usuário consegue alternar entre Celsius e Fahrenheit sem nova requisição ou
	perda dos dados exibidos.
- Uma cidade inexistente, timeout ou falha da API resulta em mensagem clara e
	possibilidade de nova tentativa.
- Os fluxos principais funcionam por teclado e em viewport móvel, tablet e
	desktop sem perda de conteúdo essencial.

## Status do Discovery

As decisões de produto e as restrições iniciais necessárias para a
especificação estão fechadas. O próximo artefato deve detalhar critérios de
aceitação, contratos de dados e arquitetura sem reabrir decisões registradas
neste documento, salvo mudança explícita de escopo.
