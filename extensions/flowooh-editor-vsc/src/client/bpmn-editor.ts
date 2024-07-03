import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';

import './bpmn-editor.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import CommandStack from 'diagram-js/lib/command/CommandStack';
import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions';

import BpmnColorPickerModule from 'bpmn-js-color-picker';
import 'bpmn-js-color-picker/colors/color-picker.css';

import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

import KeyboardModule from './features/keyboard';

const vscode = acquireVsCodeApi();

const modeler = new BpmnModeler<{ commandStack: CommandStack; editorActions: EditorActions }>({
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties',
  },
  keyboard: {
    bindTo: document,
  },
  additionalModules: [KeyboardModule, BpmnColorPickerModule, BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
});

modeler.on('import.done', (event: any) => {
  return vscode.postMessage({
    type: 'import',
    error: event.error?.message,
    warnings: event.warnings.map((warning: any) => warning.message),
    idx: -1,
  });
});

modeler.on('commandStack.changed', () => {
  const commandStack = modeler.get<CommandStack & { _stackIdx: number }>('commandStack');

  return vscode.postMessage({
    type: 'change',
    idx: commandStack._stackIdx,
  });
});

// handle messages from the extension
window.addEventListener('message', async (event) => {
  const { type, body, requestId } = event.data;

  switch (type) {
    case 'init':
      if (!body.content) {
        return modeler.createDiagram();
      } else {
        return modeler.importXML(body.content);
      }

    case 'update': {
      if (body.content) {
        return modeler.importXML(body.content);
      }

      if (body.undo) {
        return modeler.get('commandStack').undo();
      }

      if (body.redo) {
        return modeler.get('commandStack').redo();
      }

      break;
    }

    case 'triggerAction':
      return modeler.get('editorActions').trigger(body.action, body.options);

    case 'getText':
      return modeler.saveXML({ format: true }).then(({ xml }) => {
        return vscode.postMessage({
          type: 'response',
          requestId,
          body: xml,
        });
      });
  }
});

// signal to VS Code that the webview is initialized
vscode.postMessage({ type: 'ready' });
