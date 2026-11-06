# VN-PropFin-Eval: LLM Factuality & Citation Reliability Benchmark

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.2-green.svg)](https://github.com/lequangtoanthang/vn-propfin-llm-benchmark/releases)
[![Live Dashboard](https://img.shields.io/badge/Live_Research_Portal-toanthang.me%2Fresearch-orange)](https://toanthang.me/research)

**VN-PropFin-Eval** is an open-source evaluation harness and curated ground-truth dataset designed to measure **LLM factuality, citation fidelity, and multi-step financial reasoning** within high-stakes, non-English regulatory and real estate ecosystems.

🌐 **Interactive Research Portal & Leaderboard:** [https://toanthang.me/research](https://toanthang.me/research)

---

## 🎯 Problem Statement

While frontier Large Language Models excel at general English benchmarks (MMLU, GSM8K), they exhibit severe **citation hallucination** and **numerical drift** when applied to localized, contract-heavy domains such as Southeast Asian property law, tiered payment schedules, and floating-rate mortgage amortization.

Common failure modes in RAG and long-context deployments include:
1. **Phantom Citations:** Attributing fabricated clauses to real statutory codes (e.g., Vietnam Land Law 2024, Housing Law 2023, and Real Estate Business Law 2023).
2. **Temporal Policy Confusion:** Conflating historical developer sales policies across multiple project phases (2014–2026) or combining mutually exclusive incentives.
3. **Amortization Arithmetic Drift:** Failing to accurately compute principal grace periods (*ân hạn nợ gốc*), early-payment discount cascades (`ACT/365`), deferred construction split pricing (*giãn xây*), and interest rate subsidies over 24–36 month timelines.

`vn-propfin-llm-benchmark` provides a deterministic programmatic verifier and a longitudinal dataset curated from **12+ years of real-world transaction policies, regulatory statutes, and financial schedules** to benchmark and mitigate these failure modes.

---

## ✨ Key Features & Architecture

* **Longitudinal Ground-Truth Corpus (2014–2026):** Structured JSON schemas (`data/ground_truth_policies_sample.json` & `data/schema.json`) covering complex multi-tier sales policies, statutory legal articles, and multi-bank lending parameters.
* **Deterministic Financial Verifier (`CashflowVerifier`):** A TypeScript verification engine (`src/cashflow_verifier.ts`) that computes exact mathematical ground-truth for loan amortization, interest subsidies, KPBT maintenance fees, and NPV cashflow discounts to grade LLM-generated financial tables.
* **Strict Citation Attribution Scorer (`CitationEval`):** Evaluates (`src/evaluator.ts`) whether model outputs strictly ground every numerical claim and legal condition in the provided context window without extrapolating unsupported terms.
* **Multi-Model Evaluation Harness:** Native support for benchmarking **Anthropic Claude (Sonnet/Opus)** alongside competing frontier models under zero-shot, few-shot, and tool-use (MCP) configurations.

---

## 📂 Repository Structure

```text
vn-propfin-llm-benchmark/
├── data/
│   ├── ground_truth_policies_sample.json   # Curated ground-truth policy, cashflow & statutory QA instances
│   └── schema.json                         # JSON Schema Draft 2020-12 validation specification
├── src/
│   ├── index.ts                            # Public package exports
│   ├── evaluator.ts                        # Strict Citation Attribution Scorer & CLI harness
│   └── cashflow_verifier.ts                # Deterministic amortization, discount & KPBT verification engine
├── tests/
│   └── verifier.test.ts                    # Automated unit tests for financial & citation verifiers
├── web-dashboard/                          # Interactive research portal deployed at toanthang.me/research
├── LICENSE                                 # MIT License
├── package.json                            # NPM package manifest (@toanthang/vn-propfin-llm-benchmark)
└── README.md                               # Documentation
```

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/lequangtoanthang/vn-propfin-llm-benchmark.git
cd vn-propfin-llm-benchmark
npm install
```

### Running the Evaluation Suite

Set your API key and run the deterministic evaluation harness against the sample ground-truth dataset:

```bash
export ANTHROPIC_API_KEY="your-api-key"
npm run eval:sample
```

### Example Evaluation Output

| Metric | Description | Target Threshold |
| :--- | :--- | :--- |
| **Strict Citation Precision (SCP)** | % of cited clauses matching exact source document spans | `> 98.5%` |
| **Zero-Hallucination Rate (ZHR)** | Rate of responses with zero ungrounded policy claims | `> 99.0%` |
| **Amortization Exact Match (AEM)** | Numerical accuracy within ±0.01% across 36-month cashflow tables | `100.0%` |

---

## 🛣️ Open-Source Roadmap

- [x] **v1.0:** Release core evaluation schema, deterministic cashflow verifier, and web visualization portal ([toanthang.me/research](https://toanthang.me/research)).
- [ ] **v1.1:** Expand ground-truth dataset to 1,500+ annotated multi-document policy & regulatory QA pairs.
- [ ] **v1.2:** Publish Model Context Protocol (MCP) server for real-time financial & legal citation verification in agentic workflows.
- [ ] **v2.0:** Automated CI/CD regression testing pipeline for open-source RAG frameworks.

---

## 📄 License & Citation

Released under the **MIT License**. Free for academic research, commercial evaluation, and open-source adaptation.

If you use this benchmark or evaluation harness in your research, please cite:
```bibtex
@software{le2026vnpropfineval,
  author = {Le, Quang Toan Thang},
  title = {VN-PropFin-Eval: Benchmarking LLM Factuality, Citation Reliability, and Financial Reasoning in Emerging Markets},
  year = {2026},
  version = {1.0.2},
  url = {https://toanthang.me/research},
  repository = {https://github.com/lequangtoanthang/vn-propfin-llm-benchmark}
}
```
