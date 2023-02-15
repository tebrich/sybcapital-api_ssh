import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
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
}
