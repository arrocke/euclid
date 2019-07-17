import * as Construction from 'src/construction'

describe('create', () => {
  test('when called with no arguments, returns an empty construction', () => {
    expect(Construction.create()).toMatchSnapshot()
  })

  test('initializes construction from argument', () => {
    expect(
      Construction.create([
        {type: 'point', x: 1, y: 2},
        {type: 'point', x: -5, y: -2},
        {type: 'line', left: 0, right: 1},
        {type: 'circle', center: 0, edge: 1},
        {type: 'circle', center: 1, edge: 0},
        {type: 'intersection', one: 3, two: 4, neg: true},
        {type: 'line', left: 0, right: 5},
        {type: 'line', left: 1, right: 5},
      ]),
    ).toMatchSnapshot()
  })
})

describe('addPoint', () => {
  test('adds the point to the construction', () => {
    const construction = Construction.create()
    expect(Construction.addPoint(construction, {x: -10, y: 4})).toMatchSnapshot()
  })

  test('throws error if point already exists', () => {
    const point: Construction.PointInit = {type: 'point', x: 1, y: 2}
    const construction = Construction.create([point])
    expect(() => Construction.addPoint(construction, point)).toThrowErrorMatchingSnapshot()
  })
})

describe('addLine', () => {
  test('adds the line to the construction from two points', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
    ])
    expect(Construction.addLine(construction, 0, 1)).toMatchSnapshot()
  })

  test('adds the line to the construction using an intersection', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
      {type: 'circle', center: 0, edge: 1},
      {type: 'circle', center: 1, edge: 0},
    ])
    expect(Construction.addLine(construction, 2, 3)).toMatchSnapshot()
  })

  test('adds new intersections to the construction', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
      {type: 'circle', center: 0, edge: 1},
      {type: 'circle', center: 1, edge: 0},
      {type: 'line', left: 0, right: 1},
    ])
    expect(Construction.addLine(construction, 2, 3)).toMatchSnapshot()
  })

  test('throws error if line already exists', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
      {type: 'line', left: 0, right: 1},
    ])
    expect(() => Construction.addLine(construction, 1, 0)).toThrowErrorMatchingSnapshot()
  })

  test('throws error if points do not exist', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
    ])
    expect(() => Construction.addLine(construction, 2, 0)).toThrowErrorMatchingSnapshot()
  })
})

describe('addCircle', () => {
  test('adds the circle to the construction from two points', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
    ])
    expect(Construction.addCircle(construction, 0, 1)).toMatchSnapshot()
  })

  test('adds new intersections to the construction', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
      {type: 'line', left: 0, right: 1},
    ])
    expect(Construction.addCircle(construction, 0, 1)).toMatchSnapshot()
  })

  test('throws error if circle already exists', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
      {type: 'circle', center: 0, edge: 1},
    ])
    expect(() => Construction.addCircle(construction, 0, 1)).toThrowErrorMatchingSnapshot()
  })

  test('throws error if points do not exist', () => {
    const construction = Construction.create([
      {type: 'point', x: 1, y: 2},
      {type: 'point', x: 12, y: -1},
    ])
    expect(() => Construction.addCircle(construction, 2, 0)).toThrowErrorMatchingSnapshot()
  })
})
