// Getting the canvas element and context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Setting canvas dimensions
canvas.width = 1024
canvas.height = 576

// Map has 70 tiles in width
const canvasWidth = 70

const collisionsMap = []
for (let i = 0; i < collisions.length; i += canvasWidth) {
  collisionsMap.push(collisions.slice(i, canvasWidth + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += canvasWidth) {
  battleZonesMap.push(battleZonesData.slice(i, canvasWidth + i))
}

const boundaries = []
const offset = {
  x: -735,
  y: -635
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(new Boundary({ 
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        }
      }))
  })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(new Boundary({ 
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        }
      }))
  })
})

// Creating a new HTML image with Pellet Town background
const pelletTown = new Image()
pelletTown.src = './img/PelletTown.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foreground.png'

// Creating a new HTML image with the player sprite
const playerSpriteDown = new Image()
playerSpriteDown.src = './img/playerDown.png'

const playerSpriteUp = new Image()
playerSpriteUp.src = './img/playerUp.png'

const playerSpriteLeft = new Image()
playerSpriteLeft.src = './img/playerLeft.png'

const playerSpriteRight = new Image()
playerSpriteRight.src = './img/playerRight.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2
  },
  image: playerSpriteDown,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerSpriteUp,
    left: playerSpriteLeft,
    right: playerSpriteRight,
    down: playerSpriteDown
  }
})

// Creating a background sprite for z-axis illusion
const background = new Sprite({ 
  position: {
    x: offset.x,
    y: offset.y
  },
  image: pelletTown
})

const foreground = new Sprite({ 
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangleCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x && 
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y <= rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height >= rect2.position.y
  )
}

const battle = {
  initiated: false
}

// Creating an infinite loop for the animations
function animate() {
  const animationId = window.requestAnimationFrame(animate)

  background.draw()
  boundaries.forEach(boundary => {
    boundary.draw()
  })
  battleZones.forEach(battleZone => {
    battleZone.draw()
  })
  player.draw()
  foreground.draw()

  let moving = true
  player.animate = false 

  if (battle.initiated) return

  // Activating a battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i]
      const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - 
                              Math.max(player.position.x, battleZone.position.x)) *
                              (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                              Math.max(player.position.y, battleZone.position.y))
      if (
        rectangleCollision({
          rect1: player,
          rect2: battleZone
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("Activating battle")

        // De-activate current animation loop
        window.cancelAnimationFrame(animationId)

        battle.initiated = true
        gsap.to('#flashingDiv', {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to('#flashingDiv', {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                // Activate new animation loop
                animateBattle()
                gsap.to('#flashingDiv', {
                  opacity: 0,
                  duration: 0.4
                })
              }
            })
          }
        })
        break
      }
    }
  } 

  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.image = player.sprites.up

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
        rectangleCollision({
          rect1: player,
          rect2: {
            ...boundary, 
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
      movables.forEach(movable => {
        movable.position.y += 3 
      })
  }
  else if (keys.a.pressed && lastKey === 'a') {
    player.animate = true
    player.image = player.sprites.left

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        rectangleCollision({
          rect1: player,
          rect2: {
            ...boundary, 
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
    movables.forEach(movable => {
      movable.position.x += 3 
    })
  }
  else if (keys.s.pressed && lastKey === 's') {
    player.animate = true
    player.image = player.sprites.down

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        rectangleCollision({
          rect1: player,
          rect2: {
            ...boundary, 
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
    movables.forEach(movable => {
      movable.position.y -= 3 
    })
  }
  else if (keys.d.pressed && lastKey === 'd') {
    player.animate = true
    player.image = player.sprites.right

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]

      if (
        rectangleCollision({
          rect1: player,
          rect2: {
            ...boundary, 
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y
            }
          }
        })
      ) {
        moving = false
        break
      }
    }

    if (moving)
    movables.forEach(movable => {
      movable.position.x -= 3 
    })
  }
}

// animate()

const battleBgImage = new Image()
battleBgImage.src = './img/battleBackground.png'

const battleBackground = new Sprite({ 
  position: {
    x: 0,
    y: 0
  },
  image: battleBgImage
})

const draggleSprite = new Image()
draggleSprite.src = './img/draggleSprite.png'

const draggle = new Sprite({
  position: {
    x: 800,
    y: 100
  },
  image: draggleSprite,
  frames: {
    max: 4,
    hold: 50
  },
  animate: true
})

const embySprite = new Image()
embySprite.src = './img/embySprite.png'

const emby = new Sprite({
  position: {
    x: 280,
    y: 325
  },
  image: embySprite,
  frames: {
    max: 4,
    hold: 50
  },
  animate: true
})

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  
  battleBackground.draw()
  draggle.draw()
  emby.draw()
}

animateBattle()

let lastKey = ''

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})