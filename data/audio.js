const audio = {
  map: new Howl({
    src: './audio/map.wav',
    html5: true,
    volume: 0.02
  }),
  initBattle: new Howl({
    src: './audio/InitBattle.wav',
    html5: true,
    volume: 0.005
  }),
  battle: new Howl({
    src: './audio/Battle.mp3',
    html5: true,
    volume: 0.005
  }),
  tackleHit: new Howl({
    src: './audio/tackleHit.wav',
    html5: true,
    volume: 0.01
  }),
  fireballHit: new Howl({
    src: './audio/fireballHit.wav',
    html5: true,
    volume: 0.01
  }),
  initFireball: new Howl({
    src: './audio/initFireball.wav',
    html5: true,
    volume: 0.01
  }),
  victory: new Howl({
    src: './audio/victory.wav',
    html5: true,
    volume: 0.035
  })
}