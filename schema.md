# Schema
A construction is defined by a set of base points, elements and intersections built from them.

```json
{
  "points": [
    ...
  ],
  "elements": [
    ...
  ],
  "intersections": [
    ...
  ]
}
```

## Points
A point requires a x and y position. The initial canvas is guaranteed to have a width and height of at least 200 with the origin at the center.
Reference points using their index in the point list with the point prefix (eg. `p-0` for the first point).

* `x` - `Number`
* `y` - `Number`

```json
{
  "x": 20,
  "y": -10
}
```

## Elements
Reference elements using their index in the elements list with the element prefix (eg. `e-0` for the first element).
Intersections can be used instead of points.

### Circles
A circle requires an center point and an edge point.

* `center` - `String`
* `edge` - `String`

```json
{
  "type": "circle",
  "center": "p-0",
  "edge": "i-1"
}
```

### Lines
A line requires two points.
In addition, a line can be extended infinitely in either direction.

* `left` - `String`
* `right` - `String`
* `extend` - `'none' | 'left' | 'right' | 'both'`

```json
{
  "type": "line",
  "left": "p-0",
  "right": "i-1",
  "extend": "left"
}
```

## Intersections

Intersections can be used in place of points. They require two elements and in some cases a flag to indicate which intersection to use.

* `elements` - `[String]`
* `neg` - `Boolean`

```json
{
  "elements": ["e-0", "e-1"],
  "neg": true
}
