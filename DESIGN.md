# ai-news - Design Document

## 1. Project Overview
ai-news is a news aggregator that fetches, analyzes, and displays AI/ML updates. It focuses on a high-quality, modern user experience with a "Tasteful Dark Mode" aesthetic and smart snippets for quick reading.

## 2. Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Shadcn UI, Lucide Icons, Axios.
- **Backend:** Flask, Flask-SQLAlchemy, Flask-CORS, BeautifulSoup (Scraping), PRAW (Reddit).
- **Database:** PostgreSQL (for production), SQLite (for local development).
- **Deployment:** Render (as specified in `render.yaml`).

## 3. Architecture
- `client/`: React application.
- `server/`: Flask API and Scraping logic.
  - `models.py`: Database schemas.
  - `scrapers/`: Individual scraping modules.
  - `routes.py`: API endpoints.

## 4. Database Schema
### `Article`
- `id`: Integer (PK)
- `title`: String
- `url`: String (Unique)
- `source`: String (HN, GitHub, Dev.to, Reddit)
- `summary`: Text (Smart Snippet)
- `is_liked`: Boolean (default: False)
- `created_at`: DateTime
- `trending_score`: Float (calculated based on upvotes/stars if available)

## 5. UI/UX Design
- **Theme:** "Tasteful Dark Mode" using Slate-900/950 backgrounds, thin borders, and subtle gradients.
- **Home Page:** Masonry or Grid layout of article cards. Each card shows the source, title, and a "Smart Snippet" of the content.
- **Liked Page:** Filtered view of saved articles.
- **Hot Topics:** A "Trending Tags" section at the top.

## 6. Implementation Phases
1. **Phase 1: Project Setup** - Initialize Vite and Flask.
2. **Phase 2: Backend Core** - Database models and basic API.
3. **Phase 4: Scraping Engine** - Implement HN, GitHub, Dev.to, and Reddit scrapers.
4. **Phase 5: Frontend Core** - Setup Tailwind, Shadcn, and basic layout.
5. **Phase 6: Integration** - Connect Frontend to Backend.
6. **Phase 7: Refinement** - Polish UI, add "Liked" functionality, and finalize dark mode.
