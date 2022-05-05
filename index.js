// Getting the canvas element and context
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Setting canvas dimensions
canvas.width = 1024
canvas.height = 576

// Setting the position of the canvas and filling it
ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Creating a new HTML image with the player sprite
const playerSprite = new Image()
playerSprite.src = './img/playerDown.png'

// Creating a new HTML image with Pellet Town background
const pelletTown = new Image()
pelletTown.src = './img/PelletTown.png'

// Sprite class containing constructor for different sprites
class Sprite {
  constructor({ position, image }) {
    this.position = position
    this.image = image
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y)
  }
}

// Creating a background sprite for z-axis illusion
const background = new Sprite({ 
  position: {
    x: -735,
    y: -600
  },
  image: pelletTown
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

// Creating an infinite loop for the sprite animations
function animate() {
  window.requestAnimationFrame(animate)

  // Draws Pellet Town and player at correct positions and cropping when the images load
  background.draw()
  ctx.drawImage(
    playerSprite,
    0,
    0,
    playerSprite.width / 4,
    playerSprite.height,
    canvas.width / 2 - playerSprite.width / 4 / 2,
    canvas.height / 2 - playerSprite.height / 2,
    playerSprite.width / 4,
    playerSprite.height
  )

  if (keys.w.pressed) {
    background.position.y = background.position.y + 3
  }
}

animate()

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    case 'd':
      keys.d.pressed = true
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