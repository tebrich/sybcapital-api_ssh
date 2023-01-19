import { Body, Controller, Post } from '@nestjs/common';

import { SubscribeService } from './subscribe.service';

@Controller('subscribe')
export class SubscribeController {
    constructor(private readonly subscribeService: SubscribeService) {}

    @Post()
    async subscribe(@Body() emailDto: { name: string; email: string }) {
        return await this.subscribeService.subscribe(emailDto);
    }
}
