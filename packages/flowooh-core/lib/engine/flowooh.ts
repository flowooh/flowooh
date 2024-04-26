import { Activity } from '@flowooh-core/base';
import { Container } from '@flowooh-core/container';
import { Context, State, Status, Token } from '@flowooh-core/context';
import { $, BPMNDefinition, BPMNProcess, IdentityOptions, Metadata, MethodOptions } from '@flowooh-core/types';
import {
  NodeKey,
  getActivity,
  getBPMNProcess,
  getWrappedBPMNElement,
  logger,
  parse,
  readFile,
} from '@flowooh-core/utils';
import { Workflow } from './workflow';

const log = logger('engine');

type IExecute<D = any, SV = any> = {
  target: any;
  context: Context<D, SV>;
  process: BPMNProcess;
  definition: BPMNDefinition;
};

interface LoadProcessOptions<D = any, SV = any> {
  id?: string;
  path?: string;
  xml?: string;
  schema?: BPMNDefinition;
  factory?: () => Workflow;
  handler?: Workflow;
  exec?: Partial<IExecute<D, SV>>;
}

interface IExecution<D = any, SV = any> extends LoadProcessOptions<D, SV> {
  context?: Context;
  data?: D;
  value?: SV;
  node?: IdentityOptions;
}

export class Flowooh {
  protected context?: Context;

  protected target!: Workflow;

  protected process?: BPMNProcess;
  protected definition?: BPMNDefinition;

  static build(exec?: Partial<IExecute>): Flowooh {
    const workflow = new Flowooh();

    if (exec) {
      workflow.target = exec?.target;
      workflow.context = exec?.context;
      workflow.process = exec?.process;
      workflow.definition = exec?.definition;
    }

    return workflow;
  }

  async execute({ context, data, value, ...options }: IExecution): Promise<IExecute> {
    // Load Definition and Process
    this.loadProcess(options);
    if (!this.definition) {
      throw new Error('Definition load failed');
    }
    if (!this.process) {
      throw new Error('Process load failed');
    }

    // refresh the context
    context = (this.context ?? context ?? Context.build({ data })).resume();
    if (!context.isReady()) throw new Error('Context is not ready to consume');
    if (context.status === Status.Terminated) throw new Error('Cannot execute workflow at terminated state');

    // get the activity and token
    const activity = this.getActivity(context, { node: options.node, data, value });
    const token = this.getToken(context, activity.$, { node: options.node, data, value });

    // run the activities
    await this.running(context, activity, token, { data, value });

    // setting the status of the context to the appropriate status.
    if (context.isTerminated()) context.status = Status.Terminated;
    else if (context.status === Status.Running) context.status = Status.Paused;

    log.info(`Context status is ${context.status}`);

    return {
      context: context,
      target: this.target,
      process: this.process,
      definition: this.definition,
    };
  }

  private loadProcess(options: LoadProcessOptions) {
    if (!this.target && options?.exec?.target) this.target = options.exec.target;
    if (!this.process && options?.exec?.process) this.process = options.exec.process;

    if (!this.definition && options.id) this.definition = Container.getDefinition(options.id);
    if (!this.definition && options.exec?.definition) this.definition = options.exec.definition;

    const { path, xml, schema } = options;
    if (!this.definition && schema) this.definition = schema;
    else if (!this.definition && xml) this.definition = parse(xml)['bpmn:definitions'];
    else if (!this.definition && path) this.definition = parse(readFile(path))['bpmn:definitions'];

    if (!this.target) {
      const { handler, factory } = options;
      this.target = ('$__metadata__' in this ? this : (factory ?? (() => undefined))() ?? handler) as Workflow;
      if (!this.target) throw new Error('Target workflow not found');
    }

    const metadata = this.target.$__metadata__ as Metadata;

    this.definition = this.definition ?? Container.getDefinition(metadata.definition.id);
    if (!this.definition) throw new Error('Definition schema not found');

    log.info('Definition %o is loaded', metadata.definition);

    this.process = this.process ?? getBPMNProcess(this.definition, metadata.process);
    if (!this.process) throw new Error('Process definition not found');

    log.info('Process %o is loaded', metadata.process);
  }

  private getActivity(context: Context, options: { node?: IdentityOptions; data: any; value: any }) {
    if (!this.process) {
      throw new Error('process is not defined, buildActivity should be called after loadProcess');
    }

    let activity;
    if (options?.node && context.tokens.length) {
      // if node is provided and context has tokens, get the activity from the provided node
      activity = getActivity(this.process, getWrappedBPMNElement(this.process, options.node));
      if (!activity) {
        throw new Error(`Node activity not found or not applicable, ${options.node}`);
      }
    } else if (!options?.node && !context.tokens.length) {
      // if node is not provided and context has no tokens, should get the start event activity
      if (this.process['bpmn:startEvent']?.length !== 1) {
        throw new Error('Start event is not defined in process or have more than one start event');
      }
      activity = getActivity(this.process, { key: 'bpmn:startEvent', element: this.process['bpmn:startEvent'][0] });
      if (!activity) throw new Error('Start event activity not found');
    }
    if (!activity && options?.node && !context.tokens.length) {
      throw new Error(
        'Node activity not found or not applicable, context should not be empty when options.node is provided',
      );
    }
    if (!activity) {
      throw new Error('Node activity not found or not applicable');
    }
    return activity;
  }

