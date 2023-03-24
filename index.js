import { config } from "dotenv"
config()
import { createAudioQuery } from "./lib/createAudioQuery.js"
import { synthesis } from "./lib/synthesis.js"
import { playAudio } from "./lib/playAudio.js"
import { Configuration, OpenAIApi } from 'openai'
import readline from 'readline'

//config for openAI API
const configuration = new Configuration({
  organization: process.env.ORG_ID,
  apiKey: process.env.OPENAI_APIKEY
})
const openai = new OpenAIApi(configuration)

// Message = {"role": string, "content": string}
let messages = []

//VOICEVOX Engine's url.
const serverUrl = "http://127.0.0.1:50021/"
//path to audio query that used to generate audio by VOICEVOX Engine
const pathToQuery = "./audioQuery.json"
// path to where VOICEVOX Engine creates an audio file
const pathToWav = "./audio.wav"


const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

//chat returns void or throws a error
function chat() {
  userInterface.question('User:', async (msg) => {
    if (msg === 'exit') {
      userInterface.close();
    } else {
      messages.push({
        "role": "user",
        "content": msg
      })
      openai.createChatCompletion({
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "temperature": 0.8,
        "max_tokens": 64
      }).then(async completion => {
        messages.push(completion.data.choices[0].message)
        console.log(`${messages.at(-1).role}: ${messages.at(-1).content} \n`)
        try {
          await createAudioQuery(serverUrl, messages.at(-1).content, 3, pathToQuery)
          await synthesis(serverUrl, 3, pathToQuery, pathToWav)
          //need to pass chat() function to prevent playing wav file at first loop
          await playAudio(pathToWav, chat)
        } catch (err) {
          throw new Error(err)
        }
      }
      )
    }
  })
}

chat()