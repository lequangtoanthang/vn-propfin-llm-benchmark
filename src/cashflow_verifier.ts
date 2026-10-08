/**
 * Deterministic Financial & Amortization Verifier for VN-PropFin-Eval
 * Computes exact mathematical ground truth for Vietnamese real estate payment schedules,
 * upfront/early-payment cashflow discounts (ACT/365), split deferred-construction pricing,
 * KPBT maintenance fees, and post-subsidy floating-rate loan amortization.
 */

export interface EarlyPaymentParams {
  basePriceVnd: number;
  upfrontDiscountRate: number;
  earlyCashflowAnnualRate: number;
  earlyPaymentDays: number;
  earlyPaymentRatio: number;
}

export interface EarlyPaymentResult {
  basePriceVnd: number;
  priceAfterUpfrontVnd: number;
  earlyCashflowDiscountVnd: number;
  netPayablePreVatVnd: number;
}

export interface DeferredConstructionParams {
  landPricePreVatVnd: number;
  constructionPricePreVatVnd: number;
  landDiscountRate: number;
  isLowRise: boolean;
}

export interface DeferredConstructionResult {
  landDiscountAmountVnd: number;
  netPricePreVatVnd: number;
  kpbtRate: number;
  kpbtAmountVnd: number;
}

export interface GracePeriodAmortizationParams {
  loanPrincipalVnd: number;
  totalTermMonths: number;
  gracePeriodMonths: number;
  postGraceAnnualInterestRate: number;
}

export interface GracePeriodAmortizationResult {
  monthlyPaymentDuringGraceVnd: number;
  remainingTermMonths: number;
  firstPostGraceMonthPrincipalVnd: number;
  firstPostGraceMonthInterestVnd: number;
  firstPostGraceMonthTotalVnd: number;
}

export class CashflowVerifier {
  /**
   * Computes exact net payable amount under upfront discount + ACT/365 early-payment cashflow discount.
   */
  static computeEarlyPayment(params: EarlyPaymentParams): EarlyPaymentResult {
    const priceAfterUpfrontVnd = Math.round(
      params.basePriceVnd * (1 - params.upfrontDiscountRate)
    );
    const earlyPrepaidPrincipal = params.basePriceVnd * params.earlyPaymentRatio;
    const earlyCashflowDiscountVnd = Math.round(
      (earlyPrepaidPrincipal * params.earlyCashflowAnnualRate * params.earlyPaymentDays) / 365
    );
    const netPayablePreVatVnd = priceAfterUpfrontVnd - earlyCashflowDiscountVnd;

    return {
      basePriceVnd: params.basePriceVnd,
      priceAfterUpfrontVnd,
      earlyCashflowDiscountVnd,
      netPayablePreVatVnd,
    };
  }

  /**
   * Computes deferred construction (giãn xây) net price where discount applies strictly to land value,
   * and KPBT (0.5% low-rise / 2.0% high-rise) applies to total post-discount pre-VAT price.
   */
  static computeDeferredConstruction(
    params: DeferredConstructionParams
  ): DeferredConstructionResult {
    const landDiscountAmountVnd = Math.round(
      params.landPricePreVatVnd * params.landDiscountRate
    );
    const netLandPrice = params.landPricePreVatVnd - landDiscountAmountVnd;
    const netPricePreVatVnd = netLandPrice + params.constructionPricePreVatVnd;
    const kpbtRate = params.isLowRise ? 0.005 : 0.02;
    const kpbtAmountVnd = Math.round(netPricePreVatVnd * kpbtRate);

    return {
      landDiscountAmountVnd,
      netPricePreVatVnd,
      kpbtRate,
      kpbtAmountVnd,
    };
  }

  /**
   * Computes equal-principal amortization schedule after a 0% interest & principal grace period (HTLS).
   */
  static computePostGraceAmortization(
    params: GracePeriodAmortizationParams
  ): GracePeriodAmortizationResult {
    const remainingTermMonths = params.totalTermMonths - params.gracePeriodMonths;
    if (remainingTermMonths <= 0) {
      throw new Error("Grace period cannot exceed or equal total loan term.");
    }
    const firstPostGraceMonthPrincipalVnd = Math.round(
      params.loanPrincipalVnd / remainingTermMonths
    );
    const monthlyRate = params.postGraceAnnualInterestRate / 12;
    const firstPostGraceMonthInterestVnd = Math.round(
      params.loanPrincipalVnd * monthlyRate
    );

    return {
      monthlyPaymentDuringGraceVnd: 0,
      remainingTermMonths,
      firstPostGraceMonthPrincipalVnd,
      firstPostGraceMonthInterestVnd,
      firstPostGraceMonthTotalVnd:
        firstPostGraceMonthPrincipalVnd + firstPostGraceMonthInterestVnd,
    };
  }

  /**
   * Verifies whether an LLM-reported numerical value matches ground truth within ±0.01% (0.0001).
   */
  static isExactMatch(
    predictedValue: number,
    groundTruthValue: number,
    relativeTolerance = 0.0001
  ): boolean {
    if (groundTruthValue === 0) {
      return Math.abs(predictedValue) === 0;
    }
    const relError = Math.abs(predictedValue - groundTruthValue) / Math.abs(groundTruthValue);
    return relError <= relativeTolerance;
  }
}
