# Impactify

Impactify is a small Next.js app for cleaning noisy URLs and appending a contributor tag. It removes common tracking parameters such as `utm_*`, `fbclid`, `gclid`, and similar query values, then generates a clean shareable link that you can copy and keep in local history.

## Features

- Removes common tracking parameters from pasted URLs
- Appends a `contributor` query parameter when a contributor ID is provided
- Saves contributor ID in local storage for faster repeat use
- Stores up to 10 recent unique links locally in the browser
- Provides quick access to issue reporting and contribution entry points

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React icons

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Open `http://localhost:3000` in your browser.

## Project Structure

```text
app/
	components/
		URLCleaner.tsx
	globals.css
	layout.tsx
	page.tsx
public/
```

## How It Works

1. Paste a URL into the generator.
2. Optionally enter a contributor ID.
3. Click `Generate Clean Link`.
4. Copy the cleaned output or reuse it from the history panel.

## Contributing

Contributions are welcome. If you want to improve the UI, add URL-cleaning rules, or refine the workflow:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run `pnpm build` before opening a pull request.
5. Submit a pull request with a short description of the change.

## Issues

If you find a bug or want to request a feature, open an issue in the repository issues tab.

## License

Add the project license here if you want to publish one.
