import { ModuleDeclaration } from 'bpmn-js/lib/BaseViewer';
import Keyboard from 'diagram-js/lib/features/keyboard/Keyboard';
import KeyboardBindings from './KeyboardBindings';

const KeyboardModule: ModuleDeclaration = {
  __init__: ['keyboard', 'keyboardBindings'],
  keyboard: ['type', Keyboard],
  keyboardBindings: ['type', KeyboardBindings],
};

export default KeyboardModule;
