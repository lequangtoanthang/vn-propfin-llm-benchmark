import { describe, it, expect } from "vitest";
import { CashflowVerifier } from "../src/cashflow_verifier.js";
import { CitationEval, BenchmarkInstance } from "../src/evaluator.js";
import sampleData from "../data/ground_truth_policies_sample.json";

describe("CashflowVerifier deterministic financial calculations", () => {
  it("computes VN-FIN-2026-001 upfront + ACT/365 early payment discount accurately", () => {
    const res = CashflowVerifier.computeEarlyPayment({
      basePriceVnd: 10_000_000_000,
      upfrontDiscountRate: 0.095,
      earlyCashflowAnnualRate: 0.11,
      earlyPaymentDays: 300,
      earlyPaymentRatio: 0.70,
    });
    expect(res.priceAfterUpfrontVnd).toBe(9_050_000_000);
    expect(res.earlyCashflowDiscountVnd).toBe(632_876_712);
    expect(res.netPayablePreVatVnd).toBe(8_417_123_288);
  });

  it("computes VN-FIN-2026-002 deferred construction land-only discount and 0.5% low-rise KPBT", () => {
    const res = CashflowVerifier.computeDeferredConstruction({
      landPricePreVatVnd: 15_000_000_000,
      constructionPricePreVatVnd: 5_000_000_000,
      landDiscountRate: 0.065,
      isLowRise: true,
    });
    expect(res.landDiscountAmountVnd).toBe(975_000_000);
    expect(res.netPricePreVatVnd).toBe(19_025_000_000);
    expect(res.kpbtAmountVnd).toBe(95_125_000);
  });

  it("computes VN-FIN-2026-004 24-month grace period and month-25 amortization", () => {
    const res = CashflowVerifier.computePostGraceAmortization({
      loanPrincipalVnd: 7_000_000_000,
      totalTermMonths: 240,
      gracePeriodMonths: 24,
      postGraceAnnualInterestRate: 0.12,
    });
    expect(res.monthlyPaymentDuringGraceVnd).toBe(0);
    expect(res.remainingTermMonths).toBe(216);
    expect(res.firstPostGraceMonthPrincipalVnd).toBe(32_407_407);
    expect(res.firstPostGraceMonthInterestVnd).toBe(70_000_000);
    expect(res.firstPostGraceMonthTotalVnd).toBe(102_407_407);
  });
});

describe("CitationEval strict citation & hallucination scoring", () => {
  const dataset = sampleData as unknown as BenchmarkInstance[];

  it("awards 100% SCP and passes ZHR when required citations are grounded and no forbidden claims exist", () => {
    const item = dataset[0];
    const score = CitationEval.scoreInstance(item, {
      test_id: item.test_id,
      response_text:
        "Khách hàng được hưởng chiết khấu 9.5% trên giá gốc trước VAT và KPBT và chiết khấu dòng tiền 11%/năm tính trên số tiền và số ngày thanh toán trước hạn. Số tiền thực thanh toán là 8,417,123,288 VNĐ.",
      predicted_numbers: {
        net_payable_pre_vat_vnd: 8_417_123_288,
      },
    });
    expect(score.strictCitationPrecision).toBe(1);
    expect(score.zeroHallucinationPassed).toBe(true);
    expect(score.amortizationExactMatch).toBe(true);
  });

  it("flags forbidden hallucination when mutually exclusive policies are combined", () => {
    const item = dataset[0];
    const score = CitationEval.scoreInstance(item, {
      test_id: item.test_id,
      response_text:
        "Khách hàng được hưởng đồng thời hỗ trợ lãi suất 0% và chiết khấu thanh toán sớm 9.5%.",
      predicted_numbers: {
        net_payable_pre_vat_vnd: 8_000_000_000,
      },
    });
    expect(score.zeroHallucinationPassed).toBe(false);
    expect(score.amortizationExactMatch).toBe(false);
  });
});
