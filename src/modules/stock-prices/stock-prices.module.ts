import { CacheModule, Module } from '@nestjs/common';

import { StockPricesController } from './stock-prices.controller';
import { StockPricesService } from './stock-prices.service';

@Module({
    imports: [CacheModule.register()],
    controllers: [StockPricesController],
    providers: [StockPricesService],
    exports: [StockPricesService],
})
export class StockPricesModule {}
