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
  animate: true,
  isEnemy: true,
  name: 'Draggle'
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
  animate: true,
  name: 'Emby'
})

const renderedSprites = [draggle, emby]

function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  
  battleBackground.draw()

  renderedSprites.forEach(sprite => {
    sprite.draw()
  })
}

animateBattle()

// Event listeners for attack buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML]
    emby.attack({ 
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites
    })
  })
})

document.querySelector('#dialogue-box').addEventListener('click', (e) => {
  e.currentTarget.style.display = 'none'
  console.log('clicked dialogue')
})