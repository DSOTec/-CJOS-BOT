const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "AIzaSyBX370QJPPtFAmjpQPLP83hJAh_V6D1bj8";

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ?"dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>CJOS BOT</h1>
                            <p>We are here to serve better. <br> Your chat history will be displayed here.</p>
                            </div>`
    
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) => {
    // Create new div and apply chat, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; // Return the created chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
           "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
        //    model: "text-davinci-003",
          //  prompt: userText,
          //  max_tokens: 2048,
         //   temperature: 0.2,
         //   n: 1,
           // stop: null
           contents: [{ parts: [{ text: userText }] }]
        })
    }

    // Send POST request to API, get response and set the response as paragraph element text
  /*  try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch(error) {
        console.log(error);
        pElement.textContent = "Error: Unable to fetch response."
    } */
    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            pElement.textContent = data.candidates[0].content;
        } else {
            pElement.textContent = "No response from CJOS BOT.";
        }
    } catch (error) {
        console.error(error);
        pElement.textContent = "Error: Unable to fetch response.";
    }

    // Remove the typing animation, append the paragraph element and the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent)
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="chatbot.jpg" alt="user-img">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
                <span onclick="copyResponse(this)" class="material-icons">content_copy</span>
            </div>`;

    // Create an incoming chat div with typing animation and append it to chat container
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();  // Get chatInput value and remove extra spaces
    if(!userText) return; // if chatInput is empty return from here

    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="IMG_20220421_225459_188 (2).jpg" alt="user-img">
                    <p></p>
                </div>
            </div>`;

    // Create an outgoing chat div with user's message and append it to chat container
    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);

}

themeButton.addEventListener("click", () => {
    // Toggle body's class for the theme mode and save updated theme to the local storage
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ?"dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () => {
    // Remove the chats from local storage and call loadDataFromlocalstorage function
    if(confirm("Are you sure you want to delete all the chats?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
})
    
sendButton.addEventListener("click", handleOutgoingChat);









document.addEventListener("DOMContentLoaded", function () {
    function adjustPadding() {
        const headerHeight = document.querySelector(".fixed-header").offsetHeight;
        const bodyHeight = document.body.offsetHeight;
        const windowHeight = window.innerHeight;

        // If the page content is smaller than the viewport, adjust padding
        if (bodyHeight < windowHeight) {
            document.body.style.paddingTop = `${headerHeight + 20}px`; // Extra 20px for spacing
        } else {
            document.body.style.paddingTop = `${headerHeight}px`;
        }
    }

    adjustPadding();
    window.addEventListener("resize", adjustPadding);
})
