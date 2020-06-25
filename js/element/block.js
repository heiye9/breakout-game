class Block extends Element {
  constructor(x, y) {
    super()
    this.image = window.global.images.greenBlock
    this.x = x
    this.y = y
    this.width = 70
    this.height = 30
    this.alive = true
  }

  draw(ctx) {
    if (this.alive) {
      const { image, x, y, width, height } = this
      ctx.drawImage(image, x, y, width, height)
    }
  }

  kill() {
    this.alive = false
  }
  
}

window.global.element.Block = Block
