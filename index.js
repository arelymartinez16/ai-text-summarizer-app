const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const summarizeText = require('./summarize.js');
const translateText = require('./translate.js');

// Parses JSON bodies (as sent by API clients)
app.use(express.json());

// Serves static files from the 'public' directory
app.use(express.static('public'));

app.use(cors());

const token = process.env['ACCESS_TOKEN']

// Call the Hugging Face Inference API to summarize text by making POST request
app.post('/summarize', (req, res) => {
  // get the text_to_summarize property from the request body
  const text = req.body.text_to_summarize;

   // call your summarizeText function, passing in the text from the request
  summarizeText(text) 
    .then(response => {
      res.send(response); // Send the summary text as a response to the client
    })
    .catch(error => {
      console.log(error.message);
    });
});

// app.post("/translate", (req, res) => {
//   const text = req.body.text_to_translate;
//   const targetLanguage = req.body.target_language;

//   translateText(text, targetLanguage)
//     .then(response => {
//       res.send(response);
//       console.log("Received translation request")
//     })
//     .catch(error => {
//       console.log(error.message);
//     });
// });
app.post("/translate", async (req, res) => {
  const text = req.body.text_to_translate;
  const targetLanguage = req.body.target_language;

  try {
    const translatedText = await translateText(text, targetLanguage);

    // Send the translated text as JSON
    res.status(200).json({ translatedText: translatedText });
    console.log("Received translation request");
  } catch (error) {
    console.error(error.message);

    // Handle the error and send an appropriate JSON response
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get("/getAccessToken", (req, res) => {
  res.json({ token });
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
