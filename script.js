const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");
const lightModeButton = document.querySelector("#theme-btn");

let userText = null;
const API_KEY = "AIzaSyAukjhDP_-ThJwz07mdoeO2vXo52-9PI_Y";

const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const pElement = document.createElement("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        
        console.log("API Response:", data);
        
        if (data.candidates && data.candidates.length > 0) {
       pElement.textContent = data.candidates[0].content.parts[0].text;        } else {
            pElement.textContent = "No response from Gemini AI.";
        }
    } catch (error) {
        console.error(error);
        pElement.textContent = "Error: Unable to fetch response.";
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
};

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
};

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

    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;

    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="IMG_20220421_225459_188 (2).jpg" alt="user-img">
                    <p></p>
                </div>
            </div>`;

    const outgoingChatDiv = createElement(html, "outgoing");
    outgoingChatDiv.querySelector("p").textContent = userText;
    chatContainer.appendChild(outgoingChatDiv);
    chatInput.value = ""; // Clear the input box after sending the message
    setTimeout(showTypingAnimation, 500);
};

sendButton.addEventListener("click", handleOutgoingChat);
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleOutgoingChat();
    }
});

// Delete Chat Functionality
deleteButton.addEventListener("click", () => {
    chatContainer.innerHTML = "";
});

// Light Mode Toggle
lightModeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});

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
