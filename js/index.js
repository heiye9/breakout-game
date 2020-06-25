let game = null

function startGame() {
  game = new Game()
  game.replaceScene(new WelcomeScene())
  game.run()

  registerEvents()

}

function registerEvents() {
  EventBus.on(EventType.GO_GAMING_SCENE, function () {
    game.replaceScene(new GamingScene())
  })
  EventBus.on(EventType.GO_Victory_SCENE, function ({ score }) {
    game.replaceScene(new VictoryScene({ score }))
  })
  EventBus.on(EventType.GO_DEFEAT_SCENE, function ({ score }) {
    game.replaceScene(new DefeatScene({ score }))
  })
  EventBus.on(EventType.GO_WELCOME_SCENE, function () {
    game.replaceScene(new WelcomeScene())
  })
}


/**
 * 加载单张图片
 */
function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = path
    img.onload = function () {
      resolve(img)
    }
  })
}

/**
 * 加载所有图片资源，并且挂载到window
 * @param {object} images 所有图片 {name: path}
 */
function preloadAllImage(images) {
  return new Promise(resolve => {
    const names = Object.keys(images)
    const promiseArr = names.map((name) => loadImage(images[name]))
    Promise.all(promiseArr).then(results => {
      window.global.images = {}
      names.forEach((name, index) => {
        window.global.images[name] = results[index]
      })
      resolve()
    })
  })
}

preloadAllImage({
  paddle: './images/paddle1.png',
  greenBlock: './images/block-green1.png',
}).then(function () {
  // 图片资源加载完毕，开始游戏
  startGame()
  console.log('global:', global)
})
