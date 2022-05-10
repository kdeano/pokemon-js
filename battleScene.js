const battleBgImage = new Image()
battleBgImage.src = './img/battleBackground.png'

const battleBackground = new Sprite({ 
  position: {
    x: 0,
    y: 0
  },
  image: battleBgImage
})

let emby 
let draggle
let renderedSprites
let battleAnimationId
let attackQueue

function initBattle() {
  document.querySelector('#battle-scene-wrapper').style.display = 'block'
  document.querySelector('#dialogue-box').style.display = 'none'
  document.querySelector('#enemy-health-bar').style.width = '100%'
  document.querySelector('#player-health-bar').style.width = '100%'
  document.querySelector('#battle-moveset').replaceChildren()

  emby = new Monster(monsters.Emby)
  draggle = new Monster(monsters.Draggle)
  renderedSprites = [draggle, emby]
  attackQueue = []

  emby.attacks.forEach(attack => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#battle-moveset').append(button)
  })

  // Event listeners for attack buttons
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      emby.attack({ 
        attack: selectedAttack,
        recipient: draggle,
        renderedSprites
      })

      if (draggle.health <= 0) {
        attackQueue.push(() => {
          draggle.faint()
        })
        attackQueue.push(() => {
          // Fade back to black
          gsap.to('#flashing-div', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#battle-scene-wrapper').style.display = 'none'
              
              gsap.to('#flashing-div', {
                opacity: 0
              })

              battle.initiated = false
              audio.battle.stop()
              audio.map.play()
            }
          })
        })
      }

      // Enemy attacks
      const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

      attackQueue.push(() => {
        draggle.attack({ 
          attack: randomAttack,
          recipient: emby,
          renderedSprites
        })

        if (emby.health <= 0) {
          attackQueue.push(() => {
            emby.faint()
          })
          attackQueue.push(() => {
            // Fade back to black
            gsap.to('#flashing-div', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#battle-scene-wrapper').style.display = 'none'
                
                gsap.to('#flashing-div', {
                  opacity: 0
                })

                battle.initiated = false
                audio.battle.stop()
                audio.map.play()
              }
            })
          })
        }
      })
    })

    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      document.querySelector('#attack-type').innerHTML = selectedAttack.type
      document.querySelector('#attack-type').style.color = selectedAttack.color
      document.querySelector('#attack-dmg').innerHTML = selectedAttack.damage + ' damage'
    })
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  
  battleBackground.draw()

  renderedSprites.forEach(sprite => {
    sprite.draw()
  })
}

animate()
// initBattle()
// animateBattle()

document.querySelector('#dialogue-box').addEventListener('click', (e) => {
  if (attackQueue.length > 0) {
    attackQueue[0]()
    attackQueue.shift()
  } else e.currentTarget.style.display = 'none'
})