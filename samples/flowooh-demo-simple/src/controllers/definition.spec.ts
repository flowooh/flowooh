import { Test, TestingModule } from '@nestjs/testing';
import { DefinitionController } from './definition.controller';

describe('AppController', () => {
  let definitionController: DefinitionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DefinitionController],
    }).compile();

    definitionController = app.get<DefinitionController>(DefinitionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(definitionController.definitionList()).toBe('Hello World!');
    });
  });
});
