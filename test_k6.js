import http from "k6/http";
import { check, sleep } from "k6";
// k6-reporter bundle (gera HTML)
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

/*
Usage examples (local):
  TEST_TYPE=smoke BASE_URL=https://test-api.k6.io k6 run test_k6.js
  TEST_TYPE=load  BASE_URL=https://test-api.k6.io k6 run --summary-export=results/cli_summary.json test_k6.js
  TEST_TYPE=stress BASE_URL=https://test-api.k6.io k6 run --summary-export=results/cli_summary.json test_k6.js

Env vars:
  TEST_TYPE: smoke | load | stress (default: smoke)
  BASE_URL: base url of your API (default: https://test-api.k6.io)
  API_TOKEN: optional Bearer token for auth
  ENDPOINT: optional endpoint path (default: /public/crocodiles/)
*/

const TEST_TYPE = __ENV.TEST_TYPE || "smoke";
const BASE_URL = __ENV.BASE_URL || "https://test-api.k6.io";
const ENDPOINT = __ENV.ENDPOINT || "/public/crocodiles/"; // change to your path
const API_TOKEN = __ENV.API_TOKEN || ""; // optional

// reusable headers (add Authorization only if provided)
function getHeaders() {
  const h = { "Content-Type": "application/json" };
  if (API_TOKEN) h["Authorization"] = `Bearer ${API_TOKEN}`;
  return { headers: h };
}

// profiles per TEST_TYPE
const profiles = {
  smoke: {
    // simple smoke: few VUs, short duration
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
    // ramp-up, sustain, cool down
    options: {
      stages: [
        { duration: "15s", target: 5 },
        { duration: "30s", target: 10 },
        { duration: "1m",  target: 20 },
        { duration: "30s", target: 0 }
      ],
      thresholds: {
        http_req_failed: ["rate<0.05"],
        http_req_duration: ["p(95)<1000"]
      }
    }
  },
  stress: {
    // aggressive ramp-up to find breaking point
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
        // relax thresholds because stress's purpose is to find failure points
        http_req_failed: ["rate<0.20"],
        http_req_duration: ["p(95)<3000"]
      }
    }
  }
};

// apply selected profile (fallback to smoke if unknown)
let selected = profiles[TEST_TYPE] || profiles.smoke;
export let options = selected.options;

// tagging (useful for metrics filtering)
options.tags = { project: "performance-testing-k6", phase: TEST_TYPE };

// Helper: full URL
function url(path) {
  // ensure no double slash
  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

// Business scenario: single endpoint GET (extendable)
export default function () {
  const res = http.get(url(ENDPOINT), getHeaders());

  // checks: basic health + body non-empty
  check(res, {
    "status is 200": (r) => r.status === 200,
    "body not empty": (r) => r.body && r.body.length > 0
  });

  // realistic pause between user actions
  sleep(1);
}

// handleSummary writes JSON + HTML report files into ./results
export function handleSummary(data) {
  // ensure folder exists (k6 will create automatically usually, but safe)
  // return object of path->content
  return {
    "results/summary.json": JSON.stringify(data, null, 2),
    "results/summary.html": htmlReport(data)
  };
}
