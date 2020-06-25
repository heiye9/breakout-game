class Ball extends Element {
  constructor(x, y) {
    super()
    this.height = this.width = 16
    this.r = this.width / 2
    this.x = x
    this.y = y
    this.speedX = 4
    this.speedY = -4
  }

  draw(ctx) {
    const { x, y, r } = this
    ctx.fillStyle = '#ff1199'
    // 画圆
    ctx.beginPath()
    ctx.arc(x + r, y + r, r, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  update() {
    // 记录上一次的坐标，辅助碰撞检测
    this.lastX = this.x
    this.lastY = this.y

    const canvasWidth = 500
    if (this.x <= 0) {
      this.reverseX()
    }
    if (this.x + this.width >= canvasWidth) {
      this.reverseX()
    }
    if (this.y <= 0) {
      this.reverseY()
    }

    this.x += this.speedX
    this.y += this.speedY
  }

  reverseX() {
    this.speedX *= -1
  }

  reverseY() {
    this.speedY *= -1
  }

  absReverseY() {
    this.speedY = -1 * Math.abs(this.speedY)
  }
}

window.global.element.Ball = Ball
