// event bus 用的事件类型
EventType = {
  GO_GAMING_SCENE: '1',
  GO_Victory_SCENE: '2',
  GO_DEFEAT_SCENE: '3',
  GO_WELCOME_SCENE: '4',
  CHANGE_FPS: '5',
}

// event bus
EventBus = {
  
  eventMap: {},

  on(type, fn) {
    if (!this.eventMap[type]) {
      this.eventMap[type] = []
    }
    if (this.eventMap[type].indexOf(fn) === -1) {
      this.eventMap[type].push(fn)
    }
    return this
  },

  trigger(type, args) {
    const fns = this.eventMap[type]
    if (Array.isArray(fns)) {
      fns.forEach(fn => fn(args))
    }
  },
}


/**
 * 检测球的球心和矩形的最短距离，用于计算是否碰撞
 */
checkCollision = function (circle, rect) {
  // center: 球心坐标
  const center = {
    x: circle.x + circle.width / 2,
    y: circle.y + circle.height / 2,
  }
  // 矩形边离球心最近的点
  const p = { x: 0, y: 0 }
  // 找 p.x
  if (center.x < rect.x) {
    // 球心在矩形左侧
    p.x = rect.x
  } else if (center.x > rect.x + rect.width) {
    // 球心在矩形右侧
    p.x = rect.x + rect.width
  } else {
    p.x = center.x
  }
  // 找 p.y
  if (center.y < rect.y) {
    // 球心在矩形上边
    p.y = rect.y
  } else if (center.y > rect.y + rect.height) {
    // 球心在矩形下边
    p.y = rect.y + rect.height
  } else {
    p.y = center.y
  }
  const distance = Math.sqrt(
    Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2),
  )
  return {
    distance, // 球心到矩形的距离
    center, // 球心坐标
    p, // 球心到矩形的最短线段在矩形某一边上的点
    collide: distance < circle.width / 2, // 如果p到center的距离，小于半径，说明碰撞了
  }
}

window.global.util = Object.assign(window.global.util, { EventBus, EventType, checkCollision })
