import fetch from 'node-fetch';
import { writeFile } from 'fs/promises'

// createAudioQuery returns void or throws an error
//serverUrl is VOICEVOX Engine's url
//text is a text to speak
// speaker is a speaker's id, number
// pathToQuery is a path to put generated query
export const createAudioQuery = async (serverUrl, text, speaker, pathToQuery) => {
  const process = "audio_query"
  const path = pathToQuery
  let url = new URL(serverUrl + process)
  let params = {
    text: text,
    speaker: speaker
  }
  url.search = new URLSearchParams(params).toString()

  try {
    const response = await fetch(url, {
      method: "POST"
    })
    const data = await response.json();
    await writeFile(path, JSON.stringify(data), "utf8");
  } catch (e) {
    throw new Error(e)
  }
}



