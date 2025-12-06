import http from "k6/http";
import { check, sleep } from "k6";

// ---------------------------------------------------------------------------
// 💡 IMPORT DINÂMICO DO K6-REPORTER (só funciona LOCALMENTE)
// ⚠️ O GitHub Actions não vai baixar/compilar o HTML (evita erro 107)
// ---------------------------------------------------------------------------
let htmlReport = null;

if (__ENV.CI !== "true") {
    htmlReport = (await import("https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js")).htmlReport;
}

/*
Usage examples (local):
  TEST_TYPE=smoke BASE_URL=https://test-api.k6.io k6 run test_k6.js
  TEST_TYPE=load  BASE_URL=https://test-api.k6.io k6 run --summary-export=results/cli_summary.json test_k6.js
  TEST_TYPE=stress BASE_URL=https://test-api.k6.io k6 run --summary-export=results/cli_summary.json test_k6.js
*/

const TEST_TYPE = __ENV.TEST_TYPE || "smoke";
const BASE_URL = __ENV.BASE_URL || "https://test-api.k6.io";
const ENDPOINT = __ENV.ENDPOINT || "/public/crocodiles/";
const API_TOKEN = __ENV.API_TOKEN || "";

// ---------------------------------------------------------------------------
// Headers reutilizáveis
// ---------------------------------------------------------------------------
function getHeaders() {
    const h = { "Content-Type": "application/json" };
    if (API_TOKEN) h["Authorization"] = `Bearer ${API_TOKEN}`;
    return { headers: h };
}

// ---------------------------------------------------------------------------
// Perfis de execução por tipo de teste
// ---------------------------------------------------------------------------
const profiles = {
    smoke: {
        options: {
            vus: 1,
            duration: "15s",
            thresholds: {
                http_req_failed: ["rate<0.05"],
                http_req_duration: ["p(95)<800"]
            }
        }
    },

    load: {
        options: {
            stages: [
                { duration: "15s", target: 5 },
                { duration: "30s", target: 10 },
                { duration: "1m", target: 20 },
                { duration: "30s", target: 0 }
            ],
            thresholds: {
                http_req_failed: ["rate<0.05"],
                http_req_duration: ["p(95)<1000"]
            }
        }
    },

    stress: {
        options: {
            stages: [
                { duration: "20s", target: 20 },
                { duration: "20s", target: 50 },
                { duration: "30s", target: 100 },
                { duration: "30s", target: 150 },
                { duration: "30s", target: 200 },
                { duration: "20s", target: 0 }
            ],
            thresholds: {
                http_req_failed: ["rate<0.20"],
                http_req_duration: ["p(95)<3000"]
            }
        }
    }
};

// ---------------------------------------------------------------------------
// Seleciona o perfil
// ---------------------------------------------------------------------------
let selected = profiles[TEST_TYPE] || profiles.smoke;
export let options = selected.options;
options.tags = { project: "performance-testing-k6", phase: TEST_TYPE };

// ---------------------------------------------------------------------------
// Helper para construir URL final
// ---------------------------------------------------------------------------
function url(path) {
    return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

// ---------------------------------------------------------------------------
// 📌 Cenário principal: GET simples (pode ser estendido)
// ---------------------------------------------------------------------------
export default function () {
    const res = http.get(url(ENDPOINT), getHeaders());

    check(res, {
        "status is 200": (r) => r.status === 200,
        "body not empty": (r) => r.body && r.body.length > 0
    });

    sleep(1);
}

// ---------------------------------------------------------------------------
// 📌 handleSummary — VERSÃO FINAL ANTI-ERRO PARA CI/CD
// ---------------------------------------------------------------------------
export function handleSummary(data) {
    const runningInCI = __ENV.CI === "true";

    // -----------------------------------------------------------------------
    // CI/CD → NÃO GERAR HTML (para evitar erro do k6-reporter)
    // -----------------------------------------------------------------------
    if (runningInCI) {
        return {
            "results/summary.json": JSON.stringify(data, null, 2),
            stdout: JSON.stringify(
                {
                    info: "Running in CI, HTML report disabled",
                    metrics: {
                        http_reqs: data.metrics.http_reqs,
                        http_req_duration: data.metrics.http_req_duration
                    }
                },
                null,
                2
            )
        };
    }

    // -----------------------------------------------------------------------
    // LOCAL → GERAR HTML BONITO COM K6-REPORTER
    // -----------------------------------------------------------------------
    return {
        "results/summary.json": JSON.stringify(data, null, 2),
        "results/summary.html": htmlReport(data),
        stdout: "HTML report generated at results/summary.html"
    };
}
