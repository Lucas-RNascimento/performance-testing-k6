import http from "k6/http";
import { check, sleep } from "k6";

/*
  STRESS TEST
  Objetivo: aumentar a carga até encontrar o ponto de quebra.
*/

export const options = {
  stages: [
    { duration: "20s", target: 20 },   // início da carga
    { duration: "20s", target: 50 },   // carga moderada
    { duration: "30s", target: 100 },  // carga alta
    { duration: "30s", target: 150 },  // carga muito alta
    { duration: "30s", target: 200 },  // carga extrema
    { duration: "20s", target: 0 },    // cooldown
  ],
  thresholds: {
    http_req_failed: ["rate<0.20"], // até 20% de erros é aceitável (stress, não produção)
    http_req_duration: ["p(95)<3000"], // até 3s é tolerável sob caos
  },
};

export default function () {
  const res = http.get("https://test-api.k6.io/public/crocodiles/");

  check(res, {
    "status é 200": r => r.status === 200,
    "resposta não está vazia": r => r.body && r.body.length > 0
  });

  sleep(1);
}
