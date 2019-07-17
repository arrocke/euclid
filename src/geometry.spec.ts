import * as Compute from 'src/geometry'

describe('line', () => {
  test('computes vertical lines', () => {
    expect(Compute.line({x: 12, y: 34}, {x: 12, y: -10})).toEqual({a: 44, b: 0, c: -528})
  })

  test('computes horiztonal lines', () => {
    expect(Compute.line({x: 23, y: -8}, {x: -15, y: -8})).toEqual({a: 0, b: -38, c: -304})
  })

  test('computes lines with positive slopes', () => {
    expect(Compute.line({x: -12, y: -8}, {x: 13, y: 5})).toEqual({a: -13, b: 25, c: 44})
  })

  test('computes lines with negative slopes', () => {
    expect(Compute.line({x: -12, y: 14}, {x: 13, y: -10})).toEqual({a: 24, b: 25, c: -62})
  })
})

describe('circle', () => {
  test('computes circle', () => {
    const circle = Compute.circle({x: 1, y: 10}, {x: -10, y: 4})
    expect(circle).toEqual({
      h: 1,
      k: 10,
      r: expect.any(Number),
    })
    expect(circle.r).toBeCloseTo(12.529964086141668)
  })
})

describe('intersections', () => {
  describe('between circles', () => {
    test('computes for circles that overlap at two points', () => {
      const circle1 = {h: 2, k: -4, r: 5}
      const circle2 = {h: -3, k: 1, r: 5}

      const posPoint = Compute.intersection(circle1, circle2, false)
      expect(posPoint.x).toBeCloseTo(-3, 8)
      expect(posPoint.y).toBeCloseTo(-4, 8)

      const negPoint = Compute.intersection(circle1, circle2, true)
      expect(negPoint.x).toBeCloseTo(2, 8)
      expect(negPoint.y).toBeCloseTo(1, 8)
    })

    test('computes for circles that overlap at one point', () => {
      const circle1 = {h: 2, k: -7, r: 6}
      const circle2 = {h: 2, k: 4, r: 5}

      const posPoint = Compute.intersection(circle1, circle2, false)
      expect(posPoint.x).toBeCloseTo(2, 8)
      expect(posPoint.y).toBeCloseTo(-1, 8)

      const negPoint = Compute.intersection(circle1, circle2, true)
      expect(negPoint.x).toBeCloseTo(2, 8)
      expect(negPoint.y).toBeCloseTo(-1, 8)
    })

    test('computes for circles that overlap at infinite points', () => {
      const circle = {h: 2, k: -7, r: 6}

      expect(() => Compute.intersection(circle, circle, true)).toThrowError(
        new Compute.GeometryError('Circles overlap at all points.'),
      )

      expect(() => Compute.intersection(circle, circle, false)).toThrowError(
        new Compute.GeometryError('Circles overlap at all points.'),
      )
    })

    test('computes for circles that do not overlap', () => {
      const circle1 = {h: 2, k: 2, r: 2}
      const circle2 = {h: 10, k: 10, r: 2}

      expect(() => Compute.intersection(circle1, circle2, true)).toThrowError(
        new Compute.GeometryError('Circles do not intersect.'),
      )

      expect(() => Compute.intersection(circle1, circle2, false)).toThrowError(
        new Compute.GeometryError('Circles do not intersect.'),
      )
    })
  })

  describe('between lines', () => {
    test('computes for lines that overlap at one point', () => {
      const line1 = {a: 4, b: 2, c: -8}
      const line2 = {a: -4, b: 5, c: -6}

      const point = Compute.intersection(line1, line2)
      expect(point.x).toBeCloseTo(1, 8)
      expect(point.y).toBeCloseTo(2, 8)
    })

    test('computes for lines that overlap at infinite points', () => {
      const line1 = {a: 4, b: 2, c: -8}
      const line2 = {a: 8, b: 4, c: -16}

      expect(() => console.log(Compute.intersection(line1, line2))).toThrowError(
        new Compute.GeometryError('Lines overlap at all points.'),
      )
    })

    test('computes for lines that do not overlap', () => {
      const line1 = {a: 4, b: 2, c: -8}
      const line2 = {a: 4, b: 2, c: -16}

      expect(() => Compute.intersection(line1, line2)).toThrowError(
        new Compute.GeometryError('Lines do not intersect.'),
      )
    })
  })

  describe('between a circle and a line', () => {
    test('computes for a circle and line that overlap at two points', () => {
      const line = {a: 2, b: 2, c: -8}
      const circle = {h: 2, k: 4, r: 2}

      const posPoint = Compute.intersection(circle, line, true)
      expect(posPoint.x).toBeCloseTo(0, 8)
      expect(posPoint.y).toBeCloseTo(4, 8)

      const negPoint = Compute.intersection(line, circle, false)
      expect(negPoint.x).toBeCloseTo(2, 8)
      expect(negPoint.y).toBeCloseTo(2, 8)
    })

    test('computes for a circle and line that overlap at one point', () => {
      const line = {a: 2, b: 0, c: -8}
      const circle = {h: 2, k: 4, r: 2}

      const posPoint = Compute.intersection(circle, line, true)
      expect(posPoint.x).toBeCloseTo(4, 8)
      expect(posPoint.y).toBeCloseTo(4, 8)

      const negPoint = Compute.intersection(line, circle, false)
      expect(negPoint.x).toBeCloseTo(4, 8)
      expect(negPoint.y).toBeCloseTo(4, 8)
    })

    test('computes for a circle and line that do not overlap', () => {
      const line = {a: 2, b: -4, c: -8}
      const circle = {h: 2, k: 4, r: 2}

      expect(() => Compute.intersection(circle, line, true)).toThrowError(
        new Compute.GeometryError('Circle and line do not intersect.'),
      )

      expect(() => Compute.intersection(circle, line, false)).toThrowError(
        new Compute.GeometryError('Circle and line do not intersect.'),
      )
    })
  })
})
