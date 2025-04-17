// test-tts.js
require("dotenv").config();
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");

async function testTTS() {
  try {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    console.log("Google credentials path:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

    // The text to synthesize
    const text = "Hello, this is a test of the Google Cloud Text-to-Speech API.";

    // Construct the request
    const request = {
      input: { text: text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    console.log("Making API request...");

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Write the binary audio content to a file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile("test-output.mp3", response.audioContent, "binary");

    console.log("Audio content written to file: test-output.mp3");
    console.log("Authentication successful!");
  } catch (error) {
    console.error("Error testing TTS API:", error);
    console.log("Authentication failed.");
  }
}

testTTS();
