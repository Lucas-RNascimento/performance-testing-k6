import http from "k6/http";
import { check, sleep } from "k6";

const TEST_TYPE = __ENV.TEST_TYPE || "smoke";
const BASE_URL = __ENV.BASE_URL || "https://test-api.k6.io";
const ENDPOINT = __ENV.ENDPOINT || "/public/crocodiles/";
const API_TOKEN = __ENV.API_TOKEN || "";

function getHeaders() {
  const h = { "Content-Type": "application/json" };
  if (API_TOKEN) h["Authorization"] = `Bearer ${API_TOKEN}`;
  return { headers: h };
}

const profiles = {
  smoke: { options: { vus: 1, duration: "15s" } },
  load:  { options: { vus: 10, duration: "30s" } },
  stress:{ options: { vus: 50, duration: "30s" } }
};

export let options = profiles[TEST_TYPE]?.options || profiles.smoke.options;

function url(path) {
  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export default function () {
  const res = http.get(url(ENDPOINT), getHeaders());
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1);
}

// CI: apenas JSON
export function handleSummary(data) {
  return {
    "results/summary.json": JSON.stringify(data),
  };
}
