# InnerQuest

InnerQuest is an interactive web application that helps users explore and understand their emotional well-being through personalized questionnaires and meaningful insights.

## Features

- **Role-Based Experience**: Users can choose their identity (Adolescence, Undergraduate, or Working Professional) for personalized interactions
- **Dynamic Questionnaire**: Adaptive questions that respond to user inputs
- **Emotional Analysis**: Generates personalized summaries based on detected emotions
- **Interactive Results**:
  - Visual representation with emotion-specific characters
  - Background music player (in development)
  - Share functionality to download results as images

## Tech Stack

- **Framework**: Next.js 15.2.2
- **Language**: TypeScript
- **AI Integration**: OpenAI GPT-4o
- **Styling**: CSS Modules
- **Image Generation**: html2canvas for result sharing

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd hope-harbor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
hope-harbor/
├── app/
│   ├── api/           # API routes
│   ├── questionnaire/ # Questionnaire pages
│   ├── results/       # Results display
│   └── layout.tsx     # Root layout
├── public/
│   ├── images/        # Emotion characters
│   └── audio/         # Background music
├── src/
│   ├── components/    # Reusable components
│   └── utils/         # Helper functions
└── styles/           # Global styles
```

## Features in Development

- Volume control for background music
- Enhanced audio player functionality
- Additional emotional analysis features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
