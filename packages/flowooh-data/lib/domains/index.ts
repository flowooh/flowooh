import { FlowoohDataService } from '@flowooh/data';
import { serviceContainer } from '@flowooh/data/decorators';
import './repositories/definition_contents';
import './repositories/definitions';
import './runtimes/executions';
import './runtimes/variables';
import FlowoohRepoDefinitionContentService from './repositories/definition_contents';
import FlowoohRepoDefinitionService from './repositories/definitions';
import FlowoohRtExecutionService from './runtimes/executions';
import FlowoohRtVariableService from './runtimes/variables';

export const service: FlowoohDataService = {} as FlowoohDataService;

function getService<T>(name: string): T {
  const t = serviceContainer.get<T>(name);
  (t as any).service = service;
  return t;
}

service.repo = {
  definition: getService('flowoohRepoDefinitionService'),
  definitionContent: getService('flowoohRepoDefinitionContentService'),
};

service.rt = {
  execution: getService('flowoohRtExecutionService'),
  variable: getService('flowoohRtVariableService'),
};

declare module '@flowooh/data' {
  interface FlowoohDataService {
    repo: {
      definition: FlowoohRepoDefinitionService;
      definitionContent: FlowoohRepoDefinitionContentService;
    };
    rt: {
      execution: FlowoohRtExecutionService;
      variable: FlowoohRtVariableService;
    };
  }
}
