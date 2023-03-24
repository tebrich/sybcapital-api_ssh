import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as path from 'path';

export const MailerProvider = [
    MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
            const transport: any = {
                host: configService.get<string>('MAIL_HOST'),
                port: configService.get<number>('MAIL_PORT'),
                secure: false, // upgrade later with STARTTLS
                auth: {
                    user: configService.get<string>('MAIL_USERNAME'),
                    pass: configService.get<string>('MAIL_PASSWORD'),
                },
            };
            const mailerOptions = {
                transport,
                defaults: {
                    from: `${configService.get<string>('MAIL_NAME')} <${configService.get<string>('MAIL_FROM')}>`,
                },
                template: {
                    dir: path.join(__dirname, 'templates'),
                    adapter: new PugAdapter({ inlineCssEnabled: true }),
                    options: {
                        strict: true,
                    },
                },
            };
            return mailerOptions as MailerOptions;
        },
    }),
];
