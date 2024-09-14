import { TemplateExecutor, template } from 'lodash';
import {
  BPMNProcess,
  BPMNResource,
  BPMNResourceAssignmentExpression,
  BPMNResourceParameter,
  BPMNResourceParameterBinding,
  BPMNResourceRole,
} from '../types';
import { getExpression, logger } from '../utils';
import { Attribute } from './attribute';

const log = logger('resourceRole');

/**
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G9.81887
 */
export class Resource extends Attribute {
  declare $: BPMNResource['$'];
  declare $$: BPMNResource['$$'];

  constructor(process: BPMNProcess, data?: Partial<Resource>) {
    super(process, data);
    if (data) Object.assign(this, data);
  }

  get resourceParameters() {
    const eleList = this.$$?.['bpmn:resourceParameters'];
    return eleList?.map((el) => ResourceParameter.build(this.process, el)) || [];
  }

  static build(process: BPMNProcess, el: BPMNResource) {
    return new Resource(process, { ...el });
  }
}

export class ResourceParameter extends Attribute {
  declare $: BPMNResourceParameter['$'];

  constructor(process: BPMNProcess, data?: Partial<ResourceParameter>) {
    super(process, data);
    if (data) Object.assign(this, data);
  }

  get isRequired() {
    return this.$.isRequired;
  }

  static build(process: BPMNProcess, el: BPMNResourceParameter) {
    return new ResourceParameter(process, { ...el });
  }
}

export class ResourceRole extends Attribute {
  declare $: BPMNResourceRole['$'];
  declare $$: BPMNResourceRole['$$'];

  constructor(process: BPMNProcess, data?: Partial<BPMNResourceRole>) {
    super(process, data);
    if (data) Object.assign(this, data);
  }

  get resource() {
    const resourceRef = this.$$['bpmn:resourceRef']?.[0];
    if (!resourceRef) return;
    const resource = this.process.$$?.['bpmn:resource']?.find((r) => r.$.id === resourceRef);
    if (!resource) return;
    return Resource.build(this.process, resource);
  }

  get parameters() {
    if (!this.resource) return [];
    return this.$$['bpmn:resourceParameterBinding'].map((p) => ResourceParameterBinding.build(this.process, this.resource!, p));
  }

  get resourceAssignmentExpression() {
    return this.$$['bpmn:resourceAssignmentExpression']?.[0]
      ? ResourceAssignmentExpression.build(this.process, this.$$['bpmn:resourceAssignmentExpression'][0])
      : undefined;
  }

  execute() {
    if (this.resourceAssignmentExpression) {
      return this.resourceAssignmentExpression.expression?.();
    }
    if (this.resource) {
      const params = this.resource.resourceParameters.map((p) => {
        const binding = this.parameters.find((b) => b.parameter?.id === p.id);
        return { [p.name as string]: binding?.value };
      });
      if (this.resource.name) {
        const resourceExecutor = getExpression(this.process, this.resource.name);
        return resourceExecutor?.(params);
      }
    }
  }

  static build(process: BPMNProcess, el: BPMNResourceRole) {
    return new ResourceRole(process, { ...el });
  }
}

export class ResourceParameterBinding extends Attribute {
  declare $: BPMNResourceParameterBinding['$'];
  declare $$: BPMNResourceParameterBinding['$$'];

  readonly parent: Resource;

  constructor(process: BPMNProcess, parent: Resource, data?: Partial<ResourceParameterBinding>) {
    super(process, data);
    if (data) Object.assign(this, data);
    this.parent = parent;
  }

  get parameter() {
    return this.parent.resourceParameters.find((p) => p.$.id === this.$.parameterRef);
  }

  get value() {
    return this.$$['bpmn:formalExpression'];
  }

  static build(process: BPMNProcess, parent: Resource, el: BPMNResourceParameterBinding) {
    return new ResourceParameterBinding(process, parent, { ...el });
  }
}

export class ResourceAssignmentExpression extends Attribute {
  declare $: BPMNResourceAssignmentExpression['$'];
  declare $$: BPMNResourceAssignmentExpression['$$'];

  constructor(process: BPMNProcess, data?: Partial<ResourceAssignmentExpression>) {
    super(process, data);
    if (data) Object.assign(this, data);
  }

  get expressionString() {
    return this.$$['bpmn:formalExpression'];
  }

  get expression() {
    try {
      return getExpression(this.process, this.expressionString);
    } catch (e) {
      throw new Error(`Error parsing expression: ${this.expressionString}`);
    }
  }

  static build(process: BPMNProcess, el: BPMNResourceAssignmentExpression) {
    return new ResourceAssignmentExpression(process, { ...el });
  }
}
