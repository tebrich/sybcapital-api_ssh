import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscribe } from './subscribe.entity';
import { EmailService } from '../email/email.service'; // ✅ Importa tu nuevo servicio

@Injectable()
export class SubscribeService {
  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    private readonly emailService: EmailService, // ✅ Inyecta EmailService
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

      // ✅ Enviar email de bienvenida usando SendGrid API
      await this.emailService.sendWelcomeEmail(subscribe.email, subscribe.name);

      return result;
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Este correo ya esta suscrito');
      }
      throw new InternalServerErrorException('Error al suscribirse al Newsletter', e);
    }
  }
}

