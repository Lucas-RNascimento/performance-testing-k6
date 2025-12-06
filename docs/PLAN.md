# 📘 Plano de Teste de Performance – Projeto: performance-testing-k6

## 📌 1. Visão Geral

Este documento descreve a estratégia completa de testes de performance aplicada no projeto **performance-testing-k6**, utilizando o **k6** como ferramenta de execução.  
O objetivo deste plano é garantir que as APIs alvo sejam avaliadas quanto a:

- Estabilidade  
- Desempenho sob carga  
- Comportamento em cenários extremos  
- Capacidade de escalar  
- Resiliência em condições adversas  

---

## 🎯 2. Objetivos do Teste

1. Validar se o endpoint funciona corretamente sob baixa carga (Smoke Test).  
2. Avaliar o desempenho e estabilidade sob carga moderada (Load Test).  
3. Identificar o ponto de saturação e degradação (Stress Test).  
4. Medir métricas-chave de performance:
   - Latência (p95, p99)
   - Throughput (req/s)
   - Taxa de falhas
   - Tempo de resposta médio e máximo  
5. Entregar relatórios automatizados (HTML + JSON).  
6. Automatizar smoke/load/stress via GitHub Actions.

---

## 🧩 3. Escopo do Teste

### ✔ Escopo INCLUÍDO

- Teste de API REST pública:  
https://test-api.k6.io/public/crocodiles/


- Execução controlada por variáveis de ambiente:  
- `TEST_TYPE`
- `BASE_URL`
- `ENDPOINT`
- `API_TOKEN` (opcional)
- Testes:
- Smoke  
- Load  
- Stress  
- Geração de relatórios (summary.json/html)
- Pipeline CI/CD com artifacts

### ❌ Escopo EXCLUÍDO

- Testes funcionais  
- Testes End-to-End  
- Testes de UI  
- Testes de concorrência em banco de dados  
- Testes de integração entre múltiplos serviços  

---

## 🔧 4. Ambiente de Testes

### ✔ Ambiente utilizado

- API pública: `https://test-api.k6.io`
- Runner local: Windows + PowerShell  
- Runner CI: GitHub Actions (Ubuntu Latest)  
- Ferramentas:
- k6 v1.x
- k6-reporter (relatório HTML)
- GitHub Actions

### ✔ Configurações externas

- Sem necessidade de autenticação (mas suportado via `API_TOKEN`)
- Endpoint leve, ideal para fins educacionais

---

## 📁 5. Recursos de Teste

### 5.1 Scripts utilizados

| Script | Finalidade |
|--------|------------|
| `test_k6.js` | Script principal unificado (Smoke/Load/Stress) |
| `scripts/smoke_test.js` | Smoke isolado (didático) |
| `scripts/load_test.js` | Load isolado (didático) |
| `scripts/stress_test.js` | Stress isolado (didático) |
| `scripts/hello_k6.js` | Teste inicial de ambiente |

### 5.2 Pipeline CI/CD

- Arquivo: `.github/workflows/k6-performance.yml`

---

## ⚙️ 6. Estratégia de Testes

A estratégia de performance foi dividida em três fases:

---

## 🔹 6.1 Smoke Test

### 🎯 Objetivo
Garantir que o endpoint está respondendo corretamente antes dos testes pesados.

### 📌 Configuração
- **1 VU**
- **15 segundos**
- Thresholds:
- `p(95) < 800ms`
- `fail rate < 5%`

### ✔ Critérios de Aceite
- 0 erros  
- p95 abaixo de 800ms  
- Checks 100% aprovados  

---

## 🔹 6.2 Load Test

### 🎯 Objetivo
Simular uso real com carga moderada e avaliar estabilidade.

### 📌 Cenário (ramp-up)
| Duração | VUs |
|--------|-----|
| 15s | 5 |
| 30s | 10 |
| 1m | 20 |
| 30s | 0 |

### ✔ Thresholds
- `p(95) < 1000ms`
- `fail rate < 5%`

### ✔ Critérios de Sucesso
- Latência estável  
- Sem degradação significativa  
- Throughput consistente  

---

## 🔹 6.3 Stress Test

### 🎯 Objetivo
Forçar o sistema ao limite para descobrir:

- ponto de saturação  
- comportamento sob extreme load  
- quando começam erros  

### 📌 Cenário (agressivo)
| Duração | VUs |
|--------|-----|
| 20s | 20 |
| 20s | 50 |
| 30s | 100 |
| 30s | 150 |
| 30s | 200 |
| 20s | 0 |

### ✔ Thresholds
- `fail rate < 20%`
- `p(95) < 3000ms`

### ✔ Critérios de Observação
- Latência explosiva  
- Falhas HTTP (500 / timeout)  
- Degradação brusca  

---

## 📊 7. Métricas Monitoradas

- **http_req_duration** (latência total)
- **http_req_waiting** (time to first byte)
- **http_req_connecting**
- **http_req_blocked**
- **http_reqs** (throughput)
- **iteration_duration**
- **vus / vus_max**

---

## 📝 8. Critérios de Aceitação Final

| Teste | Deve atingir |
|-------|--------------|
| Smoke | p95 < 800ms / 0 erros |
| Load | p95 < 1000ms / falhas <5% |
| Stress | observar degradação sem derrubar o ambiente |

---

