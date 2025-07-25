import { StockPricesModel } from './stock-prices.model';

export interface StockMarketsMoversModel {
    symbol: string;
    companyName: string;
    marketCap: number;
    sector: string;
    industry: string;
    beta: number;
    price: number;
    lastAnnualDividend: number;
    volume: number;
    exchange: string;
    exchangeShortName: string;
    country: string;
    isEtf: boolean;
    isActivelyTrading: boolean;
    stockPrice?: StockPricesModel;
}
