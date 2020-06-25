class GameoverScene extends Scene {
  constructor(score) {
    super()
    this.score = score
    this.onLoad()
  }

  handler = {
    keydown: (e) => {
      if (e.code === 'Enter') {
        EventBus.trigger(EventType.GO_WELCOME_SCENE)
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

class VictoryScene extends GameoverScene {
  constructor({ score }) {
    super(score)
  }

  draw(ctx) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, 500, 500)
    ctx.fillStyle = '#fff'
    ctx.font = '30px 微软雅黑'
    ctx.fillText('恭喜你打完了所有砖块！', 100, 100)
    ctx.fillText('你的分数是:' + this.score, 100, 140)
    ctx.fillText('按回车回到主页', 100, 180)
  }

}

class DefeatScene extends GameoverScene {
  constructor({ score }) {
    super(score)
  }

  draw(ctx) {
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, 500, 500)
    ctx.fillStyle = '#fff'
    ctx.font = '30px 微软雅黑'
    ctx.fillText('游戏结束', 100, 100)
    ctx.fillText('你的分数是:' + this.score, 100, 140)
    ctx.fillText('按回车回到主页', 100, 180)
  }

}

window.global.scene.GameoverScene = GameoverScene
window.global.scene.VictoryScene = VictoryScene
window.global.scene.DefeatScene = DefeatScene

