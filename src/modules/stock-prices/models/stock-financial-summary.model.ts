export class FinancialResume {
    ratingScore: number;
    ratingRecommendation: string;
    symbol: string;
    price: number;
    beta: number;
    mktCap: number;
    range: number;
    sector: string;
    targetHigh: number;
    targetLow: number;
    targetConsensus: number;
    roe: number;
    roeRecommendation: string;
    roa: number;
    roaRecommendation: string;
    debtEquity: number;
    debtEquityRecommendation: string;
    pe: number;
    peRecommendation: string;
    pb: number;
    pbRecommendation: string;
}

export class FinancialBarsValue {
    date: string;
    symbol: string;
    reportedCurrency: string;
    cik: string;
    fillingDate: string;
    acceptedDate: string;
    calendarYear: string;
    period: string;
    revenue: number;
    costOfRevenue: number;
    grossProfit: number;
    grossProfitRatio: number;
    researchAndDevelopmentExpenses: number;
    generalAndAdministrativeExpenses: number;
    sellingAndMarketingExpenses: number;
    sellingGeneralAndAdministrativeExpenses: number;
    otherExpenses: number;
    operatingExpenses: number;
    costAndExpenses: number;
    interestIncome: number;
    interestExpense: number;
    depreciationAndAmortization: number;
    ebitda: number;
    ebitdaratio: number;
    operatingIncome: number;
    operatingIncomeRatio: number;
    totalOtherIncomeExpensesNet: number;
    incomeBeforeTax: number;
    incomeBeforeTaxRatio: number;
    incomeTaxExpense: number;
    netIncome: number;
    netIncomeRatio: number;
    eps: number;
    epsdiluted: number;
    weightedAverageShsOut: number;
    weightedAverageShsOutDil: number;
    link: string;
    finalLink: string;
}

export class FinancialBars {
    annual: FinancialBarsValue[];
    quarterly: FinancialBarsValue[];
}

export interface FinancialBubbles {
    date: string;
    symbol: string;
    actualEarningResult: number;
    estimatedEarning: number;
}

export interface FinancialUpgrades {
    symbol: string;
    publishedDate: string;
    newsURL: string;
    newsTitle: string;
    newsBaseURL: string;
    newsPublisher: string;
    newGrade: string;
    previousGrade: string;
    gradingCompany: string;
    action: string;
    priceWhenPosted: number;
}

export class FinancialPriceArea {
    date: Date;
    open: number;
    low: number;
    high: number;
    close: number;
    volume: number;
}
export class FinancialAnalyticsData {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    sma?: number;
    williams?: number;
    rsi?: number;
    adx?: number;
    standardDeviation?: number;
}

export class FinancialAnalytics {
    SmaMin: FinancialAnalyticsData;
    Sma1: FinancialAnalyticsData;
    Sma4: FinancialAnalyticsData;
    Sma24: FinancialAnalyticsData;
    WilliamsMin: FinancialAnalyticsData;
    Williams1: FinancialAnalyticsData;
    Williams4: FinancialAnalyticsData;
    Williams24: FinancialAnalyticsData;
    RsiMin: FinancialAnalyticsData;
    Rsi1: FinancialAnalyticsData;
    Rsi4: FinancialAnalyticsData;
    Rsi24: FinancialAnalyticsData;
    AdxMin: FinancialAnalyticsData;
    Adx1: FinancialAnalyticsData;
    Adx4: FinancialAnalyticsData;
    Adx24: FinancialAnalyticsData;
    DsMin: FinancialAnalyticsData;
    Ds1: FinancialAnalyticsData;
    Ds4: FinancialAnalyticsData;
    Ds24: FinancialAnalyticsData;
}
