# Cultural Explorer AI 🌍✨

An AI-powered travel companion that helps you unveil the culture of any destination and plan perfect, budget-aware journeys.

## 🚀 Features

- **AI cultural Insight:** Get deep historical, cultural, and local insights for any destination globally.
- **Smart Itinerary Planner:** Generate personalized daily plans with estimated costs in **INR (₹)** based on your specific travel dates and budget.
- **Trip Status Gallery:** Organize your travels into *Upcoming*, *Ongoing*, and *Completed* tabs for easy management.
- **Multi-Entry Travel Journal:** Capture your memories with a built-in diary supporting multiple entries per trip.
- **Smart Checklist:** Never forget the essentials with a persistent packing and preparation checklist.
- **Luxury UI:** A bespoke, dark-themed interface designed with typography and fluid animations for a premium feel.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **AI Engine:** Google Gemini 1.5 Flash / Pro
- **Backend/Auth:** Firebase (Firestore & Authentication)
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cultural-explorer-ai.git
   cd cultural-explorer-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🔐 Firebase Setup

The project uses Firebase for user profiles and trip storage. You will need to create a `firebase-applet-config.json` in the root with your project credentials:

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "firestoreDatabaseId": "(default)"
}
```

## 📄 License

MIT License - feel free to use this project for your own travel adventures!
