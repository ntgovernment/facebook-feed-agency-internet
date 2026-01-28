# facebook-feed-agency-internet

A Webpack-based project that deploys JS and CSS files to be referenced in a web page.

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server locally:

```bash
npm run dev
```

This will start a webpack dev server at http://localhost:8080 and automatically open it in your browser.

### Build

Build the project for production:

```bash
npm run build
```

This will generate the following files in the `dist` directory:
- `bundle.js` - Minified JavaScript bundle
- `styles.css` - Extracted CSS file
- `index.html` - Sample HTML page with references to the JS and CSS files

## Project Structure

```
├── src/
│   ├── index.js       # Main JavaScript entry point
│   ├── styles.css     # Main stylesheet
│   └── index.html     # HTML template
├── dist/              # Build output (generated)
├── webpack.config.js  # Webpack configuration
└── package.json       # Project dependencies and scripts
```
