# Matriz de Riscos — Weather App

| Risco | Tipo | Probabilidade | Impacto | Estratégia de mitigação |
|---|---|---:|---|---|
| API meteorológica indisponível | Técnico | Média | Usuários não conseguem consultar o clima. | Implementar timeout, tratamento de erros, retry manual e mensagem clara de indisponibilidade. |
| API retornar dados inválidos ou incompletos | Técnico | Média | Previsões incorretas ou interface quebrada. | Validar o payload recebido, definir valores fallback e isolar a integração em `services/`. |
| Limite de requisições da API ser atingido | Técnico | Média | Consultas bloqueadas ou degradadas. | Usar cache, evitar chamadas ao alternar unidades e controlar buscas repetidas. |
| API ficar lenta | Técnico | Média | Experiência ruim e carregamento indefinido. | Definir timeout, exibir loading imediatamente e permitir nova tentativa. |
| Cidades com nomes iguais | Produto | Alta | O usuário pode visualizar a previsão do local errado. | Exibir cidade, estado e país nos resultados e permitir seleção explícita. |
| Busca não encontrar grafias alternativas | Produto | Média | Usuário conclui que a cidade não existe. | Usar geocoding confiável, aceitar buscas flexíveis e oferecer sugestões. |
| Previsão de cinco dias ser interpretada de forma diferente | Produto | Média | Divergência entre expectativa, dados e testes. | Definir claramente se o período inclui o dia atual e documentar o critério. |
| Conversão Celsius/Fahrenheit incorreta | Técnico | Baixa | Usuários recebem informações meteorológicas erradas. | Centralizar a conversão em função pura e cobrir com testes unitários e casos-limite. |
| Diferença de fuso horário | Técnico/Produto | Média | Datas e dias da previsão podem aparecer incorretos. | Usar o fuso horário da cidade consultada e testar cidades em fusos diferentes. |
| Interface inadequada em telas pequenas | Produto | Média | Dificuldade de leitura e interação em dispositivos móveis. | Adotar abordagem mobile-first e validar breakpoints, overflow e toque. |
| Problemas de acessibilidade | Produto | Média | Exclusão de usuários e possível não conformidade. | Testar teclado, foco, leitores de tela, contraste e mensagens semânticas. |
| Desempenho abaixo do esperado | Técnico | Média | Abandono durante buscas e baixa percepção de qualidade. | Definir metas de tempo de resposta, reduzir requisições e medir carregamento. |
| Falta de persistência da unidade escolhida | Produto | Média | Usuário precisa repetir sua preferência a cada acesso. | Decidir explicitamente o comportamento e, se necessário, usar armazenamento local. |
| Dados meteorológicos não atenderem ao escopo visual | Produto | Média | O app não consegue exibir todas as informações planejadas. | Confirmar o contrato da API antes do design final e priorizar campos essenciais. |
| Dependência excessiva de um fornecedor | Técnico | Baixa | Mudança de API, preço ou política pode interromper o produto. | Isolar o adaptador da API e manter o domínio independente do formato externo. |
| Ausência de observabilidade | Técnico | Média | Falhas em produção ficam difíceis de diagnosticar. | Registrar erros, tempos de resposta, falhas da API e métricas de uso sem expor dados pessoais. |
| Requisitos de produto permanecerem ambíguos | Produto | Alta | Retrabalho, decisões conflitantes e critérios de aceite frágeis. | Resolver as perguntas críticas antes do plano e registrar decisões na especificação. |
| Escopo crescer durante a implementação | Produto | Alta | Atrasos e perda de foco no MVP. | Definir funcionalidades obrigatórias, adiar favoritos, histórico e login e controlar mudanças. |
| Falta de definição de sucesso | Produto | Média | Não há como avaliar se o app entrega valor. | Definir métricas como taxa de busca concluída, tempo de resposta e erros por consulta. |
| Requisitos legais e de atribuição serem ignorados | Produto/Técnico | Baixa | Risco de publicação irregular ou problemas com a fonte de dados. | Revisar licença, atribuição, política de privacidade e termos da API antes do deploy. |
