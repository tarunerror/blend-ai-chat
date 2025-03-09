
# Blend AI Chat

<p align="center">
  <img src="https://img.shields.io/badge/status-beta-blue" alt="Status: Beta">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License: MIT">
</p>

<p align="center">
  <b>A sophisticated AI chatbot interface integrating multiple AI models through OpenRouter</b>
</p>

## Overview

Blend AI Chat is a sleek, intuitive interface that lets you interact with the top AI models through a single, unified experience. Inspired by the design principles of Apple, the interface focuses on minimalism, elegance, and user experience.

### Key Features

✨ **Multiple AI Models**: Access various AI models including Claude, Gemma, Llama, Mistral, and more through OpenRouter  
🔄 **Seamless Model Switching**: Switch between models with a simple dropdown selection  
💬 **Elegant Chat Interface**: Beautiful, responsive design with smooth animations  
📱 **Fully Responsive**: Works on all devices from mobile to desktop  
🔐 **Privacy-Focused**: Your API key is stored only in your browser  
📋 **Message History**: Conversations are saved locally for future reference  

## Getting Started

### Prerequisites

- OpenRouter API key ([Get one here](https://openrouter.ai/keys))
- Modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tarunerror/blend-ai-chat.git
   cd blend-ai-chat
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

5. Enter your OpenRouter API key when prompted

## Usage

1. **Select a model**: Choose from the dropdown menu at the top of the interface
2. **Send a message**: Type your message in the input field and press Enter or click the send button
3. **View responses**: AI responses will appear in the chat window with information about which model generated them
4. **Copy responses**: Click the "Copy" button under any AI response to copy it to your clipboard
5. **Clear history**: Click "Clear Chat" to remove all messages from the current session

## Supported Models

Blend AI Chat currently integrates with the following models via OpenRouter:

- **Claude 3 Haiku** (Anthropic)
- **Gemma 7B** (Google)
- **Llama 3 8B** (Meta)
- **Mistral 7B** (Mistral AI)
- **MythoMax L2 13B** (Gryphe)

## Technical Architecture

Blend AI Chat is built with:

- **React**: Front-end UI library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **OpenRouter API**: Gateway to multiple AI models

## Customization

You can customize Blend AI Chat by modifying:

- **`tailwind.config.ts`**: Adjust color schemes, animations, and other design tokens
- **`src/lib/openrouter.ts`**: Add or modify available AI models
- **`src/components/`**: Customize individual UI components

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Before contributing, please read our [Contributing Guidelines](CONTRIBUTING.md).

## Acknowledgements

- [OpenRouter](https://openrouter.ai/) for providing access to multiple AI models
- The creators of the various AI models integrated in this application

---

<p align="center">
  Made with ❤️ by Tarun Gautam
</p>
