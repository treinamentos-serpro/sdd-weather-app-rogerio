# Requisitos Não Funcionais — Weather App

Este documento detalha os requisitos de qualidade identificados durante o
processo de discovery. Os valores numéricos abaixo são metas iniciais e devem
ser confirmados durante a especificação e o planejamento técnico.

## Performance

### RNF07 — Tempo de resposta

Em condições normais de rede e disponibilidade da API, a aplicação deve exibir
os resultados de uma consulta em até 3 segundos após o envio da busca.

### RNF08 — Feedback imediato

A aplicação deve exibir o estado de carregamento imediatamente após o usuário
iniciar uma consulta.

### RNF09 — Eficiência de requisições

A troca entre Celsius e Fahrenheit não deve realizar uma nova requisição de
rede. A conversão deve usar os dados já carregados sempre que possível.

## Acessibilidade

### RNF10 — Navegação por teclado

Todos os controles interativos devem ser acessíveis por teclado, com ordem de
foco lógica e indicador de foco visível.

### RNF11 — Tecnologias assistivas

Resultados, mensagens de erro e mudanças de estado devem ser comunicados de
forma compatível com leitores de tela e outras tecnologias assistivas.

### RNF12 — Contraste e conteúdo alternativo

Textos e controles devem atender ao contraste mínimo aplicável, e ícones ou
imagens meteorológicas devem possuir texto alternativo ou descrição acessível.

## Responsividade

### RNF13 — Layout adaptável

A interface deve se adaptar a dispositivos móveis, tablets e desktops sem
sobreposição, perda de conteúdo essencial ou rolagem horizontal indevida.

### RNF14 — Viewports suportados

A aplicação deve ser validada, no mínimo, em larguras de viewport móvel,
tablet e desktop definidas no plano técnico.

## Disponibilidade e Resiliência

### RNF15 — Degradação controlada

Quando o serviço meteorológico estiver indisponível, a aplicação deve
continuar utilizável e exibir uma mensagem clara, sem apresentar uma tela
quebrada.

### RNF16 — Timeout de consulta

Uma consulta que exceder o limite de tempo definido deve ser encerrada ou
cancelada e informar o usuário sobre a falha.

### RNF17 — Recuperação após falha

Após uma falha de consulta, o usuário deve poder tentar novamente sem
recarregar a página.

### RNF18 — Tratamento de respostas externas

A aplicação deve tratar respostas HTTP de erro, payloads inválidos e campos
obrigatórios ausentes sem interromper a experiência do usuário.

## Observações

- Os limites de tempo, os navegadores suportados e os critérios de contraste
  devem ser confirmados antes da implementação.
- Os comportamentos visíveis ao usuário também devem ser refletidos nos
  requisitos funcionais e nos cenários de teste.
