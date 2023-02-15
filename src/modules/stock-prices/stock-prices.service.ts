import { BadRequestException, CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { Cache } from 'cache-manager';

import { StockMarketsMoversModel } from './models/stock-markets.model';
import { StockMarketsModel, StockPricesModel } from './models/stock-prices.model';
@Injectable()
export class StockPricesService {
    private request: AxiosInstance;
    readonly ttl = 60 * 60;
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
                console.log('From api');
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
}
