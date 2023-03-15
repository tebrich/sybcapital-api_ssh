import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StockPricesService } from './stock-prices.service';

@Controller('stock-prices')
@ApiTags('Stock Prices')
export class StockPricesController {
    constructor(private readonly stockPricesService: StockPricesService) {}

    @Get()
    async getStockPrices() {
        return await this.stockPricesService.getStockPrices();
    }

    @Get('/markets')
    async getMarketsPrices() {
        return await this.stockPricesService.getMartketsPrices();
    }

    @Get('/movers')
    async getMakertsMovers(@Query('exchange') exchange: string, @Query('limit', ParseIntPipe) limit: number) {
        return await this.stockPricesService.getMarketsMovers(exchange, limit);
    }

    @Get('/forex')
    async getForexPrices() {
        return await this.stockPricesService.getForexPrices();
    }

    @Get('/financial-ratios/:symbol')
    async getFinancialRatios(@Param('symbol') symbol: string) {
        return await this.stockPricesService.getFinancialRatios(symbol);
    }

    @Get('/stock/:symbol')
    async getStockPricesBySymbol(@Param('symbol') symbol: string) {
        return await this.stockPricesService.getStockPricesBySymbol(symbol);
    }

    @Get('/financial-symbol-lists')
    async getFinancialStatementSymbolLists() {
        return await this.stockPricesService.getFinancialStatementSymbolLists();
    }

    @Get('/financial-resume/:symbol')
    async getFinancialResume(@Param('symbol') symbol: string) {
        return await this.stockPricesService.getFinancialResume(symbol);
    }

    @Get('/financial-bars/:symbol')
    async getFinancialBars(@Param('symbol') symbol: string) {
        return await this.stockPricesService.getFinancialBars(symbol);
    }

    @Get('/financial-bubbles/:symbol')
    async getFinancialBubbles(@Param('symbol') symbol: string) {
        return await this.stockPricesService.getFinancialBubbles(symbol);
    }

    @Get('/financial-upgrades/:symbol')
    async getFinancialUpgrades(@Param('symbol') symbol: string) {
        return await this.stockPricesService.getFinancialUpgrades(symbol);
    }

    @Get('/financial-price-area/:symbol')
    getFinancialPriceArea(@Param('symbol') symbol: string, @Query('mode') mode: string) {
        return this.stockPricesService.getFinancialPriceArea(symbol, mode);
    }
}