  private getToken(context: Context, $: $, options: { node?: IdentityOptions; data: any; value: any }) {
    if (!this.process) {
      throw new Error('process is not defined, buildActivity should be called after loadProcess');
    }

    let token: Token | undefined;
    if (options?.node && context.tokens.length) {
      // if node is provided and context has tokens, get the activity from the provided node
      token = context.getTokens($)?.pop()?.resume();
      if (!token?.isReady()) throw new Error('Token is not ready to consume');
    } else if (!options?.node && !context.tokens.length) {
      // if node is not provided and context has no tokens, should get the start event activity
      if (this.process['bpmn:startEvent']?.length !== 1) {
        throw new Error('Start event is not defined in process or have more than one start event');
      }
      const state = State.build($.id, { name: $.name, value: options.value });
      token = Token.build({ history: [state] });
      context.addToken(token);
    }
    if (!token) throw new Error('Token not found');
    token.state.value = token.state.value ?? options.value;
    return token;
  }

  private async running(context: Context, activity: Activity, token: Token, options: { data: any; value: any }) {
    if (!this.process) {
      throw new Error('process is not defined, running should be called after loadProcess');
    }

    const { data, value } = options;

    const nodes = Reflect.getMetadata(NodeKey, this.target, '$__metadata__');
    const runOptions: { method: string; options: MethodOptions } = {
      method: nodes[activity.id]?.propertyName ?? '',
      options: { activity, token, context, data: data ?? context.data, value },
    };
    let is_first_iteration = true;
    let val: { [id: string]: any } = {}; // to hold returned value by token id
    do {
      const result = await run(this.target, runOptions.method, runOptions.options, is_first_iteration);

      log.debug('Result of %o method is %O', runOptions.method, result.value ?? '[null]');

      if (result.exception) throw result.exception;

      if (context.status === Status.Running) {
        const next = context.next();

        log.info(`Next node is ${next?.name ?? next?.ref ?? '[undefined]'}`);

        if (!next) break;

        // 组装下一次循环的参数
        runOptions.method = '';

        if (next.name) runOptions.method = nodes[next.name]?.propertyName ?? '';
        if (!runOptions.method) runOptions.method = nodes[next.ref]?.propertyName ?? '';

        if (!runOptions.method && result.value) val = { [token.id]: result.value };
        else if (runOptions.method && val[token.id]) {
          next.value = val[token.id];
          delete val[token.id];
        } else next.value = result.value;

        log.info(`Next method is ${runOptions.method ?? '[undefined]'}`);

        const nextToken = context.getTokens({ id: next.ref })?.find((t) => t.status === Status.Ready);

        if (!nextToken) throw new Error('Token not found at running stage');

        const nextActivity = getActivity(this.process, getWrappedBPMNElement(this.process, { id: next.ref }));

        log.info(`Next Activity is ${activity?.name ?? activity?.id ?? '[undefined]'}`);

        runOptions.options = {
          context: context,
          token: nextToken,
          activity: nextActivity,
          value: next.value,
          data: data ?? context.data,
        };
      }
      is_first_iteration = false;
    } while (context.status === Status.Running);
  }
}

/**
 * It runs the activity, and returns the value and exception
 *
 * @param {any} target - any - The target object that contains the method to be executed.
 * @param {string} method - The name of the method to be executed.
 * @param {MethodOptions} options - MethodOptions
 * @param {boolean} is_first_iteration - is first iteration
 *
 * @returns The value of the method, or the exception if there is one.
 */
async function run<D = any, V = any>(
  target: any,
  method: string,
  options: MethodOptions<D, V>,
  is_first_iteration?: boolean,
) {
  options.activity.token = options.token;
  options.activity.context = options.context;

  let value;
  let exception;

  try {
    options.token.status = Status.Running;
    options.context.status = Status.Running;

    log.info(`Activity ${options.activity.id ?? options.activity.name} is running`);

    // Get the node from the target object by name or id
    let node!: { options: { pause?: true }; propertyName: string };
    const nodes = Reflect.getMetadata(NodeKey, target, '$__metadata__');
    if (options.activity.name) node = nodes[options.activity.name];
    if (!node && options.activity.id) node = nodes[options.activity.id];

    log.info('Node %o is loaded', node);

    if (!method) {
      // Skip if the corresponding node does not have a defined method
      log.warn(`Activity ${options.activity.id ?? options.activity.name} method not defined`);
      value = options.value;
      options.activity.takeOutgoing();
    } else if (!node?.options?.pause || is_first_iteration) {
      // Execute the method if the node is not be defined to pause or it is the first iteration
      value = await target[method](options);
    } else {
      options.token.pause();
    }

    log.info(`Activity ${options.activity.id ?? options.activity.name} processed`);

    if (options.activity.isEnd()) {
      // If the activity is an end event, set the token status to terminated
      options.token.status = Status.Terminated;
    } else if (!options.activity.outgoing?.length) {
      // If the activity is not an end event, and it does NOT have outgoing, set the token status to paused
      options.token.pause();
    }
  } catch (error) {
    options.context.status = Status.Failed;
    options.token.status = Status.Failed;
    exception = error;

    log.error(`Activity ${options.activity.id ?? options.activity.name} failed with error %O`, error);
  }

  return { value, exception };
}
