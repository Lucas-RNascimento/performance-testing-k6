# 🔥 Projeto de Performance Testing com K6  
Repositório: **performance-testing-k6**

Este projeto demonstra um fluxo completo e profissional de Testes de Performance utilizando **k6**, cobrindo:

- Smoke Test  
- Load Test  
- Stress Test  
- Script unificado configurável via variáveis de ambiente  
- Relatórios HTML e JSON  
- Pipeline GitHub Actions com publicação de artifacts  
- Documentação completa (Plano e Relatório de Execução)

Ideal para vagas de **Quality Engineer**, **Performance Engineer**, **QA Automation** e **SRE-focused QA**.

---

## 📌 1. Objetivo do Projeto

Implementar um projeto completo de **Performance Engineering** replicando práticas usadas em empresas como:  
Nubank, iFood, Mercado Livre, XP, Stone e Mercado Pago.

O foco é demonstrar:

- Capacidade de criar estratégias de performance  
- Experiência com smoke/load/stress  
- Conhecimento de métricas (p95, throughput, latência, erro)  
- Uso de k6 de forma profissional  
- Integração contínua com GitHub Actions  
- Entrega de relatórios automatizados  

---

## 📁 2. Estrutura do Projeto

performance-testing-k6/
│
├── test_k6.js # Script principal: smoke/load/stress dinâmico
│
├── scripts/ # Scripts individuais (educativos)
│ ├── smoke_test.js
│ ├── load_test.js
│ ├── stress_test.js
│ └── hello_k6.js
│
├── results/ # Relatórios gerados automaticamente
│ ├── summary.html
│ ├── summary.json
│
├── docs/
│ ├── PLAN.md # Plano de teste de performance
│ └── REPORT.md # Relatório final
│
└── .github/workflows/
└── k6-performance.yml # Pipeline CI/CD


---

## ▶️ 3. Como executar os testes localmente

### 📌 3.1. Criar a pasta de resultados
```powershell
mkdir results


📌 3.2. Executar SMOKE TEST

$env:TEST_TYPE="smoke"
$env:BASE_URL="https://test-api.k6.io"
$env:ENDPOINT="/public/crocodiles/"
k6 run test_k6.js


📌 3.3. Executar LOAD TEST
$env:TEST_TYPE="load"
$env:BASE_URL="https://test-api.k6.io"
$env:ENDPOINT="/public/crocodiles/"
k6 run --summary-export=results/cli_summary.json test_k6.js


📌 3.4. Executar STRESS TEST
$env:TEST_TYPE="stress"
$env:BASE_URL="https://test-api.k6.io"
$env:ENDPOINT="/public/crocodiles/"
k6 run --summary-export=results/cli_summary.json test_k6.js


📌 3.5. Com autenticação (opcional)
$env:TEST_TYPE="load"
$env:API_TOKEN="SEU_TOKEN"
$env:BASE_URL="https://api.seusistema.com"
$env:ENDPOINT="/v1/checkout"
k6 run test_k6.js


📊 4. Relatórios

Após cada execução, o k6 gera automaticamente:

📁 results/summary.html — Relatório visual completo
📁 results/summary.json — Dados brutos
📁 results/cli_summary.json — Export via --summary-export (load/stress)

🤖 5. Pipeline GitHub Actions

O pipeline executa automaticamente:

Smoke Test a cada git push

Load/Stress sob demanda via workflow dispatch

Publica os relatórios como artifacts

Arquivo:
.github/workflows/k6-performance.yml


📄 6. Documentação

PLAN.md → Estratégia de performance: objetivos, escopo, cenários, thresholds, métricas.

REPORT.md → Análise detalhada dos resultados de Smoke, Load e Stress Test.

🎯 7. Tecnologias utilizadas

k6

JavaScript

GitHub Actions

k6-reporter (HTML summary)

PowerShell (local execution)

Linux runner (CI/CD)

🧠 8. Lições aprendidas (Lessons Learned)

Diferenças entre Linux e Windows para variáveis de ambiente.

Como criar testes parametrizados e profissionais com k6.

Uso correto de thresholds para smoke/load/stress.

Análise real: p95, throughput, erro, latência.

Construção de pipelines automáticas com artifacts.

Estruturação de um projeto completo de performance para portfólio.

🏁 9. Resultado Final

Este projeto entrega um pipeline completo de performance:

✔ Execução local e via CI
✔ Relatórios HTML automatizados
✔ Script dinâmico e reutilizável
✔ Plano + Relatório profissional
✔ Comportamento de API sob 1 → 20 → 200 VUs
✔ P95 < 200ms mesmo sob stress extremo