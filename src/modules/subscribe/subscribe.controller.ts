import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SubscribeService } from './subscribe.service';

@Controller('subscribe')
export class SubscribeController {
    constructor(private readonly subscribeService: SubscribeService) {}

    @Get()
    @UseGuards(AuthGuard())
    async getAll() {
        return await this.subscribeService.getAll();
    }

    @Post()
    async subscribe(@Body() emailDto: { name: string; email: string }) {
        return await this.subscribeService.subscribe(emailDto);
    }
}
