import { BadRequestException, CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Cache } from 'cache-manager';

import {
    FinancialBars,
    FinancialBubbles,
    FinancialPriceArea,
    FinancialResume,
    FinancialUpgrades,
} from './models/stock-financial-summary.model';
import { StockMarketsMoversModel } from './models/stock-markets.model';
import { StockMarketsModel, StockPricesModel } from './models/stock-prices.model';
import { StockFinancialRatios } from './models/stock-ticker.model';
import * as dayjs from 'dayjs';
@Injectable()
export class StockPricesService {
    private request: AxiosInstance;
    readonly ttl = 60 * 60;
    readonly dayTtl = 60 * 60 * 24;
    readonly quotesPrices = 'QUOTES_PRICES';
    readonly marketsMovers = 'MARKETS_MOVERS';
    constructor(
        readonly configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {
        this.request = axios.create({
            baseURL: this.configService.get('FMP_URL'),
            params: { apikey: this.configService.get('FMP_API_KEY') },
        });
    }

    async getStockPrices(): Promise<StockPricesModel[]> {
        try {
            let cache = await this.cacheManager.get(this.quotesPrices);

            if (!cache) {
                const { data }: { data: StockPricesModel[] } = await this.request.get('/quotes/index');

                await this.cacheManager.set(this.quotesPrices, data, this.ttl);
                cache = await this.cacheManager.get(this.quotesPrices);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get stock prices", e.message);
        }
    }

    async getMartketsPrices(): Promise<StockMarketsModel> {
        try {
            let data: StockPricesModel[] = await this.cacheManager.get(this.quotesPrices);

            if (!data) {
                data = await this.getStockPrices();
            }

            const GSPC = data.find((item) => item.symbol === '^GSPC');
            const DJI = data.find((item) => item.symbol === '^DJI');
            const IXIC = data.find((item) => item.symbol === '^IXIC');
            const VIX = data.find((item) => item.symbol === '^VIX');

            return {
                GSPC,
                DJI,
                IXIC,
                VIX,
            };
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get market prices", e.message);
        }
    }

    async getMarketsMovers(exchange: string, limit: number): Promise<StockMarketsMoversModel[]> {
        try {
            let cache: StockMarketsMoversModel[] = await this.cacheManager.get(`${this.marketsMovers}_${exchange}`);

            if (!cache) {
                const { data }: { data: StockMarketsMoversModel[] } = await this.request.get('/stock-screener', {
                    params: { exchange, limit },
                });

                const symbolsList = data.map((item) => item.symbol);

                const quotes = await this.getStockQuotesBySymbols(symbolsList, exchange);

                const result = data.map((item, index) => {
                    return { ...item, stockPrice: quotes.find((q) => q.symbol === item.symbol) || null };
                });

                await this.cacheManager.set(`${this.marketsMovers}_${exchange}`, result, this.ttl);
                cache = await this.cacheManager.get(`${this.marketsMovers}_${exchange}`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get market movers prices", e.message);
        }
    }

    async getStockQuotesBySymbols(symbols: string[], exchange: string): Promise<StockPricesModel[]> {
        try {
            let cache: StockPricesModel[] = await this.cacheManager.get(`${this.marketsMovers}_${exchange}_SYMBOLS`);

            if (!cache) {
                const { data }: { data: StockPricesModel[] } = await this.request.get(`/quote/${symbols.join(',')}`);

                await this.cacheManager.set(`${this.marketsMovers}_${exchange}_SYMBOLS`, data, this.ttl);
                cache = await this.cacheManager.get(`${this.marketsMovers}_${exchange}_SYMBOLS`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get stock quotes by symbols", e.message);
        }
    }

    async getForexPrices(): Promise<StockPricesModel[]> {
        try {
            let cache: StockPricesModel[] = await this.cacheManager.get('FOREX_PRICES');

            if (!cache) {
                const { data }: { data: StockPricesModel[] } = await this.request.get('/quotes/forex');

                const ordered = data.sort((a, b) => Math.random() - 0.5);

                await this.cacheManager.set('FOREX_PRICES', ordered, this.ttl);
                cache = await this.cacheManager.get('FOREX_PRICES');
            }

            return cache;
        } catch (e) {
            throw new BadRequestException("Couldn't get forex prices", e.message);
        }
    }

    async getFinancialRatios(symbol: string): Promise<StockFinancialRatios> {
        try {
            let cache: StockFinancialRatios = await this.cacheManager.get(`${symbol}_FINANCIAL_RATIOS`);

            if (!cache) {
                const { data: financialData }: { data: StockFinancialRatios[] } = await this.request.get(
                    `/ratios-ttm/${symbol}`,
                );

                await this.cacheManager.set(`${symbol}_FINANCIAL_RATIOS`, financialData[0], this.dayTtl);
                cache = await this.cacheManager.get(`${symbol}_FINANCIAL_RATIOS`);
            }

            return cache;
        } catch (e) {
            throw new BadRequestException("Couldn't get financial ratios", e.message);
        }
    }

    async getStockPricesBySymbol(symbol: string): Promise<StockPricesModel> {
        try {
            let cache = await this.cacheManager.get(`${symbol}_${this.quotesPrices}`);

            if (!cache) {
                const { data }: { data: StockPricesModel[] } = await this.request.get(`/quote/${symbol}`);

                await this.cacheManager.set(`${symbol}_${this.quotesPrices}`, data[0], this.ttl);
                cache = await this.cacheManager.get(`${symbol}_${this.quotesPrices}`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get stock prices", e.message);
        }
    }

    async getFinancialStatementSymbolLists(): Promise<{ name: string; symbol: string }[]> {
        try {
            let cache = await this.cacheManager.get('FINANCIAL_STATEMENT_SYMBOLS');

            if (!cache) {
                const { data }: { data: { name: string; symbol: string }[] } = await this.request.get(
                    '/available-traded/list',
                );

                const list = data
                    .map((item) => {
                        return { name: `${item.name} - ${item.symbol}`, symbol: item.symbol };
                    })
                    .sort((a, b) => Math.random() - 0.5);

                await this.cacheManager.set('FINANCIAL_STATEMENT_SYMBOLS', list, this.dayTtl);
                cache = await this.cacheManager.get('FINANCIAL_STATEMENT_SYMBOLS');
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get financial statement symbols", e.message);
        }
    }

    async getFinancialResume(symbol: string): Promise<FinancialResume> {
        try {
            let cache = await this.cacheManager.get(`${symbol}_FINANCIAL_RESUME`);

            if (!cache) {
                const { data: dataRating } = await this.request.get(`/rating/${symbol}`);
                const { data: dataList1 } = await this.request.get(`/profile/${symbol}`);
                const { data: dataList2 } = await axios.get(
                    `https://financialmodelingprep.com/api/v4/price-target-consensus`,
                    { params: { symbol, apikey: this.configService.get('FMP_API_KEY') } },
                );
                const { data: dataList3 } = await this.request.get(`/key-metrics-ttm/${symbol}`, {
                    params: { limit: 1 },
                });

                const financialResume = new FinancialResume();

                financialResume.ratingScore = dataRating[0]?.ratingScore || '-';
                financialResume.ratingRecommendation = dataRating[0]?.ratingRecommendation || '-';
                financialResume.symbol = dataList1[0]?.symbol || '-';
                financialResume.price = dataList1[0]?.price || '-';
                financialResume.beta = dataList1[0]?.beta || '-';
                financialResume.mktCap = dataList1[0]?.mktCap || '-';
                financialResume.range = dataList1[0]?.range || '-';
                financialResume.sector = dataList1[0]?.sector || '-';
                financialResume.targetHigh = dataList2[0]?.targetHigh || '-';
                financialResume.targetLow = dataList2[0]?.targetLow || '-';
                financialResume.targetConsensus = dataList2[0]?.targetConsensus || '-';
                financialResume.roe = dataList3[0]?.roeTTM || '-';
                financialResume.roa = dataList3[0]?.returnOnTangibleAssetsTTM || '-';
                financialResume.debtEquity = dataList3[0]?.debtToEquityTTM || '-';
                financialResume.pe = dataList3[0]?.peRatioTTM || '-';
                financialResume.pb = dataList3[0]?.pbRatioTTM || '-';
                financialResume.roeRecommendation = dataRating[0]?.ratingDetailsROERecommendation || '-';
                financialResume.roaRecommendation = dataRating[0]?.ratingDetailsROARecommendation || '-';
                financialResume.debtEquityRecommendation = dataRating[0]?.ratingDetailsDERecommendation || '-';
                financialResume.peRecommendation = dataRating[0]?.ratingDetailsPERecommendation || '-';
                financialResume.pbRecommendation = dataRating[0]?.ratingDetailsPBRecommendation || '-';

                await this.cacheManager.set(`${symbol}_FINANCIAL_RESUME`, financialResume, this.dayTtl);
                cache = await this.cacheManager.get(`${symbol}_FINANCIAL_RESUME`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get financial resume", e.message);
        }
    }

    async getFinancialBars(symbol: string): Promise<FinancialBars> {
        try {
            let cache = await this.cacheManager.get(`${symbol}_FINANCIAL_BARS`);

            if (!cache) {
                const { data: dataAnnual } = await this.request.get(`/income-statement/${symbol}`, {
                    params: { limit: 5 },
                });
                const { data: dataQuarterly } = await this.request.get(`/income-statement/${symbol}`, {
                    params: { limit: 5, period: 'quarter' },
                });

                const financialBars = new FinancialBars();
                financialBars.annual = dataAnnual;
                financialBars.quarterly = dataQuarterly;

                await this.cacheManager.set(`${symbol}_FINANCIAL_BARS`, financialBars, this.dayTtl);
                cache = await this.cacheManager.get(`${symbol}_FINANCIAL_BARS`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get financial bars", e.message);
        }
    }

    async getFinancialBubbles(symbol: string): Promise<FinancialBubbles[]> {
        try {
            let cache = await this.cacheManager.get(`${symbol}_FINANCIAL_BUBBLES`);

            if (!cache) {
                const { data } = await this.request.get(`/earnings-surprises/${symbol}`, { params: { limit: 5 } });

                await this.cacheManager.set(`${symbol}_FINANCIAL_BUBBLES`, data, this.dayTtl);
                cache = await this.cacheManager.get(`${symbol}_FINANCIAL_BUBBLES`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get financial bubbles", e.message);
        }
    }

    async getFinancialUpgrades(symbol: string): Promise<FinancialUpgrades[]> {
        try {
            let cache = await this.cacheManager.get(`${symbol}_FINANCIAL_UPGRADES`);

            if (!cache) {
                const { data } = await axios.get(`https://financialmodelingprep.com/api/v4/upgrades-downgrades`, {
                    params: { symbol, apikey: this.configService.get('FMP_API_KEY') },
                });

                await this.cacheManager.set(`${symbol}_FINANCIAL_UPGRADES`, data, this.dayTtl);
                cache = await this.cacheManager.get(`${symbol}_FINANCIAL_UPGRADES`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get financial upgrades", e.message);
        }
    }

    async getFinancialPriceArea(symbol: string, mode: string): Promise<FinancialPriceArea[]> {
        try {
            let cache = await this.cacheManager.get(`${symbol}_${mode}_FINANCIAL_PRICE_AREA`);

            if (!cache) {
                const type = mode === 'daily' ? '1min' : '1day';
                const from = mode === 'daily' ? dayjs().subtract(1, 'day').format('YYYY-MM-DD') : null;

                const { data } = await this.request.get(`/historical-chart/${type}/${symbol}`, {
                    params: { from },
                });

                await this.cacheManager.set(`${symbol}_${mode}_FINANCIAL_PRICE_AREA`, data, this.dayTtl);
                cache = await this.cacheManager.get(`${symbol}_${mode}_FINANCIAL_PRICE_AREA`);
            }

            return cache;
        } catch (e) {
            throw new InternalServerErrorException("Couldn't get financial price area", e.message);
        }
    }
}
