import http from "k6/http";
import { check, sleep } from "k6";

/*
  SMOKE TEST
  Objetivo: validar se o endpoint responde corretamente
  sem aplicar carga alta.
*/

export const options = {
  vus: 1,            // 1 usuário virtual
  duration: "15s",   // rodar por 15 segundos
  thresholds: {
    http_req_failed: ["rate<0.05"],   // menos de 5% de falhas
    http_req_duration: ["p(95)<800"]  // p95 deve ser < 800ms
  }
};

export default function () {
  const res = http.get("https://test-api.k6.io/public/crocodiles/");

  // validações básicas (checks)
  check(res, {
    "status é 200": r => r.status === 200,
    "resposta não está vazia": r => r.body.length > 0,
  });

  sleep(1); // simula comportamento humano
}
