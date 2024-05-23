/**
 * The InteractionNode element does not have any attributes or model associations and does not inherit from any other BPMN element.
 * Since Pools/Participants, Activities, and Events have their own attributes, model associations, and inheritances,
 * additional attributes and model associations for the InteractionNode element are not necessary
 * So it is defined as an empty interface, just to specify that it is an InteractionNode
 * @see https://www.omg.org/spec/BPMN/2.0.2/PDF#G10.110231
 */
export interface InteractionNode {}
