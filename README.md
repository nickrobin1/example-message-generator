# Braze Preview Generator

A tool to preview and generate marketing messages across multiple channels for Braze campaigns. This tool helps marketers and developers visualize how their messages will appear across different platforms before sending them through Braze.

## Features

- **Multi-Channel Preview Support:**
  - SMS Messages
  - Push Notifications
  - Card Messages
  - In-App Messages

- **Brand Integration:**
  - Brand lookup functionality (WIP)
  - Logo and color scheme integration
  - Customizable brand settings

- **Real-Time Preview:**
  - Device frame simulation
  - Interactive message previews
  - Dynamic content updates

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nickrobin1/example-message-generator.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your Brandfetch API key:
```
BRANDFETCH_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

## Roadmap

### In Progress
- 🔄 Fix brand fetch API integration
  - Improve error handling
  - Add better fallback options
  - Enhance brand data utilization

### Upcoming Features
- 📧 Email channel support
  - HTML email templates
  - Email preview functionality
  - Responsive design testing

- 💬 WhatsApp channel integration
  - WhatsApp message preview
  - Template message support
  - Rich media preview

### Future Enhancements
- 🎨 Enhanced brand integration
  - Pull more content from brand fetch API
  - Better color scheme integration
  - Font and style matching

- 🤖 AI-powered content generation
  - AI-generated message copy
  - Smart content suggestions
  - Tone and style customization

- 🎯 Preview Improvements
  - More accurate device frames
  - Interactive elements
  - Animation support
  - Dark mode previews

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Netlify Functions
- Brandfetch API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes. 