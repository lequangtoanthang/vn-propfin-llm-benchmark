/**
 * Model Context Protocol (MCP) JSON-RPC Tool Handler for VN-PropFin-Eval
 * Exposes deterministic financial verification (CashflowVerifier) and statutory
 * citation verification (CitationEval) as callable tools for Claude Code & Claude Desktop.
 */

import { CashflowVerifier, EarlyPaymentParams, DeferredConstructionParams, GracePeriodAmortizationParams } from "./cashflow_verifier.js";
import { CitationEval, BenchmarkInstance, ModelCandidateOutput } from "./evaluator.js";

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export const VN_PROPFIN_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: "verify_early_payment_cashflow",
    description:
      "Deterministically computes upfront discount and ACT/365 early-payment cashflow discount in VND to prevent LLM arithmetic drift.",
    inputSchema: {
      type: "object",
      required: [
        "basePriceVnd",
        "upfrontDiscountRate",
        "earlyCashflowAnnualRate",
        "earlyPaymentDays",
        "earlyPaymentRatio",
      ],
      properties: {
        basePriceVnd: { type: "number", description: "Base property price before VAT & KPBT in VND" },
        upfrontDiscountRate: { type: "number", description: "Upfront early-payment discount rate (e.g., 0.095 for 9.5%)" },
        earlyCashflowAnnualRate: { type: "number", description: "Annualized cashflow discount rate (e.g., 0.11 for 11%/year)" },
        earlyPaymentDays: { type: "integer", description: "Weighted average early payment days (ACT/365)" },
        earlyPaymentRatio: { type: "number", description: "Prepaid principal ratio (e.g., 0.70)" },
      },
    },
  },
  {
    name: "verify_deferred_construction_kpbt",
    description:
      "Computes split land vs. construction discount and statutory KPBT maintenance fee (0.5% low-rise / 2.0% high-rise).",
    inputSchema: {
      type: "object",
      required: ["landPricePreVatVnd", "constructionPricePreVatVnd", "landDiscountRate", "isLowRise"],
      properties: {
        landPricePreVatVnd: { type: "number" },
        constructionPricePreVatVnd: { type: "number" },
        landDiscountRate: { type: "number" },
        isLowRise: { type: "boolean" },
      },
    },
  },
  {
    name: "verify_post_grace_amortization",
    description:
      "Computes equal-principal monthly payment immediately following a 0% interest subsidy and principal grace period (HTLS).",
    inputSchema: {
      type: "object",
      required: ["loanPrincipalVnd", "totalTermMonths", "gracePeriodMonths", "postGraceAnnualInterestRate"],
      properties: {
        loanPrincipalVnd: { type: "number" },
        totalTermMonths: { type: "integer" },
        gracePeriodMonths: { type: "integer" },
        postGraceAnnualInterestRate: { type: "number" },
      },
    },
  },
];

export function executeMcpToolCall(name: string, args: unknown): unknown {
  switch (name) {
    case "verify_early_payment_cashflow":
      return CashflowVerifier.computeEarlyPayment(args as EarlyPaymentParams);
    case "verify_deferred_construction_kpbt":
      return CashflowVerifier.computeDeferredConstruction(args as DeferredConstructionParams);
    case "verify_post_grace_amortization":
      return CashflowVerifier.computePostGraceAmortization(args as GracePeriodAmortizationParams);
    default:
      throw new Error(`Unknown MCP tool: ${name}`);
  }
}
