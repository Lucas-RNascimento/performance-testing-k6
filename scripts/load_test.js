import http from "k6/http";
import { check, sleep } from "k6";

/*
  LOAD TEST
  Objetivo: simular tráfego real com aumento gradual de usuários.
*/

export const options = {
  stages: [
    { duration: "15s", target: 5 },   // warm-up
    { duration: "30s", target: 10 },  // carga inicial
    { duration: "1m",  target: 20 },  // carga sustentada
    { duration: "20s", target: 0 },   // cool down
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],   // menos de 5% de falhas
    http_req_duration: ["p(95)<1000"] // p95 < 1s em carga
  }
};

export default function () {
  const res = http.get("https://test-api.k6.io/public/crocodiles/");

  check(res, {
    "status é 200": r => r.status === 200,
    "resposta não está vazia": r => r.body.length > 0,
  });

  sleep(1); // think time
}
