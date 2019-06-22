export interface Point {
  type: 'p'
  x: number
  y: number
}

export interface Line {
  type: 'l'
  left: number
  right: number
}

export interface LineState extends Line {
  a: number
  b: number
  c: number
}

export interface Circle {
  type: 'c'
  center: number
  edge: number
}

export interface CircleState extends Circle {
  h: number
  k: number
  r: number
}

export interface Intersection {
  type: 'i'
  element1: number
  element2: number
  neg?: boolean
}

export interface IntersectionState extends Intersection {
  x: number
  y: number
}

export type Element = Point | Line | Circle | Intersection
export type ElementState = Point | LineState | CircleState | IntersectionState

export interface ConstructionState {
  elements: ElementState[]
}
