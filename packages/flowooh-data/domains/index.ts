import FlowoohRtVariableService from './runtimes/variables';
import FlowoohRtExecutionService from './runtimes/executions';
import FlowoohRepoDefinitionService from './repositories/definitions';
import FlowoohRepoDefinitionContentService from './repositories/definition_contents';
import './repositories/definition_contents';
import './repositories/definitions';
import './runtimes/executions';
import './runtimes/variables';
import { serviceContainer } from './decorator';

export interface FlowoohDataService {
  repo: {
    definition: FlowoohRepoDefinitionService;
    definitionContent: FlowoohRepoDefinitionContentService;
  };
  rt: {
    execution: FlowoohRtExecutionService;
    variable: FlowoohRtVariableService;
  };
}

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
