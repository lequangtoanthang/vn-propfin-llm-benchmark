# Changelog

All notable changes to `@toanthang/vn-propfin-llm-benchmark` are documented in this file.

## [1.0.2] - 2026-11-10
### Added
- Interactive Ground-Truth Dataset Explorer in `web-dashboard/` (deployed at https://toanthang.me/research).
- Reference evaluation baselines comparing Zero-Shot, Standard Long-Context RAG, and Claude + `CashflowVerifier` tool-assisted verification.
- Expanded `CashflowVerifier.computePostGraceAmortization` for 24-month 0% HTLS + principal grace period schedules.

## [1.0.1] - 2026-11-01
### Added
- Statutory citation grounding instances for Vietnam Land Law 2024 and Real Estate Business Law 2023 (`VN-LAW-2026-006`).
- Vitest unit test suite (`tests/verifier.test.ts`) and GitHub Actions CI workflow.

## [1.0.0] - 2026-10-21
### Added
- Initial release of `VN-PropFin-Eval` JSON schema (`data/schema.json`) and curated sample dataset (`data/ground_truth_policies_sample.json`).
- Deterministic `CashflowVerifier` (`src/cashflow_verifier.ts`) and `CitationEval` (`src/evaluator.ts`).
