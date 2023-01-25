import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { Repository } from 'typeorm';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) {}

    async createContact(contactDto: ContactDto) {
        try {
            const { name, email, message } = contactDto;
            const contact = new Contact();

            contact.name = name;
            contact.email = email;
            contact.message = message;

            return await this.contactRepository.save(contact);
        } catch (e) {
            throw new InternalServerErrorException('Error creating contact', e.message);
        }
    }
}
