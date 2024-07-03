import { isCmd, isKey, isCopy, isPaste } from 'diagram-js/lib/features/keyboard/KeyboardUtil';
import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions';
import EventBus from 'diagram-js/lib/core/EventBus';
import Keyboard, { Listener } from 'diagram-js/lib/features/keyboard/Keyboard';

var LOW_PRIORITY = 500;

/**
 * Adds default keyboard bindings.
 *
 * This does not pull in any features will bind only actions that
 * have previously been registered against the editorActions component.
 */
export default class KeyboardBindings {
  $inject = ['eventBus', 'keyboard'];

  constructor(eventBus: EventBus, keyboard: Keyboard) {
    eventBus.on<{ editorActions: EditorActions }>('editorActions.init', LOW_PRIORITY, (event) => {
      var editorActions = event.editorActions;

      this.registerBindings(keyboard, editorActions);
    });
  }

  registerBindings(keyboard: Keyboard, editorActions: EditorActions) {
    /**
     * Add keyboard binding if respective editor action
     * is registered.
     *
     * @param {string} action name
     * @param {Function} fn that implements the key binding
     */
    function addListener(action: string, fn: Listener) {
      if (editorActions.isRegistered(action)) {
        keyboard.addListener(fn);
      }
    }

    // undo
    //
    // managed by VSCode

    // redo
    //
    // managed by VSCode

    // copy
    // CTRL/CMD + C
    addListener('copy', (context) => {
      var event = context.keyEvent;

      if (isCopy(event)) {
        editorActions.trigger('copy', undefined);

        return true;
      }
    });

    // paste
    // CTRL/CMD + V
    addListener('paste', (context) => {
      var event = context.keyEvent;

      if (isPaste(event)) {
        editorActions.trigger('paste', undefined);

        return true;
      }
    });

    // zoom in one step
    // CTRL/CMD + +
    addListener('stepZoom', (context) => {
      var event = context.keyEvent;

      // quirk: it has to be triggered by `=` as well to work on international keyboard layout
      // cf: https://github.com/bpmn-io/bpmn-js/issues/1362#issuecomment-722989754
      if (isKey(['+', 'Add', '='], event) && isCmd(event)) {
        editorActions.trigger('stepZoom', { value: 1 });

        return true;
      }
    });

    // zoom out one step
    // CTRL + -
    addListener('stepZoom', (context) => {
      var event = context.keyEvent;

      if (isKey(['-', 'Subtract'], event) && isCmd(event)) {
        editorActions.trigger('stepZoom', { value: -1 });

        return true;
      }
    });

    // zoom to the default level
    // CTRL + 0
    addListener('zoom', (context) => {
      var event = context.keyEvent;

      if (isKey('0', event) && isCmd(event)) {
        editorActions.trigger('zoom', { value: 1 });

        return true;
      }
    });

    // delete selected element
    // DEL
    addListener('removeSelection', (context) => {
      var event = context.keyEvent;

      if (isKey(['Backspace', 'Delete', 'Del'], event)) {
        editorActions.trigger('removeSelection', undefined);

        return true;
      }
    });

    // select all elements
    // CTRL + A
    addListener('selectElements', (context) => {
      var event = context.keyEvent;

      if (keyboard.isKey(['a', 'A'], event) && keyboard.isCmd(event)) {
        editorActions.trigger('selectElements', undefined);

        return true;
      }
    });

    // search labels
    // CTRL + F
    addListener('find', (context) => {
      var event = context.keyEvent;

      if (keyboard.isKey(['f', 'F'], event) && keyboard.isCmd(event)) {
        editorActions.trigger('find', undefined);

        return true;
      }
    });

    // activate space tool
    // S
    addListener('spaceTool', (context) => {
      var event = context.keyEvent;

      if (keyboard.hasModifier(event)) {
        return;
      }

      if (keyboard.isKey(['s', 'S'], event)) {
        editorActions.trigger('spaceTool', undefined);

        return true;
      }
    });

    // activate lasso tool
    // L
    addListener('lassoTool', (context) => {
      var event = context.keyEvent;

      if (keyboard.hasModifier(event)) {
        return;
      }

      if (keyboard.isKey(['l', 'L'], event)) {
        editorActions.trigger('lassoTool', undefined);

        return true;
      }
    });

    // activate hand tool
    // H
    addListener('handTool', (context) => {
      var event = context.keyEvent;

      if (keyboard.hasModifier(event)) {
        return;
      }

      if (keyboard.isKey(['h', 'H'], event)) {
        editorActions.trigger('handTool', undefined);

        return true;
      }
    });

    // activate global connect tool
    // C
    addListener('globalConnectTool', (context) => {
      var event = context.keyEvent;

      if (keyboard.hasModifier(event)) {
        return;
      }

      if (keyboard.isKey(['c', 'C'], event)) {
        editorActions.trigger('globalConnectTool', undefined);

        return true;
      }
    });

    // activate direct editing
    // E
    addListener('directEditing', (context) => {
      var event = context.keyEvent;

      if (keyboard.hasModifier(event)) {
        return;
      }

      if (keyboard.isKey(['e', 'E'], event)) {
        editorActions.trigger('directEditing', undefined);

        return true;
      }
    });

    // activate replace element
    // R
    addListener('replaceElement', (context) => {
      var event = context.keyEvent;

      if (keyboard.hasModifier(event)) {
        return;
      }

      if (keyboard.isKey(['r', 'R'], event)) {
        editorActions.trigger('replaceElement', event);

        return true;
      }
    });
  }
}
