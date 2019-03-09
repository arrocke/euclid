// Point: { type: 'point', x, y }
// Line: { type: 'line', p1, p2 }
// Circle: { type: 'circle', c, e }
// Intersection: { type: 'intersection', e1, e2 }

const lineParams = (p1, p2) => {
  const m = (p2.y - p1.y) / (p2.x - p1.x)
  const b = p1.y - p1.x * m
  return { m, b }
}

const circleParams = (c, e) => {
  const r = Math.sqrt(Math.pow(c.x - e.x, 2) + Math.pow(c.y - e.y, 2))
  return {
    cx: c.x,
    cy: c.y,
    r
  }
}

const intersectionParams = (e1, e2, neg) => {
  if (e1.type === 'circle' && e2.type === 'line') {
    const temp = e1
    e1 = e2
    e2 = temp
  }

  if (e1.type === 'line' && e2.type === 'line') {
    const x = (e1.b - e2.b) / (e2.m - e1.m)
    const y = e1.m * x + e1.b
    return { x, y }
  } else if (e1.type === 'line' && e2.type === 'circle') {
    const a = 1 + Math.pow(e1.m, 2)
    const b = 2 * (-e2.cx + e1.m * (e1.b - e2.cy))
    const c = Math.pow(e2.cx, 2) + Math.pow(e1.b - e2.cy, 2) - Math.pow(e2.r, 2)

    const x = (-b + (neg ? -1 : 1) * Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    const y = e1.m * x + e1.b

    return { x, y }
  } else if (e1.type === 'circle' && e2.type === 'circle') {
    const bl = (Math.pow(e1.cx, 2) - Math.pow(e2.cx, 2) + Math.pow(e1.cy, 2) - Math.pow(e2.cy, 2) - Math.pow(e1.r, 2) + Math.pow(e2.r, 2)) / (-2 * (e2.cy - e1.cy))
    const m = -(e2.cx - e1.cx) / (e2.cy - e1.cy)

    const a = 1 + Math.pow(m, 2)
    const b = 2 * (-e2.cx + m * (bl - e2.cy))
    const c = Math.pow(e2.cx, 2) + Math.pow(bl - e2.cy, 2) - Math.pow(e2.r, 2)

    const x = (-b + (neg ? -1 : 1) * Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
    const y = m * x + bl

    return { x, y }
  }
}

export default {
  layout (elements) {
    const resolved = []
    let id = 0

    // Resolve each element.
    for (let el of elements) {
      switch (el.type) {
        case 'point': {
          resolved.push({ ...el, id: id++ })
          break
        }
        case 'line': {
          const p1Ref = resolved[el.p1]
          const p2Ref = resolved[el.p2]
          resolved.push({
            ...el,
            ...lineParams(p1Ref, p2Ref),
            p1Ref,
            p2Ref,
            id: id++
          })
          break
        }
        case 'circle': {
          const cRef = resolved[el.c]
          const eRef = resolved[el.e]
          resolved.push({
            ...el,
            ...circleParams(cRef, eRef),
            cRef,
            eRef,
            id: id++
          })
          break
        }
        case 'intersection': {
          const e1Ref = resolved[el.e1]
          const e2Ref = resolved[el.e2]
          resolved.push({
            ...el,
            ...intersectionParams(e1Ref, e2Ref, el.neg),
            e1Ref,
            e2Ref,
            id: id++
          })
          break
        }
        default:
          break
      }
    }

    console.log(resolved)

    return resolved
  }
}