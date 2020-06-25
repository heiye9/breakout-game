class GamingScene extends Scene {
  constructor() {
    super()
    this.onLoad()
  }

  handler = {
    /**
     * 这里必须要用箭头函数
     * 如果不用箭头函数，则需要在onLoad绑定事件时，使用bind修改this环境
     * 但如果使用了bind，则在onDestroy中无法正常的解除事件
     */
    mousedown: (e) => {
      if (!this.paused) {
        // 暂停状态才可以移动小球，所以暂停状态才监听鼠标按下
        return
      }
      // 计算光标相对于canvas的x y坐标
      const x = e.clientX - document.querySelector('#canvas').offsetLeft
      const y = e.clientY - document.querySelector('#canvas').offsetTop

      if (x > this.ball.x && x < this.ball.x + this.ball.width) {
        if (y > this.ball.y && y < this.ball.y + this.ball.height) {
          this.moveBall = true
          log('开始移动球')
        }
      }

    },
    mouseup: (e) => {
      this.moveBall = false
    },
    mousemove: (e) => {
      if (!this.paused) {
        // 未暂停情况下，可以移动挡板
        const offsetX = e.clientX - document.querySelector('#canvas').offsetLeft
        this.paddle.x = offsetX - this.paddle.width / 2
        this.paddle.fixPosition()
      }

      if (this.moveBall) {
        // 这里是暂停时作弊移动小球
        // 计算光标相对于canvas的x y坐标
        let x = e.clientX - document.querySelector('#canvas').offsetLeft
        let y = e.clientY - document.querySelector('#canvas').offsetTop

        this.ball.x = x - this.ball.r
        this.ball.y = y - this.ball.r

        // 修复球的位置
        if (this.ball.x < 0) {
          this.ball.x = 0
        }
        if (this.ball.x + this.ball.width > 500) {
          this.ball.x = 500 - this.ball.width
        }
        if (this.ball.y < 0) {
          this.ball.y = 0
        }
        if (this.ball.y > 300) {
          this.ball.y = 300 - this.ball.height
        }
      }

    },
    keydown: (e) => {
      if (e.code === 'KeyP') {
        this.paused = !this.paused
      }
    },

  }

  onLoad() {
    this.moveBall = false // 小球是否可以移动
    this.paused = false
    this.levels = JSON.parse(localStorage.levels)
    this.level = 0 // 当前关卡
    this.maxLevel = this.levels.length - 1 // 最大关卡
    this.score = 0
    this.loadLevelMap()
    Object.keys(this.handler).forEach(event => {
      window.addEventListener(event, this.handler[event])
    })

  }

  onDestroy() {
    Object.keys(this.handler).forEach(event => {
      window.removeEventListener(event, this.handler[event])
    })
  }

  update() {
    if (this.paused) {
      return
    }

    if (this.ball.y + this.ball.height > this.paddle.y + 5) {
      // if (this.ball.y > 305) {
      // gg
      setTimeout(() => {
        EventBus.trigger(EventType.GO_DEFEAT_SCENE, { score: this.score })
      }, 1000 / window.global.config.fps * 3)
    }

    if (!this.blocks.some(i => i.alive === true)) {
      // 打完了所有砖块
      if (this.level >= this.maxLevel) {
        // 所有关卡都打完了，进入胜利场景
        EventBus.trigger(EventType.GO_Victory_SCENE, { score: this.score })
      } else {
        // 等待小球下落到一定位置，然后再进入下一关卡，否则会出现球和砖块重叠
        if (this.ball.y > 50 * 4.5) {
          this.level++
          this.loadLevelMap()
        }
      }
    }

    this.ball.update()

    // 检测球和挡板、砖块的碰撞
    this.checkBallAndRectCollide(this.ball, this.paddle)
    for (let block of this.blocks) {
      if (block.alive) {
        const collide = this.checkBallAndRectCollide(this.ball, block)
        if (collide) {
          this.score++ // 打中砖块加一分
          block.kill()
        }
      }
    }

  }

  draw(ctx) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, 500, 300)
    this.paddle.draw(ctx)
    this.blocks.forEach(b => b.alive && b.draw(ctx))
    this.ball.draw(ctx)
    // 画分数
    ctx.fillStyle = '#fff'
    ctx.font = '20px 微软雅黑'
    ctx.fillText('Score:' + this.score, 10, 300 - 12)
    if (this.paused) {
      ctx.fillText('已暂停', 420, 300 - 12)
    }
  }

  checkBallAndRectCollide(ball, rect) {
    // p:          球心到矩形的最短线段在矩形某一边上的点
    // collide:    是否碰撞
    // center:     球的圆心
    // lastCenter: 上一个周期的圆心
    const { collide, p, center } = global.util.checkCollision(ball, rect)
    const lastCenter = { x: ball.lastX, y: ball.lastY }
    if (!collide) {
      return false
    }
    if (
      (
        p.x === rect.x // 球在矩形的左边
        ||
        p.x === rect.x + rect.width // 右边
      )
      &&
      (
        p.y === rect.y // 上边
        ||
        p.y === rect.y + rect.height // 下边
      )
    ) {
      // 走到这里说明p点正好在矩形的四角，说明小球正好撞到了矩形的四个角
      // 需要借助上一帧圆心的位置，来进一步判断是否要反转 x 和 y
      if (
        !(lastCenter.x > rect.x && lastCenter.x < rect.x + rect.width)
        &&
        !(lastCenter.y > rect.y && lastCenter.y < rect.y + rect.height)
      ) {
        // 走到这里说明
        // 球是从外侧直击矩形的某个角，需要同时反转 x 和 y，让球弹回去
        ball.reverseX()
        ball.reverseY()
      } else {
        if (lastCenter.x > rect.x && lastCenter.x < rect.x + rect.width) {
          // 上个周期球心的 x 在矩形的宽之内，所以只反转 y，不能反转 x
          ball.reverseY()
        } else {
          // 同理
          ball.reverseX()
        }
      }

    } else {

      if (p.x === rect.x // 球在矩形的左边
        || p.x === rect.x + rect.width // 右边
      ) {
        ball.reverseX()
      }
      {
        ball.reverseY()

      }

    }
    return true
  }

  // 加载关卡地图
  loadLevelMap() {
    if (!this.paddle) {
      this.paddle = new Paddle(200, 300 - 30)
    }
    if (!this.ball) {
      this.ball = new Ball(240, 300 - 80)
    }

    const blocks = []
    const levelMap = this.levels[this.level]
    console.log(levelMap)
    for (let i = 0; i < levelMap.length; i++) {
      for (let j = 0; j < levelMap[0].length; j++) {
        if (levelMap[i][j] === 0) {
          continue
        }
        let b = new Block(j * 70 + 2, i * 27 + 2)
        blocks.push(b)
      }
    }
    this.blocks = blocks
  }
}

window.global.scene.GamingScene = GamingScene
