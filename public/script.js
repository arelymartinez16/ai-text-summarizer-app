const textArea = document.getElementById("text_to_summarize");

const submitButton = document.getElementById("submit-button");

const summarizedTextArea = document.getElementById("summary");

const translateTextArea = document.getElementById("translated-text");

const translatedButton = document.getElementById("translate-button");

const languageSelect = document.getElementById('language-select');

let token; 

textArea.addEventListener("input", verifyTextLength);
// summarizedTextArea.addEventListener("input", verifyTextLength);

submitButton.addEventListener("click", submitData);
translatedButton.addEventListener("click", translateText);

// First, we disable the submit and translate button by default when the user loads the website.
submitButton.disabled = true;
translatedButton.disabled = true;

// Next, we define a function called verifyTextLength(). This function will be called when the user enters something in the text area. It receives an event, called ‘e’ here
function verifyTextLength(e) {

  // The e.target property gives us the HTML element that triggered the event, which in this case is the textarea. We save this to a variable called ‘textarea’
  const textarea = e.target;

  // Check if the text in the text area is the right length - between 200 and 100,000 characters
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    // If it is, we enable the submit button.
    submitButton.disabled = false;
  } 
  // else if (summarizedTextArea.value.length > 200 && summarizedTextArea.value.length < 100000) {
  //   translatedButton.disabled = false;
  // } 
  else {
    // If it is not, we disable the submit button.
    submitButton.disabled = true;
  }
}

function submitData(e) {

  // This is used to add animation to the submit button
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  // INSERT CODE SNIPPET FROM POSTMAN BELOW
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  var raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/summarize", requestOptions)
    .then(response => response.text())
    .then(summary => {
      // Do something with the summary response from the back end API!

      // Update the output text area with new summary
      summarizedTextArea.value = summary;

      // Stop the spinning loading animation
      submitButton.classList.remove("submit-button--loading");
      translatedButton.disabled = false;
    })
    .catch(error => console.log(error.message));
}

// Next steps: Translate summary to a different language
function translateText(e) {
  console.log('Translate button clicked');

  const selectedLanguage = languageSelect.value;
  
  translatedButton.classList.add("submit-button--loading");

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  const text_to_translate = summarizedTextArea.value;

  console.log("Text to translate: " + text_to_translate);
  console.log("Selected language: " + selectedLanguage);

  var raw = JSON.stringify({
    "text_to_translate": text_to_translate,
    "target_language": selectedLanguage
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("/translate", requestOptions)
    .then(response => {
      // console.log('Translation API Response:', response);
      response.text()
    })
    .then(translateTxt => {
      console.log('Translated Text: ', translateTxt);
      translateTextArea.value = translateTxt;
      console.log(translateTextArea.value)
      // Stop the spinning loading animation
      translatedButton.classList.remove("submit-button--loading");

    })
    .catch(error => console.log('error', error));
}

async function fetchToken() {
  try {
    const response = await fetch('/getAccessToken'); // This should be the path to your server endpoint
    const data = await response.json();
    token = data.token;
    // console.log(token)
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
}

fetchToken();