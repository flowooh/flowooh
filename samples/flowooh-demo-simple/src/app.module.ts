import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DefinitionController } from './controllers/definition.controller';
import { ExecutionController } from './controllers/execution.controller';

@Module({
  imports: [],
  controllers: [DefinitionController, ExecutionController],
  providers: [AppService],
})
export class AppModule {}
