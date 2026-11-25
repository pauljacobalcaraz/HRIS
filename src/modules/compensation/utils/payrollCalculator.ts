/**
 * DEMO CALCULATIONS ONLY.
 * These formulas are simplified approximations for demonstration purposes.
 * They are NOT official payroll, tax, or government contribution computations
 * and must never be used for actual payroll processing.
 */

export interface PayrollComputationInput {
  basicPay: number
  allowances: number
  overtimeHours: number
  hourlyRate: number
}

export interface PayrollComputationResult {
  basicPay: number
  allowances: number
  overtimePay: number
  grossPay: number
  sssContribution: number
  philHealthContribution: number
  pagIbigContribution: number
  withholdingTax: number
  totalDeductions: number
  netPay: number
}

const OVERTIME_MULTIPLIER = 1.25

export function computeOvertimePay(hourlyRate: number, overtimeHours: number): number {
  return Math.round(hourlyRate * OVERTIME_MULTIPLIER * overtimeHours * 100) / 100
}

/** Simplified flat-rate approximation of an SSS employee contribution bracket table. */
export function computeSssContribution(basicPay: number): number {
  const capped = Math.min(basicPay, 30000)
  return Math.round(capped * 0.045 * 100) / 100
}

/** Simplified flat 2.5% employee share, capped at a demo ceiling. */
export function computePhilHealthContribution(basicPay: number): number {
  const capped = Math.min(basicPay, 100000)
  return Math.round(capped * 0.025 * 100) / 100
}

/** Simplified flat 2% employee share, capped at a demo ceiling. */
export function computePagIbigContribution(basicPay: number): number {
  const capped = Math.min(basicPay, 10000)
  return Math.round(capped * 0.02 * 100) / 100
}

/** Simplified progressive bracket table loosely modeled on withholding tax tiers. */
export function computeWithholdingTax(taxableIncome: number): number {
  if (taxableIncome <= 20833) return 0
  if (taxableIncome <= 33332) return (taxableIncome - 20833) * 0.15
  if (taxableIncome <= 66666) return 1875 + (taxableIncome - 33332) * 0.2
  if (taxableIncome <= 166666) return 8541.8 + (taxableIncome - 66666) * 0.25
  if (taxableIncome <= 666666) return 33541.8 + (taxableIncome - 166666) * 0.3
  return 183541.8 + (taxableIncome - 666666) * 0.35
}

export function compute13thMonthEstimate(monthlyBasicPay: number): number {
  return Math.round(monthlyBasicPay * 100) / 100
}

export function computePayroll({ basicPay, allowances, overtimeHours, hourlyRate }: PayrollComputationInput): PayrollComputationResult {
  const overtimePay = computeOvertimePay(hourlyRate, overtimeHours)
  const grossPay = basicPay + allowances + overtimePay

  const sssContribution = computeSssContribution(basicPay)
  const philHealthContribution = computePhilHealthContribution(basicPay)
  const pagIbigContribution = computePagIbigContribution(basicPay)
  const taxableIncome = basicPay - sssContribution - philHealthContribution - pagIbigContribution
  const withholdingTax = Math.round(computeWithholdingTax(taxableIncome) * 100) / 100

  const totalDeductions =
    Math.round((sssContribution + philHealthContribution + pagIbigContribution + withholdingTax) * 100) / 100
  const netPay = Math.round((grossPay - totalDeductions) * 100) / 100

  return {
    basicPay,
    allowances,
    overtimePay,
    grossPay: Math.round(grossPay * 100) / 100,
    sssContribution,
    philHealthContribution,
    pagIbigContribution,
    withholdingTax,
    totalDeductions,
    netPay,
  }
}
