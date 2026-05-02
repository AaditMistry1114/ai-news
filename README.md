# ai-news 🛰️

ai-news is a modern, full-stack application that specifically hunts for the latest breakthroughs in **Agentic AI, Vibe Coding, and Large Language Models**. It provides a high-performance dashboard to stay updated with the most relevant technical shifts in the AI landscape.

## 🚀 Key Features

-   **Targeted AI Aggregation:** Automatically pulls the latest news on Claude, Agentic workflows, and modern coding trends.
-   **Intelligence Sources:** Curates high-signal content from Hacker News, Dev.to, Reddit (r/LocalLLaMA, r/OpenAI), and GitHub.
-   **Smart Snippets:** Instant technical previews of articles to help you quickly scan for relevant content.
-   **Trending Topics:** Real-time analysis of keywords like "Vibe Coding", "Agents", and "LLMs".
-   **GitHub Integration:** Stay updated with trending AI and machine learning repositories.
-   **Multi-Source Filtering:** Easily filter news by source to focus on the communities you care about most.
-   **Saved Articles:** Like and save articles for later reading.

## 🛠 Tech Stack

### Frontend
-   **Framework:** React (TypeScript)
-   **Styling:** Tailwind CSS & Framer Motion (for smooth animations)
-   **UI Components:** Shadcn/UI
-   **Icons:** Lucide-React

### Backend
-   **Language:** Python (Flask)
-   **Database:** PostgreSQL (with SQLAlchemy ORM)
-   **Web Scraping:** BeautifulSoup4 & PRAW (Reddit)

## 🏗 Project Structure

```text
ai-news/
├── client/          # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main views (Home, Liked)
│   │   └── lib/         # Utility functions
├── server/          # Flask backend application
│   ├── scrapers/    # Source-specific scraping logic
│   ├── models.py     # Database schemas
│   └── app.py       # API endpoints and server setup
└── DESIGN.md        # Architectural design documentation
```

## ⚙️ Setup & Installation

### Prerequisites
-   Node.js & npm
-   Python 3.12+
-   PostgreSQL database

### Backend Setup
1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    ./venv/Scripts/activate  # Windows
    source venv/bin/activate # Linux/Mac
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure environment variables in `.env`:
    ```env
    DATABASE_URL=your_postgresql_url
    ```
5.  Run the server:
    ```bash
    python app.py
    ```

### Frontend Setup
1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---
Created with ❤️ for the AI community.
