export interface StockPricesModel {
    symbol: string;
    name: string;
    price: number;
    changesPercentage: number;
    change: number;
    dayLow: number;
    dayHigh: number;
    yearHigh: number;
    yearLow: number;
    marketCap: number;
    priceAvg50: number;
    priceAvg200: number;
    volume: number;
    avgVolume: number;
    exchange: string;
    open: number;
    previousClose: number;
    eps: number;
    pe: number;
    earningsAnnouncement: string;
    sharesOutstanding: number;
    timestamp: number;
}

export interface StockMarketsModel {
    GSPC: StockPricesModel;
    DJI: StockPricesModel;
    IXIC: StockPricesModel;
    VIX: StockPricesModel;
}
