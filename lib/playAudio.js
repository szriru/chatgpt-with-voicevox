import Player from 'play-sound'
// do like this instead of the CommonJS way require("play").({})

// playAudio returns void or throws an error
export const playAudio = (pathToAudio, func) => {
  const audio = new Player({ player: "powershell" })
  audio.play(pathToAudio, function (err) {
    if (err) throw new Error(err)
  })
  func()
}