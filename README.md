# Health AI Guardian

A comprehensive health and wellness application powered by AI to help users track their nutrition, fitness, and overall well-being.

## Features

- AI-powered food recognition and nutritional analysis
- Personalized health and wellness recommendations
- Interactive chat interface with AI health assistant
- Comprehensive health tracking and analytics
- User-friendly interface with modern design

## Installation

```bash
npm install health-ai-guardian
```

## Usage

```jsx
import { HealthAIGuardian } from 'health-ai-guardian';

function App() {
  return (
    <HealthAIGuardian
      apiKey={process.env.OPENAI_API_KEY}
      // Add other configuration options
    />
  );
}
```

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## License

MIT
