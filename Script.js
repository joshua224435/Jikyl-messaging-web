// ===== Firebase Setup =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// ===== DOM Elements =====
const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const telegramConnect = document.getElementById('telegram-connect');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');

// ===== Theme Toggle =====
let isDarkMode = localStorage.getItem('theme') === 'dark';

function setTheme() {
  document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  themeIcon.src = isDarkMode ? 'assets/sun-icon.png' : 'assets/moon-icon.png';
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  setTheme();
});

// Initialize theme
setTheme();

// ===== Telegram Integration =====
telegramConnect.addEventListener('click', () => {
  window.Telegram.Login.auth({ bot_id: 'YOUR_BOT_ID' }, (user) => {
    if (user) {
      userName.textContent = user.first_name;
      userAvatar.src = user.photo_url || 'assets/user-icon.png';
    }
  });
});

// ===== Chat Functionality =====
function sendMessage() {
  const message = messageInput.value.trim();
  if (message === '') return;

  db.collection('messages').add({
    text: message,
    sender: userName.textContent,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// ===== Real-Time Message Updates =====
db.collection('messages')
  .orderBy('timestamp')
  .onSnapshot((snapshot) => {
    chatArea.innerHTML = '';
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const messageElement = document.createElement('div');
      messageElement.className = 'message-card';
      messageElement.innerHTML = `
        <div class="message-header">
          <span class="sender">${msg.sender}</span>
          <span class="time">${msg.timestamp?.toDate().toLocaleTimeString() || 'Just now'}</span>
        </div>
        <div class="message-content">${msg.text}</div>
      `;
      chatArea.appendChild(messageElement);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
  });

// ===== Emoji Picker (Bonus) =====
const emojiBtn = document.getElementById('emoji-btn');
emojiBtn.addEventListener('click', () => {
  // Implement emoji picker (e.g., https://emoji-picker-react.vercel.app/)
  alert('Emoji picker would open here!');
});

// ===== AdSense Loader =====
(function() {
  const adScript = document.createElement('script');
  adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUB_ID';
  adScript.async = true;
  document.head.appendChild(adScript);
})();
