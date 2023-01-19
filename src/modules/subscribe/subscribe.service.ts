import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// import * as pug from 'pug';
import { Subscribe } from './subscribe.entity';

@Injectable()
export class SubscribeService {
    constructor(readonly mailerService: MailerService) {}

    async subscribe(emailDto: { name: string; email: string }) {
        try {
            const subscribe = new Subscribe();
            subscribe.name = emailDto.name;
            subscribe.email = emailDto.email;

            const result = await subscribe.save();

            /* await this.mailerService.sendMail({
                to: emailDto.email,
                subject: 'Subscribe to SyB Capital Newsletter',
                html: pug.renderFile('src/mailer/templates/subscribe.pug', { name: emailDto.name }),
            });*/

            return result;
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                throw new BadRequestException('Este correo ya esta suscrito');
            }
            throw new InternalServerErrorException('Error al suscribirse al Newsletter', e);
        }
    }
}
