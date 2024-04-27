import { service } from '@flowooh/data/domains';
import FlowoohRepoDefinitionContentService from '@flowooh/data/domains/repositories/definition_contents';
import FlowoohRepoDefinitionService from '@flowooh/data/domains/repositories/definitions';

describe('service', () => {
  it('should have an instance of FlowoohRepoDefinitionService', () => {
    expect(service.repo.definition).toBeInstanceOf(FlowoohRepoDefinitionService);
  });

  it('should have an instance of FlowoohRepoDefinitionContentService', () => {
    expect(service.repo.definitionContent).toBeInstanceOf(FlowoohRepoDefinitionContentService);
  });
});
