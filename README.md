# NAKAMA.EXE
Smart Team Formation and Challenge Assignment Platform.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- GSAP
- SQLite & Prisma

## Database Setup
To initialize the SQLite database:

```bash
npx prisma generate
npx prisma db push
```


## Local Development
Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

### Participants
- **GET** /api/participants: Retrieve all participants.
- **POST** /api/participants: Create a new participant.

### Challenges
- **GET** /api/challenges: Retrieve all challenges.
- **POST** /api/challenges: Create a new challenge.

### Teams
- **GET** /api/teams: Retrieve generated teams.
- **POST** /api/teams/generate: Placeholder for team generation algorithm (Phase 4).

