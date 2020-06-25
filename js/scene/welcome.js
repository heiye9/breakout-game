class WelcomeScene extends Scene {
  constructor() {
    super()
    this.onLoad()
  }

  draw(ctx) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, 500, 300)
    ctx.fillStyle = '#fff'
    ctx.font = '20px 微软雅黑'
    ctx.fillText('打砖块游戏', 50, 100)
    ctx.fillText('使用鼠标移动挡板，按P暂停游戏', 50, 130)
    ctx.fillText('按回车键开始游戏...', 50, 200)
  }

  handler = {
    keydown: (e) => {
      log('welcome场景keydown事件触发')
      if (e.key === 'Enter') {
        EventBus.trigger(EventType.GO_GAMING_SCENE)
      }
    },
  }

  onLoad() {
    window.addEventListener('keydown', this.handler.keydown)
  }

  onDestroy() {
    window.removeEventListener('keydown', this.handler.keydown)
  }
}

window.global.scene.WelcomeScene = WelcomeScene
