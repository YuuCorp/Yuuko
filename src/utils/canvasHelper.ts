interface roundRectOptions {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  width: number
  height: number
  radius?: number | Radius
  fill?: boolean
  stroke?: boolean
}

interface Radius {
  [key: string]: number
  tl: number
  tr: number
  br: number
  bl: number
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x The top left x coordinate
 * @param {number} y The top left y coordinate
 * @param {number} width The width of the rectangle
 * @param {number} height The height of the rectangle
 * @param {number} [radius] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {number} [radius.tl] Top left
 * @param {number} [radius.tr] Top right
 * @param {number} [radius.br] Bottom right
 * @param {number} [radius.bl] Bottom left
 * @param {boolean} [fill] Whether to fill the rectangle.
 * @param {boolean} [stroke] Whether to stroke the rectangle.
 */
export function roundRect({ ctx, x, y, width, height, radius, fill, stroke }: roundRectOptions) {
  if (typeof stroke === 'undefined')
    stroke = true

  if (typeof radius === 'undefined')
    radius = 5

  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  }
  else {
    const defaultRadius: Radius = { tl: 0, tr: 0, br: 0, bl: 0 }
    for (const side in defaultRadius) radius[side] = radius[side] || defaultRadius[side]
  }
  ctx.beginPath()
  ctx.moveTo(x + radius.tl, y)
  ctx.lineTo(x + width - radius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  ctx.lineTo(x + width, y + height - radius.br)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  ctx.lineTo(x + radius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  ctx.lineTo(x, y + radius.tl)
  ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  ctx.closePath()
  if (fill)
    ctx.fill()

  if (stroke)
    ctx.stroke()
}
