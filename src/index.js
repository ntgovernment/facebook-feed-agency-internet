// Main JavaScript entry point
import './styles.css';

console.log('Facebook Feed Agency Internet - Loaded!');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = '<h1>Welcome to Facebook Feed Agency Internet</h1><p>The application is running successfully!</p>';
  }
});
