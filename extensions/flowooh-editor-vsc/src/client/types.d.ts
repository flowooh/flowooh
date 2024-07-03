declare function acquireVsCodeApi(): {
  postMessage: (message: any) => void;
};

declare module 'bpmn-js-color-picker' {
  import { ModuleDeclaration } from 'bpmn-js/lib/BaseViewer';
  const BpmnColorPickerModule: ModuleDeclaration;
  export default BpmnColorPickerModule;
}
