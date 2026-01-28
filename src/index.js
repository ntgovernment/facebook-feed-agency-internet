// Main JavaScript entry point
import "./styles.css";
import facebookData from "./data.json";
import { hasPhotoAttachment, filterPosts } from "./utils.js";
import { createPhotoCard, createTextCard } from "./cardRenderer.js";

console.log("Facebook Feed Agency Internet - Loaded!");

// State management
let currentPage = 1;
let itemsPerPage = 5;
let filteredPosts = [];

// Render cards
function renderCards(container, posts, start, end) {
  const fragment = document.createDocumentFragment();

  for (let i = start; i < end && i < posts.length; i++) {
    const post = posts[i];
    const card = hasPhotoAttachment(post)
      ? createPhotoCard(post)
      : createTextCard(post);
    fragment.appendChild(card);
  }

  container.appendChild(fragment);
}

// Initialize widget
function initializeWidget() {
  const widget = document.querySelector("[data-securent-fb-widget]");
  if (!widget) return;

  // Extract configuration
  const startDate = widget.dataset.startDate || "";
  const endDate = widget.dataset.endDate || "";
  const filterKeywords = widget.dataset.filterKeywords || "";
  itemsPerPage = parseInt(widget.dataset.itemsPerPage) || 5;
  const cardSize = widget.dataset.cardSize || "compact";

  // Filter posts
  filteredPosts = filterPosts(facebookData, startDate, endDate, filterKeywords);

  if (filteredPosts.length === 0) {
    widget.innerHTML = '<p class="fb-feed__empty">No posts available.</p>';
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.className = `fb-feed__grid fb-feed__grid--${cardSize}`;
  widget.appendChild(container);

  // Render initial cards
  renderCards(container, filteredPosts, 0, itemsPerPage);
  currentPage = 1;

  // Add load more button if needed
  if (filteredPosts.length > itemsPerPage) {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "fb-feed__load-more";
    loadMoreBtn.textContent = "Load more";
    loadMoreBtn.addEventListener("click", () => {
      const start = currentPage * itemsPerPage;
      const end = start + itemsPerPage;
      renderCards(container, filteredPosts, start, end);
      currentPage++;

      // Hide button if all posts loaded
      if (currentPage * itemsPerPage >= filteredPosts.length) {
        loadMoreBtn.style.display = "none";
      }
    });
    widget.appendChild(loadMoreBtn);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeWidget();
});
