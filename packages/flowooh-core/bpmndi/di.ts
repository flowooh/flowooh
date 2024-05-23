/**
 * BPMN DI: BPMN Diagram Interchange
 */
import { BaseElement } from '../core/foundation/baseElement';
import { BPMNLabel, BPMNLabelStyle, BPMNPlane, BPMNShape } from './diagram';
import { DiagramElement, Font } from './primitive';

export abstract class DIDiagram {
  plane: BPMNPlane;
  labelStyle: BPMNLabelStyle[];
}

export abstract class DIPlane {
  bpmnElement: BaseElement;
}

export abstract class DILabeledShape {
  isHorizontal: boolean;
  isExpanded: boolean;
  isMarkerVisible: boolean;
  participantBandKind: ParticipantBandKind;
  isMessageVisible: boolean;
  choreographyActivityShape: BPMNShape;

  bpmnElement: BaseElement;
  label: BPMNLabel;
}

export abstract class DILabeledEdge {
  label: BPMNLabel;
  bpmnElement: BaseElement;
  sourceElement: DiagramElement;
  targetElement: DiagramElement;
  messageVisibleKind: MessageVisibleKind;
}

export abstract class DILabel {
  labelStyle: BPMNLabelStyle;
}

export abstract class DIStyle {
  font: [Font];
}

enum ParticipantBandKind {
  /** the band should be depicted as a non shaded top band */
  top_initiating,
  /** the band should be depicted as a non shaded middle band */
  middle_initiating,
  /** the band should be depicted as a non shaded bottom band */
  bottom_initiating,
  /** the band should be depicted as a shaded top band */
  top_non_initiating,
  /** the band should be depicted as a shaded middle band */
  middle_non_initiating,
  /** the band should be depicted as a shaded bottom band */
  bottom_non_initiating,
}

enum MessageVisibleKind {
  /** The envelope should not be shaded */
  initiating,
  /** The envelope should be shaded */
  non_inititating,
}
