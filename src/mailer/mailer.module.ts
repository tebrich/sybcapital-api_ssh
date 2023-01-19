import { Module } from '@nestjs/common';

import { MailerProvider } from './mailer.service';

@Module({
    imports: [...MailerProvider],
    exports: [...MailerProvider],
})
export class MailerModule {}
