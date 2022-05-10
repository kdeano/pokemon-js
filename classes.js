class Sprite {
  constructor({ 
    position, 
    image, 
    frames = { max: 1, hold: 10 }, 
    sprites, 
    animate = false,
    rotation = 0
  }) {
    this.position = position
    this.image = new Image()
    this.frames = { ...frames, val: 0, elapsed: 0 }

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.image.src = image.src

    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation
  }

  draw() {
    ctx.save()
    ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
    ctx.rotate(this.rotation)
    ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
    ctx.globalAlpha = this.opacity
    ctx.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    )
    ctx.restore()

    if (!this.animate) return

    if (this.frames.max > 1) this.frames.elapsed++

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class Monster extends Sprite {
  constructor({ 
    position, 
    image, 
    frames = { max: 1, hold: 10 }, 
    sprites, 
    animate = false,
    rotation = 0,
    isEnemy = false, 
    name,
    attacks
  }) {
    super({
      position, 
      image, 
      frames, 
      sprites, 
      animate,
      rotation,
    })

    this.health = 100,
    this.isEnemy = isEnemy,
    this.name = name
    this.attacks = attacks
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialogue-box').style.display = 'block'
    document.querySelector('#dialogue-box').innerHTML = this.name + ' used ' + attack.name + '.'

    let healthBar = '#enemy-health-bar'
    if (this.isEnemy) healthBar = '#player-health-bar'

    let rotation = 1
    if (this.isEnemy) rotation = -1

    recipient.health -= attack.damage

    switch (attack.name) {
      case 'Tackle':
        const timeline = gsap.timeline()

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        timeline.to(this.position, {
          x: this.position.x - movementDistance
        }).to(this.position, {
          x: this.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete: () => {
            // Enemy gets hit
            audio.tackleHit.play()
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
          }
        }).to(this.position, {
          x: this.position.x
        })

        break
      case 'Fireball':
        audio.initFireball.play()

        const fireballImage = new Image()
        fireballImage.src = './img/fireball.png'
        
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 30
          },
          animate: true,
          rotation
        })

        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          duration: 0.65,
          onComplete: () => {
            audio.fireballHit.play()
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })

            renderedSprites.splice(1, 1)
          }
        })

        break
    }
  }

  faint() {
    document.querySelector('#dialogue-box').innerHTML = this.name + ' fainted!'

    gsap.to(this.position, {
      y: this.position.y + 20
    })

    gsap.to(this, {
      opacity: 0
    })

    audio.battle.stop()
    audio.victory.play()
  }
}

class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}