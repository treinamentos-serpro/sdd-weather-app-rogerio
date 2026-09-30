# Ambiguidades e Lacunas — Weather App

Este documento registra os pontos que precisam de decisão durante o discovery.
Cada item contém uma pergunta em aberto e o impacto de seguir sem resposta.

| Ponto | Pergunta em aberto | Impacto sem resposta |
|---|---|---|
| Público-alvo | Quem são os usuários principais: público geral, viajantes, agricultores ou outro grupo? | Pode resultar em uma interface inadequada para as necessidades reais. |
| Escopo do MVP | Quais funcionalidades são obrigatórias na primeira versão e quais ficam fora do MVP? | A equipe pode gastar tempo em funcionalidades secundárias e perder foco. |
| Busca | A busca ocorre após clicar em um botão, pressionar Enter ou enquanto o usuário digita? | O fluxo de interação e a implementação da busca ficam indefinidos. |
| Sugestões | Devem ser exibidas sugestões de cidades durante a digitação? | Sem essa decisão, não é possível definir a experiência nem o volume de requisições. |
| Cidades homônimas | Como diferenciar cidades com o mesmo nome? | O usuário pode receber a previsão do local errado. |
| Localização | A busca aceita apenas cidades ou também países, estados, CEPs e coordenadas? | Afeta o modelo de dados, a API e a precisão dos resultados. |
| Geolocalização | O app deve detectar automaticamente a localização do usuário? | Impacta permissões, privacidade, UX e comportamento inicial da aplicação. |
| Cidade inicial | Qual cidade aparece no primeiro acesso? O app deve começar vazio? | Define o estado inicial e a necessidade de uma chamada automática à API. |
| Dados atuais | Quais dados compõem o clima atual: temperatura, sensação térmica, vento, umidade, pressão ou precipitação? | Afeta o contrato da API, o design e os critérios de aceite. |
| Condição climática | Como as condições meteorológicas serão apresentadas: texto, ícone ou combinação? | Pode gerar uma experiência inconsistente ou pouco compreensível. |
| Previsão de cinco dias | Os cinco dias incluem o dia atual ou começam no dia seguinte? | Altera os dados exibidos e pode causar divergência com a expectativa do usuário. |
| Granularidade | A previsão será diária, por hora ou ambas? | Impacta escopo, layout, volume de dados e complexidade. |
| Temperaturas | Devem ser exibidas temperaturas mínimas, máximas, médias ou todas? | Sem definição, o conteúdo da previsão fica incompleto ou inconsistente. |
| Unidade padrão | Celsius ou Fahrenheit será a unidade inicial? | Afeta a primeira experiência e os testes de aceitação. |
| Persistência da unidade | A escolha de °C/°F deve ser lembrada entre visitas? | Define se será necessário usar armazenamento local ou conta de usuário. |
| Conversão | A conversão será feita pelo app ou a API fornecerá as duas unidades? | Influencia arquitetura, precisão, testes e necessidade de novas requisições. |
| Atualização dos dados | Os dados devem ser atualizados automaticamente? Com que frequência? | Afeta precisão percebida, consumo da API e performance. |
| Cache | Resultados recentes devem ser armazenados temporariamente? | Sem cache, podem ocorrer chamadas repetidas, lentidão e uso excessivo da API. |
| API | Qual serviço fornecerá geocoding e previsão meteorológica? | Define endpoints, limites, formato dos dados, disponibilidade e custos. |
| Autenticação da API | A API exige chave, proxy ou configuração de variáveis de ambiente? | Pode afetar segurança, deploy e funcionamento local. |
| Limites da API | Qual é o limite de requisições e como o app reagirá ao rate limit? | Pode causar indisponibilidade ou bloqueio em produção. |
| Falhas externas | O que deve ocorrer quando a API estiver lenta, indisponível ou retornar dados inválidos? | Sem fallback, o usuário pode ver uma tela quebrada ou uma mensagem pouco útil. |
| Timeout | Qual tempo máximo uma consulta pode aguardar? | Sem limite, a interface pode permanecer carregando indefinidamente. |
| Idioma | A aplicação será apenas em português ou terá internacionalização? | Afeta textos, traduções, formatos de data e arquitetura da interface. |
| Formato de data | As datas devem usar formato brasileiro, localização do dispositivo ou outro padrão? | Pode gerar confusão, especialmente para usuários internacionais. |
| Fuso horário | As datas e horários serão exibidos no fuso da cidade consultada ou do usuário? | Pode apresentar dias incorretos para cidades em outros fusos. |
| Responsividade | Quais tamanhos de tela e dispositivos precisam ser oficialmente suportados? | Sem alvos definidos, “responsivo” não pode ser validado objetivamente. |
| Acessibilidade | Qual nível de conformidade será adotado, por exemplo WCAG 2.2 AA? | Pode resultar em requisitos de acessibilidade insuficientes e problemas de inclusão. |
| Navegadores | Quais navegadores e versões terão suporte? | Afeta compatibilidade, testes e decisões de implementação. |
| Performance | Qual é o tempo máximo aceitável para carregar a aplicação e retornar uma busca? | Sem metas, não há critério objetivo para avaliar desempenho. |
| Disponibilidade | Qual nível de disponibilidade é esperado para o app e para a consulta meteorológica? | Impede definir metas de resiliência, monitoramento e fallback. |
| Privacidade | Dados de localização ou histórico de buscas serão coletados ou armazenados? | Pode criar riscos de privacidade e obrigações legais. |
| Histórico e favoritos | O usuário poderá salvar cidades favoritas ou consultar buscas anteriores? | Se não for decidido cedo, pode haver retrabalho no modelo de dados e na UX. |
| Conta de usuário | Será necessário login ou o app será anônimo? | Define persistência, autenticação, segurança e complexidade do produto. |
| Observabilidade | Quais erros, métricas e eventos precisam ser monitorados? | Dificulta diagnosticar falhas e medir o uso real do produto. |
| Analytics | A empresa precisa medir buscas, cidades consultadas ou uso das unidades? | Sem instrumentação inicial, métricas importantes podem ser perdidas. |
| SEO e compartilhamento | As previsões devem ser indexáveis ou compartilháveis por URL? | Pode alterar a arquitetura e exigir rotas ou renderização específica. |
| Deploy | Onde a aplicação será publicada e qual ambiente será usado? | Impacta configuração, variáveis, domínio, CORS e pipeline de entrega. |
| Identidade visual | Existem diretrizes de marca, cores, tipografia e componentes obrigatórios? | O resultado pode não atender às expectativas visuais da empresa. |
| Conteúdo | Quem fornecerá textos, ícones e descrições das condições climáticas? | Pode deixar a interface sem conteúdo consistente ou acessível. |
| Legalidade | Há requisitos de termos de uso, política de privacidade ou atribuição da fonte de dados? | Pode impedir a publicação ou gerar risco de conformidade. |
| Critério de sucesso | Como será medido o sucesso do Weather App? | Sem métricas, não é possível avaliar se o produto resolveu o problema. |

## Prioridade para o próximo passo

As lacunas mais críticas para resolver antes do planejamento técnico são:

- API escolhida
- Comportamento da busca
- Tratamento de cidades homônimas
- Definição da previsão de cinco dias
- Unidade padrão
- Política de falhas
- Metas de performance
- Escopo do MVP
