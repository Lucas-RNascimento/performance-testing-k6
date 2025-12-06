# 📊 Relatório Final de Testes de Performance  
Projeto: **performance-testing-k6**

Este documento apresenta a análise completa dos resultados obtidos nos testes de performance executados com **k6**, abrangendo:

- Smoke Test  
- Load Test  
- Stress Test  
- Observações técnicas  
- Resultados brutos  
- Conclusões   

Todos os testes foram realizados usando o script principal **test_k6.js**, configurado via variáveis de ambiente.

---

# 🟦 1. Resumo Executivo

Foram executados testes de performance sobre o endpoint:

GET https://test-api.k6.io/public/crocodiles/


Os testes demonstraram:

- **Estabilidade total**, mesmo sob estresse extremo  
- **Latência baixa** (p95 ~162ms em todos os cenários)  
- **Zero falhas** mesmo em 200 VUs  
- **Throughput alto**, chegando a ~156 req/s no stress test  

O sistema mostrou comportamento **excelente**, sem degradação significativa mesmo sob carga extrema.

---

# 🟩 2. Resultados — Smoke Test

### 📌 Configuração
- 1 VU  
- 15s  
- Threshold p95 < 800ms  

### 📈 Resultado Real (executado por você)
- **Total Requests:** 26  
- **Failed Requests:** 0  
- **Checks:** 100% (26/26)  
- **p95:** **162.80ms**  
- **p90:** 160.90ms  
- **Avg:** 98ms  

### 🧠 Análise

O endpoint respondeu corretamente durante toda a execução, sem erros e com baixa latência.

> ✔ **Conclusão:** Sistema apto para os próximos testes.

---

# 🟨 3. Resultados — Load Test

### 📌 Configuração
- Ramp-up: 5 ➝ 10 ➝ 20 VUs  
- Duração total: ~2min  
- Threshold p95 < 1000ms  

### 📈 Resultado Real
- **Total Requests:** 2200  
- **Checks:** 100%  
- **Failed Requests:** 0  
- **Throughput:** ~17.48 req/s  
- **p95:** **168.44ms**  
- **Avg:** 104.5ms  
- **Max latency:** 2.36s (spike isolado)

### 🧠 Análise

O sistema permaneceu estável mesmo com 20 usuários simultâneos.  
A latência permaneceu baixa e constante — indicando boa capacidade de escalabilidade.

> ✔ **Conclusão:** O sistema suporta carga moderada sem degradação.

---

# 🟥 4. Resultados — Stress Test

### 📌 Configuração
Ramp-up agressivo:
| Duração | VUs |
|--------|-----|
| 20s | 20 |
| 20s | 50 |
| 30s | 100 |
| 30s | 150 |
| 30s | 200 |
| 20s | 0 |

Threshold relaxado: p95 < 3000ms / fail rate < 20%

### 📈 Resultado Real
- **Total Requests:** 23.630  
- **Checks:** 100%  
- **Failed Requests:** 0  
- **Throughput:** ~156.7 req/s  
- **Avg latency:** 98ms  
- **p95:** **167.27ms**  
- **Max latency:** 4.78s  
- **Iterations:** 11.815  

### 🧠 Análise Avançada

Os resultados foram **impressionantes**:

- Mesmo com **200 VUs**, a latência p95 ficou praticamente igual à do smoke test (~167ms)
- Não houve falhas — nenhum erro 500 ou timeout  
- O throughput chegou a **quase 160 requisições por segundo**
- Pequenos picos de latência são normais em stress extremo  

O sistema **não apresentou ponto de quebra** durante o teste.

> ✔ **Conclusão:** Sistema altamente resiliente e escalável, com performance acima do esperado.

---

# 🧩 5. Comparativo Geral

| Métrica | Smoke | Load | Stress |
|--------|-------|------|--------|
| VUs Máx | 1 | 20 | 200 |
| p95 | 162ms | 168ms | 167ms |
| Throughput | ~1.6/s | ~17.4/s | ~156/s |
| Falhas | 0 | 0 | 0 |
| Checks | 100% | 100% | 100% |

🎯 **Interpretação:**  
A diferença mínima entre p95 do Smoke (162ms) e do Stress (167ms) indica que o sistema possui excelente:

- Arquitetura  
- Balanceamento de carga  
- Otimização de resposta  
- Baixa latência por design  

---

# 🧠 6. Observações Técnicas Importantes

- A API testada é **extremamente estável**, ideal para fins educacionais.  
- O script unificado (**test_k6.js**) permite selecionar o tipo de teste via `TEST_TYPE`.  
- A estrutura do projeto está adequada ao padrão de Performance Engineering.  
- O pipeline GitHub Actions simplifica a execução contínua.  
- O uso do `handleSummary()` garante relatórios HTML sempre atualizados.

---

# 🧾 7. Evidências (Relatórios)

Após cada execução foram gerados automaticamente:

- `results/summary.html` — relatório visual profissional  
- `results/summary.json` — métricas completas  
- `results/cli_summary.json` (para load e stress)

Esses arquivos estão disponíveis no repositório e nos artifacts do pipeline.

---

# 🧠 8. Lições Aprendidas

- Diferenças entre sintaxe de variáveis no Windows (PowerShell) e Linux.  
- Importância de um smoke test antes de cargas maiores.  
- Como analisar p95, throughput e picos de latência corretamente.  
- Como montar um pipeline automatizado para performance.  
- Como utilizar scripts parametrizados no k6.

---

# 🏁 9. Conclusão Final

O sistema testado demonstrou:

- Excelente performance  
- Alta estabilidade  
- Resiliência sob cargas extremas  
- Baixa latência mesmo em 200 VUs  
- Zero falhas em todos os testes  

O projeto cumpre com excelência os objetivos definidos no **Plano de Teste de Performance**, sendo um forte demonstrativo de habilidades em:

- K6  
- CI/CD  
- Métricas avançadas  
- Análise de performance  
- Estrutura de projetos de QA/Performance Engineering  

