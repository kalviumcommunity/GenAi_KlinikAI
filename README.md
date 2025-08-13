# GenAI Prompting Interface

A modern web application that demonstrates **Zero-Shot** and **Multi-Shot** AI prompting techniques using the Groq API.

## 🚀 Features

- **Zero-Shot Prompting**: Send direct prompts to AI without examples
- **Multi-Shot Prompting**: Provide examples to guide AI responses
- **Beautiful UI**: Modern, responsive design with smooth animations
- **API Key Management**: Secure storage of your Groq API key
- **Example Prompts**: Pre-built examples for quick testing
- **Real-time Responses**: See AI responses instantly in the browser

## 🛠️ Setup

### 1. Get a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it starts with `gsk_`)

### 2. Run the Application

1. **Option A: Simple HTTP Server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Option B: Live Server Extension (VS Code)**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Option C: Direct File Opening**
   - Simply double-click `index.html` to open in your browser
   - Note: Some browsers may block API calls when opening files directly

### 3. Configure API Key

1. Open the application in your browser
2. Enter your Groq API key in the "API Configuration" section
3. The key will be saved locally for future use

## 📖 How to Use

### Zero-Shot Prompting

1. Enter your prompt in the "Zero-Shot Prompting" section
2. Click "Send Zero-Shot Prompt"
3. View the AI's response

**Example prompts:**
- "Can you give me a chocolate cake recipe?"
- "Explain quantum computing in simple terms"
- "Write a short poem about autumn"

### Multi-Shot Prompting

1. Customize the multi-shot prompt with your own examples
2. Click "Send Multi-Shot Prompt"
3. See how the AI follows the pattern you've established

**Built-in examples include:**
- Movie recommendations based on mood and genre
- Creative writing assistance
- Recipe generation

## 🔧 Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **API**: Groq API (llama3-8b-8192 model)
- **Storage**: Local browser storage for API key
- **Responsive**: Works on desktop and mobile devices

## 📱 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚨 Troubleshooting

### Common Issues

1. **"Please enter your Groq API key first"**
   - Make sure you've entered your API key in the configuration section

2. **"Error: HTTP 401"**
   - Your API key is invalid or expired
   - Generate a new key from the Groq console

3. **"Error: HTTP 429"**
   - You've exceeded your API rate limits
   - Wait a moment before trying again

4. **CORS Errors**
   - Use a local HTTP server instead of opening the file directly
   - The Groq API supports CORS for web applications

### API Limits

- **Free Tier**: 100 requests per minute
- **Paid Plans**: Higher limits based on your subscription

## 🎯 Use Cases

- **Content Creation**: Generate articles, stories, and creative content
- **Learning**: Get explanations and examples for complex topics
- **Problem Solving**: Receive step-by-step solutions
- **Creative Writing**: Develop characters, plots, and dialogue
- **Business**: Draft emails, proposals, and marketing copy

## 🔒 Security Notes

- Your API key is stored locally in your browser
- Never share your API key publicly
- The application runs entirely in your browser
- No data is sent to external servers except Groq's API

## 📚 Learning Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Zero-Shot vs Few-Shot Learning](https://en.wikipedia.org/wiki/Few-shot_learning)

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application!

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

---

**Happy Prompting! 🎉**
