class Paddle extends Element {
  constructor(x, y) {
    super()
    this.image = window.global.images.paddle
    this.x = x
    this.y = y
  }

  draw(ctx) {
    const { image, x, y, width, height } = this
    ctx.drawImage(image, x, y, width, height)
  }

  get width() {
    return this.image.width
  }

  get height() {
    return this.image.height / 1.2
  }

  fixPosition() {
    if (this.x < 0) {
      this.x = 0
    }
    if (this.x > 500 - this.width) {
      this.x = 500 - this.width
    }
  }
}

window.global.element.Paddle = Paddle
