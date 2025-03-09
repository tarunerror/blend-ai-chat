
# Blend AI Chat

<p align="center">
  <img src="https://img.shields.io/badge/status-beta-blue" alt="Status: Beta">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License: MIT">
</p>

<p align="center">
  <b>A sophisticated AI chatbot interface integrating multiple advanced AI models through OpenRouter</b>
</p>

## Overview

Blend AI Chat is a sleek, intuitive interface that lets you interact with the top AI models through a single, unified experience. The interface features a modern, cosmic-inspired design with subtle animations and a carefully crafted color scheme that enhances user engagement and readability.

### Key Features

✨ **Multiple AI Models**: Access various AI models including Dolphin Mixtral, Claude, Gemma, Llama, and more through OpenRouter  
🔄 **Seamless Model Switching**: Switch between models with a simple dropdown selection  
🌓 **Light/Dark Mode**: Automatic theme detection with manual toggle option  
💬 **Elegant Chat Interface**: Beautiful, responsive design with smooth animations and transitions  
📱 **Fully Responsive**: Works on all devices from mobile to desktop  
🚀 **Space News Integration**: Browse the latest space news from Spaceflight News API  
🔖 **Bookmark Articles**: Save interesting articles for later reading  
🔍 **Search Functionality**: Find specific space news articles  
🔐 **Privacy-Focused**: Your API key is stored only in your browser  
📋 **Message History**: Conversations are saved locally for future reference  
📤 **Export Options**: Save your conversations for later reference  

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

4. Open your browser and navigate to `http://localhost:5173`

5. Enter your OpenRouter API key when prompted

## Usage

1. **Select a model**: Choose from the dropdown menu at the top of the chat interface
2. **Send a message**: Type your message in the input field and press Enter or click the send button
3. **View responses**: AI responses will appear in the chat window with information about which model generated them
4. **Toggle theme**: Switch between light and dark mode using the sun/moon icon in the header
5. **Browse news**: Access the latest space news by clicking on the news icon
6. **Copy responses**: Click the "Copy" button under any AI response to copy it to your clipboard
7. **Clear history**: Click "Clear Chat" to remove all messages from the current session

## News Features

The Space News feature provides:

- **Latest Space News**: Automatically fetches the most recent articles from Spaceflight News API
- **Search Capability**: Find specific articles by keyword 
- **Topic Filtering**: Browse by topics like NASA, SpaceX, Mars, etc.
- **Source Filtering**: Filter by news sources
- **Bookmarking**: Save articles for later reference
- **Grid/List Views**: Choose your preferred viewing style
- **Responsive Design**: Optimized for all devices

## Supported Models

Blend AI Chat currently integrates with the following models via OpenRouter:

- **Dolphin Mixtral 8x22B** (Cognitive Computations)
- **Claude 3 Haiku** (Anthropic)
- **Gemma 7B** (Google)
- **Llama 3 8B** (Meta)
- **MythoMax L2 13B** (Gryphe)

## Technical Architecture

### Frontend Components

Blend AI Chat is built with a modern React architecture utilizing the following component structure:

- **App**: The main application container that sets up routing, query client, and global providers
- **ChatPage**: The primary page component managing chat sessions and UI state
- **Header**: Application header with theme toggle and sidebar controls
- **ChatSidebar**: Sidebar for session management and navigation
- **ChatContainer**: Main chat interface with message display and input
- **Articles**: Modular space news browser with filtering and search capabilities
- **AnimatedBackground**: Provides subtle visual elements to enhance the UI

### State Management

- **React Query**: Used for data fetching and state management
- **Custom Hooks**: Specialized hooks for theme management, session management, article management and UI state
- **Local Storage**: Persists chat sessions, saved articles, and user preferences

### Styling

- **TailwindCSS**: Utility-first CSS framework for responsive design
- **CSS animations**: Custom animations for UI elements and interactions
- **Shadcn/UI components**: Pre-built accessible UI components

## Codebase Structure

The project follows a modular architecture for maintainability and scalability:

```
src/
├── components/         # Reusable UI components
│   ├── article/        # Components for news article display
│   └── ui/             # Shadcn UI components
├── features/           # Feature-specific components
│   └── chat/           # Chat interface components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API clients
├── pages/              # Top-level page components
└── types/              # TypeScript type definitions
```

## Customization

You can customize Blend AI Chat by modifying:

- **`tailwind.config.ts`**: Adjust color schemes, animations, and other design tokens
- **`src/index.css`**: Modify global styles and theme variables
- **`src/lib/openrouter.ts`**: Add or modify available AI models
- **`src/lib/newsapi.ts`**: Change news API settings or sources

## Performance Optimizations

- **Component Splitting**: UI is divided into small, focused components for better maintainability
- **Query caching**: Efficient data fetching with React Query
- **Code splitting**: Only loads necessary components for the current view
- **Throttled animations**: Performance-optimized visual effects
- **Responsive design**: Optimized for all screen sizes with tailored mobile experience

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Before contributing, please read our [Contributing Guidelines](CONTRIBUTING.md).

## Acknowledgements

- [OpenRouter](https://openrouter.ai/) for providing access to multiple AI models
- [Spaceflight News API](https://api.spaceflightnewsapi.net) for the space news content
- [ShadCN UI](https://ui.shadcn.com/) for providing accessible UI components
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

---

<p align="center">
  Made with ❤️ by Tarun Gautam
</p>
