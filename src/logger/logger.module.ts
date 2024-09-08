import { DynamicModule, Module } from '@nestjs/common';
import { Logger } from 'winston';

import LoggerService from './logger.service';

/**
 * Logger Module class
 */
@Module({
  providers: [LoggerService],
})
class LoggerModule {
  /**
   * @param {String} context Context
   * @return {DynamicModule} DynamicModule
   */
  static register(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: Logger,
          useValue: new LoggerService(context),
        },
      ],
      exports: [LoggerService],
    };
  }
}

export default LoggerModule;
