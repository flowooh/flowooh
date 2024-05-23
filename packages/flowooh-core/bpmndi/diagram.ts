import { DIDiagram, DILabel, DILabeledEdge, DILabeledShape, DIPlane, DIStyle } from './di';

/**
 * BPMNDiagram from BPMNDI
 */
export class BPMNDiagram extends DIDiagram {}

/**
 * A BPMNPlane is the BPMNDiagram container of BPMNShape and BPMNEdge.
 */
export class BPMNPlane extends DIPlane {}

export class BPMNShape extends DILabeledShape {}

export class BPMNEdge extends DILabeledEdge {}

export class BPMNLabel extends DILabel {}

export class BPMNLabelStyle extends DIStyle {}
