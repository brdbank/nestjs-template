import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import AppController from './app.controller';
import AppService from './app.service';
import LoggerModule from './logger/logger.module';
import MorganMiddleware from './middlewares/morgan.middleware';
import DatabaseModule from './database/database.module';
import { consumerGroup, brokersList } from './common/constant.common';
import { Consumer } from './types';

/**
 * Consumer objects
 * @param {Array} consumers Consumers
 * @return {Array} Consumer objects
 */

const buildConsumerObjects = (consumers: Consumer[]) => consumers.map((consumer) => ({
  name: consumer.name,
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: brokersList,
      clientId: `${consumer.topic}-client`,
    },
    consumer: {
      groupId: `${consumer.topic}-consumer`,
    },
  },
}));

/**
 * App Module class
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.register('App'),
    DatabaseModule,
    ClientsModule.register([
      ...buildConsumerObjects(consumerGroup) as any,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule implements NestModule {
  /**
   * @param {MiddlewareConsumer} consumer Middleware consumer
   * @return {void}
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}

export default AppModule;
