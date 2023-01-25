import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) {}

    @Post()
    async createContacto(@Body() contactDto: ContactDto) {
        return await this.contactService.createContact(contactDto);
    }
}
