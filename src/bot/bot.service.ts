import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BotService implements OnModuleInit {
  private client: Client = new Client({
    authStrategy: new LocalAuth(),
  });
  private readonly logger = new Logger(BotService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.client.on('qr', (qr) => {
      this.logger.log(
        `QrCode: http://localhost:${process.env.PORT || 3000}/bot/qr`,
      );
      this.eventEmitter.emit('qrcode.created', qr);
    });

    this.client.on('ready', () => {
      this.logger.log('Back online again!');
    });

    this.client.on('message', (msg) => {
      this.logger.verbose(`${msg.from}: ${msg.body}`);
      if (msg.body == '!ping') {
        msg.reply('pong');
      }
    });

    this.client.initialize();
  }
}
