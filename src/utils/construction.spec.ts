import * as Construction from 'src/utils/construction'

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
