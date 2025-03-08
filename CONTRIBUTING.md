
# Contributing to Blend AI Chat

Thank you for considering contributing to Blend AI Chat! This document outlines the process for contributing to the project and how to get started.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive of all contributors regardless of background
- Provide constructive feedback and be open to receiving it
- Focus on improving the project through collaboration
- Report any unacceptable behavior to the project maintainers

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with the following information:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Any relevant details about your environment (browser, OS, etc.)

### Suggesting Enhancements

We welcome suggestions for improvements! When creating an enhancement suggestion:

- Use a clear, descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Include any relevant examples or mockups

### Pull Requests

We actively welcome pull requests:

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

#### Pull Request Guidelines

- Follow the existing code style and conventions
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Keep pull requests focused on a single concern
- Write descriptive commit messages

## Development Setup

To set up the project for local development:

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/blend-ai-chat.git
   cd blend-ai-chat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

Here's an overview of the project structure:

```
blend-ai-chat/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions and API integrations
│   ├── pages/        # Page components
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main App component
│   └── main.tsx      # Application entry point
├── tailwind.config.ts # Tailwind CSS configuration
└── package.json     # Project dependencies and scripts
```

## Styling Guidelines

We use Tailwind CSS for styling. Please follow these guidelines:

- Use Tailwind utility classes whenever possible
- Avoid custom CSS unless absolutely necessary
- Maintain the existing design system and color palette
- Ensure all UI elements are responsive and accessible

## Testing

Before submitting a pull request:

- Test your changes in different browsers (Chrome, Firefox, Safari)
- Verify that your changes look good on both desktop and mobile
- Ensure that the application still functions correctly

## Documentation

Good documentation is essential. When making changes:

- Update the README.md if your changes affect how users interact with the application
- Add comments to complex code sections
- Update or add JSDoc comments to functions and components as needed

## Questions?

If you have any questions or need help, feel free to open an issue asking for guidance.

Thank you for contributing to Blend AI Chat!
