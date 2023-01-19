import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as AWS from 'aws-sdk';

export const MailerProvider = [
    MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService) {
            let transport: any = {
                host: configService.get<string>('MAIL_HOST'),
                port: configService.get<number>('MAIL_PORT'),
                secure: false, // upgrade later with STARTTLS
                auth: {
                    user: configService.get<string>('MAIL_USERNAME'),
                    pass: configService.get<string>('MAIL_PASSWORD'),
                },
            };
            if (configService.get<string>('MAIL_SERVICE') === 'ses') {
                transport = null;
                transport = {
                    SES: new AWS.SES({
                        accessKeyId: configService.get('AWS_ACCESS_KEY'),
                        secretAccessKey: configService.get('AWS_SECRET_KEY'),
                        region: configService.get('AWS_REGION'),
                    }),
                };
            }
            const mailerOptions = {
                transport,
                defaults: {
                    from: `${configService.get<string>('MAIL_NAME')} <${configService.get<string>('MAIL_FROM')}>`,
                },
                template: {
                    dir: `${__dirname}/templates`,
                    adapter: new PugAdapter(),
                    options: {
                        strict: true,
                    },
                },
            };
            return mailerOptions as MailerOptions;
        },
    }),
];
