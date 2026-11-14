import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('smtp.host'),
      port: this.configService.getOrThrow<number>('smtp.port'),
      auth: {
        user: this.configService.getOrThrow<string>('smtp.user'),
        pass: this.configService.getOrThrow<string>('smtp.pass'),
      },
    });
  }
}
