import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';

@Module({
    controllers: [ContactController],
    imports: [TypeOrmModule.forFeature([Contact])],
    providers: [ContactService],
    exports: [ContactService],
})
export class ContactModule {}
