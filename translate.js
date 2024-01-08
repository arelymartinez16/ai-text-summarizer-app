const axios = require('axios');

async function translateText(text, targetLanguage) {
  // Define endpoints
  const languageMappings = {
    zh: 'Helsinki-NLP/opus-mt-en-zh', // English to Chinese
    es: 'Helsinki-NLP/opus-mt-tc-big-en-es', // English to Spanish
    fr: 'Helsinki-NLP/opus-mt-tc-big-en-fr', // English to French
    it: 'Helsinki-NLP/opus-mt-tc-big-en-it', // English to Italian
    ja: 'Helsinki-NLP/opus-tatoeba-en-ja', // English to Japanese
  };

  if (!(targetLanguage in languageMappings)) {
    console.error('Invalid target language:', targetLanguage);
    return;
  }
  
  let data = JSON.stringify({
    "inputs": text,
    "parameters": {
      "max_length": 100,
      "min_length": 30
    }
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://api-inference.huggingface.co/models/${languageMappings[targetLanguage]}`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + process.env['ACCESS_TOKEN']
    },
    data : data
  };
  try {
    const response = await axios.request(config);
    // console.log(JSON.stringify(response.data));
    console.log(JSON.stringify(response.data[0].translation_text));
    return response.data[0].translation_text
    // return response;
  }
  catch (error) {
    console.log(error);
  }
}

module.exports = translateText;