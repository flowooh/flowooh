import { Status } from '@flowooh/core';
import { data as k } from '@flowooh/data/data';
import { service } from '@flowooh/data/domains';
import { FlowoohRepoDefinitionContentData } from '@flowooh/data/tables/repositories/definition_contents';
import { FlowoohRepoDefinitionData } from '@flowooh/data/tables/repositories/definitions';
import { executionRecordId } from '@flowooh/data/utils/uid';
import { SimpleWorkflow } from '../../example';
import { getActivity, getWrappedBPMNElement } from '@flowooh/core/utils';

describe('FlowoohRtExecutionService', () => {
  const mockDefinitions: Partial<FlowoohRepoDefinitionData>[] = [
    {
      id: '1',
      name: 'Example 1',
      description: 'This is an example',
      version: '1.0.0',
      published: true,
    },
    {
      id: '2',
      name: 'Example 2',
      description: 'This is another example',
      version: '3.0.0',
      published: false,
    },
    {
      id: '3',
      name: 'Example 3',
      description: 'This is yet another example',
      version: '3.0.0',
      published: true,
    },
    {
      id: '4',
      name: 'Example 4',
      description: 'This is the last example',
      version: '4.0.0',
      published: true,
    },
  ];

  const mockDefinitionContents: Partial<FlowoohRepoDefinitionContentData>[] = [
    {
      id: '1',
      definition_id: '1',
      version: '1.0.0',
      content: `
      <?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1ednrq3" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="11.4.1">
        <bpmn:collaboration id="Collaboration_0wlp4ym">
          <bpmn:participant id="Participant_0ae9bpa" name="Simple Workflow" processRef="Process_1igpwhg" />
        </bpmn:collaboration>
        <bpmn:process id="Process_1igpwhg" isExecutable="false">
          <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
            <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
          </bpmn:startEvent>
          <bpmn:endEvent id="Event_16a7ub0" name="End">
            <bpmn:incoming>Flow_1fznvmj</bpmn:incoming>
          </bpmn:endEvent>
          <bpmn:userTask id="Activity_1efomxn" name="Task1">
            <bpmn:incoming>Flow_0hs4ef8</bpmn:incoming>
            <bpmn:outgoing>Flow_17n861s</bpmn:outgoing>
          </bpmn:userTask>
          <bpmn:serviceTask id="Activity_0xzkax6" name="Task01">
            <bpmn:incoming>Flow_05tl31k</bpmn:incoming>
            <bpmn:outgoing>Flow_1720nab</bpmn:outgoing>
          </bpmn:serviceTask>
          <bpmn:sendTask id="Activity_1r8gmbw" name="Task02">
            <bpmn:incoming>Flow_1720nab</bpmn:incoming>
            <bpmn:outgoing>Flow_1dyucuz</bpmn:outgoing>
          </bpmn:sendTask>
          <bpmn:sequenceFlow id="Flow_0eekk20" sourceRef="StartEvent_1ogvy0x" targetRef="Gateway_009anth" />
          <bpmn:sequenceFlow id="Flow_0hs4ef8" sourceRef="Gateway_009anth" targetRef="Activity_1efomxn" />
          <bpmn:sequenceFlow id="Flow_05tl31k" sourceRef="Gateway_009anth" targetRef="Activity_0xzkax6" />
          <bpmn:sequenceFlow id="Flow_1dyucuz" sourceRef="Activity_1r8gmbw" targetRef="Gateway_00y0ktn" />
          <bpmn:sequenceFlow id="Flow_17n861s" sourceRef="Activity_1efomxn" targetRef="Gateway_00y0ktn" />
          <bpmn:sequenceFlow id="Flow_1fznvmj" sourceRef="Gateway_00y0ktn" targetRef="Event_16a7ub0" />
          <bpmn:sequenceFlow id="Flow_1720nab" sourceRef="Activity_0xzkax6" targetRef="Activity_1r8gmbw" />
          <bpmn:parallelGateway id="Gateway_009anth">
            <bpmn:incoming>Flow_0eekk20</bpmn:incoming>
            <bpmn:outgoing>Flow_0hs4ef8</bpmn:outgoing>
            <bpmn:outgoing>Flow_05tl31k</bpmn:outgoing>
          </bpmn:parallelGateway>
          <bpmn:parallelGateway id="Gateway_00y0ktn">
            <bpmn:incoming>Flow_1dyucuz</bpmn:incoming>
            <bpmn:incoming>Flow_17n861s</bpmn:incoming>
            <bpmn:outgoing>Flow_1fznvmj</bpmn:outgoing>
          </bpmn:parallelGateway>
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
          <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0wlp4ym">
            <bpmndi:BPMNShape id="Participant_0ae9bpa_di" bpmnElement="Participant_0ae9bpa" isHorizontal="true">
              <dc:Bounds x="160" y="80" width="750" height="250" />
              <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1ogvy0x">
              <dc:Bounds x="212" y="142" width="36" height="36" />
              <bpmndi:BPMNLabel>
                <dc:Bounds x="218" y="185" width="24" height="14" />
              </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Event_16a7ub0_di" bpmnElement="Event_16a7ub0">
              <dc:Bounds x="852" y="142" width="36" height="36" />
              <bpmndi:BPMNLabel>
                <dc:Bounds x="860" y="185" width="20" height="14" />
              </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Activity_1l9ogx6_di" bpmnElement="Activity_1efomxn">
              <dc:Bounds x="420" y="120" width="100" height="80" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Activity_0cdxib9_di" bpmnElement="Activity_0xzkax6">
              <dc:Bounds x="420" y="230" width="100" height="80" />
              <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Activity_0j0g7fm_di" bpmnElement="Activity_1r8gmbw">
              <dc:Bounds x="590" y="230" width="100" height="80" />
              <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Gateway_03r3jcv_di" bpmnElement="Gateway_009anth">
              <dc:Bounds x="305" y="135" width="50" height="50" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="Gateway_1ygi0qm_di" bpmnElement="Gateway_00y0ktn">
              <dc:Bounds x="745" y="135" width="50" height="50" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge id="Flow_0eekk20_di" bpmnElement="Flow_0eekk20">
              <di:waypoint x="248" y="160" />
              <di:waypoint x="305" y="160" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_0hs4ef8_di" bpmnElement="Flow_0hs4ef8">
              <di:waypoint x="355" y="160" />
              <di:waypoint x="420" y="160" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_05tl31k_di" bpmnElement="Flow_05tl31k">
              <di:waypoint x="330" y="185" />
              <di:waypoint x="330" y="270" />
              <di:waypoint x="420" y="270" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_1dyucuz_di" bpmnElement="Flow_1dyucuz">
              <di:waypoint x="690" y="270" />
              <di:waypoint x="770" y="270" />
              <di:waypoint x="770" y="185" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_17n861s_di" bpmnElement="Flow_17n861s">
              <di:waypoint x="520" y="160" />
              <di:waypoint x="745" y="160" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_1fznvmj_di" bpmnElement="Flow_1fznvmj">
              <di:waypoint x="795" y="160" />
              <di:waypoint x="852" y="160" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_1720nab_di" bpmnElement="Flow_1720nab">
              <di:waypoint x="520" y="270" />
              <di:waypoint x="590" y="270" />
            </bpmndi:BPMNEdge>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>`,
    },
    {
      id: '2',
      definition_id: '1',
      version: '2.0.0',
    },
    {
      id: '3',
      definition_id: '2',
      version: '3.0.0',
      content: `
          <bpmn:definitions>
            <bpmn:process id="Process_1igpwhg" isExecutable="false">
                <bpmn:startEvent id="StartEvent_1ogvy0x" name="Start">
                    <bpmn:outgoing>Flow_0eekk20</bpmn:outgoing>
                </bpmn:startEvent>
            </bpmn:process>
          </bpmn:definitions>`,
    },
    {
      id: '4',
      definition_id: '2',
      version: '4.0.0',
    },
  ];

  beforeAll(async () => {
    await k.insert(mockDefinitions).into('flowooh_repo_definitions');
    await k.insert(mockDefinitionContents).into('flowooh_repo_definition_contents');
  });

  afterAll(async () => {
    await k('flowooh_repo_definitions').truncate();
    await k('flowooh_repo_definition_contents').truncate();
    await k.destroy();
  });

  describe('start', () => {
    it('should start the flowooh', async () => {
      const result = await service.rt.execution.start('1', { workflow: SimpleWorkflow });
      expect(result).toBeDefined();
    });

    it('should throw an error if target is not provided', async () => {
      const result = service.rt.execution.start('1', { workflow: undefined as any });
      expect(result).rejects.toThrow('target is required');
    });

    it('should throw an error if target is invalid', async () => {
      const result = service.rt.execution.start('1', { workflow: class {} });
      expect(result).rejects.toThrow('Invalid target, target should be a Workflow');
    });

    it('should throw an error if definition is not found', async () => {
      const result = service.rt.execution.start('5', { workflow: SimpleWorkflow });
      expect(result).rejects.toThrow('definition not found');
    });

    it('should get expected data', async () => {
      const result = await service.rt.execution.start('1', { workflow: SimpleWorkflow });
      expect(result.execution.context.data.trace).toEqual(['start', 'task01']);
    });
  });

  describe('execute', () => {
    it('should execute task1 in the flowooh', async () => {
      const result = await service.rt.execution.start('1', { workflow: SimpleWorkflow });
      const tokens = result.execution.context.tokens.filter((t) => t.isPaused());
      const result2 = await service.rt.execution.execute(executionRecordId(result.processInstanceId, tokens[0].id), { workflow: SimpleWorkflow });
      console.log('🚀 ~ it ~ context:', JSON.stringify(result2.execution.context));
      expect(result2.execution.context.status).toEqual(Status.Paused);
    });

    it('should execute task02 in the flowooh', async () => {
      const result = await service.rt.execution.start('1', { workflow: SimpleWorkflow });
      const tokens = result.execution.context.tokens.filter((t) => t.isPaused());
      const result2 = await service.rt.execution.execute(executionRecordId(result.processInstanceId, tokens[1].id), { workflow: SimpleWorkflow });
      expect(result2.execution.context.status).toEqual(Status.Paused);
    });

    it('should execute task1 and task02 in the flowooh', async () => {
      const result = await service.rt.execution.start('1', { workflow: SimpleWorkflow });
      const tokens = result.execution.context.tokens.filter((t) => t.isPaused());
      const result2 = await service.rt.execution.execute(executionRecordId(result.processInstanceId, tokens[0].id), { workflow: SimpleWorkflow });
      const result3 = await service.rt.execution.execute(executionRecordId(result.processInstanceId, tokens[1].id), { workflow: SimpleWorkflow });
      expect(result3.execution.context.status).toEqual(Status.Terminated);
    });
  });
});
