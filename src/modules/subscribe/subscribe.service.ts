import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// import * as pug from 'pug';
import { Subscribe } from './subscribe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubscribeService {
    constructor(
        @InjectRepository(Subscribe)
        private readonly subscribeRepository: Repository<Subscribe>,
        readonly mailerService: MailerService,
    ) {}

    async getAll() {
        return await this.subscribeRepository.find();
    }

    async getAllActive() {
        return await this.subscribeRepository.find({
            where: {
                subscribed: true,
            },
        });
    }

    async subscribe(emailDto: { name: string; email: string }) {
        try {
            const subscribe = new Subscribe();
            subscribe.name = emailDto.name;
            subscribe.email = emailDto.email;

            const result = await subscribe.save();

            await this.mailerService.sendMail({
                to: subscribe.email,
                subject: 'Bienvenido a SyB Capital',
                template: 'subscribe',
                context: {
                    user: subscribe.name,
                },
            });

            return result;
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Este correo ya esta suscrito');
            }
            throw new InternalServerErrorException('Error al suscribirse al Newsletter', e);
        }
    }
}
