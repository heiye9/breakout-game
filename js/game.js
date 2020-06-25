class Game {
  
  constructor() {
    this.canvas = document.querySelector('#canvas')
    this.context = this.canvas.getContext('2d')

    EventBus.on(EventType.CHANGE_FPS, () => {
      this.stop()
      this.run()
    })

  }

  run() {
    let fps = window.global.config.fps
    this.timer = setInterval(() => {
      this.scene.update()
      this.scene.draw(this.context)
    }, 1000 / fps)
  }

  stop() {
    clearInterval(this.timer)
    this.timer = null
  }

  replaceScene(scene) {
    if (this.scene && typeof this.scene.onDestroy === 'function') {
      this.scene.onDestroy()
    }
    this.scene = scene
  }
}

window.global.Game = Game
