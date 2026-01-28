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

// Fetch posts from API
async function fetchPosts(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts from API:", error);
    return null;
  }
}

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

// Setup pagination and render posts
function setupFeed(widget, posts, cardSize) {
  if (posts.length === 0) {
    widget.innerHTML = '<p class="fb-feed__empty">No posts available.</p>';
    return;
  }

  // Create container
  const container = document.createElement("div");
  container.className = `fb-feed__grid fb-feed__grid--${cardSize}`;
  widget.appendChild(container);

  // Render initial cards
  renderCards(container, posts, 0, itemsPerPage);
  currentPage = 1;

  // Add load more button if needed
  if (posts.length > itemsPerPage) {
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "fb-feed__load-more";
    loadMoreBtn.textContent = "Load more";
    loadMoreBtn.addEventListener("click", () => {
      const start = currentPage * itemsPerPage;
      const end = start + itemsPerPage;
      renderCards(container, posts, start, end);
      currentPage++;

      // Hide button if all posts loaded
      if (currentPage * itemsPerPage >= posts.length) {
        loadMoreBtn.style.display = "none";
      }
    });
    widget.appendChild(loadMoreBtn);
  }
}

// Initialize widget
async function initializeWidget() {
  const widget = document.querySelector("[data-securent-fb-widget]");
  if (!widget) return;

  // Extract configuration
  const apiUrl = widget.dataset.apiUrl || "";
  const fallbackUrl = widget.dataset.fallbackUrl || "";
  const startDate = widget.dataset.startDate || "";
  const endDate = widget.dataset.endDate || "";
  const filterKeywords = widget.dataset.filterKeywords || "";
  itemsPerPage = parseInt(widget.dataset.itemsPerPage) || 5;
  const cardSize = widget.dataset.cardSize || "compact";

  let postsData = null;

  // Try to fetch from API if URL is provided (production)
  if (apiUrl) {
    console.log("Fetching posts from API:", apiUrl);
    widget.innerHTML = '<p class="fb-feed__empty">Loading posts...</p>';
    postsData = await fetchPosts(apiUrl);
  }

  // Try fallback URL if primary API failed
  if (!postsData && fallbackUrl) {
    console.log("Trying fallback URL:", fallbackUrl);
    postsData = await fetchPosts(fallbackUrl);
  }

  // Fall back to mock data if API fetch failed or no URL provided
  if (!postsData) {
    console.log("Using mock data from data.json");
    postsData = facebookData;
  }

  // Clear loading message
  widget.innerHTML = "";

  // Filter posts
  filteredPosts = filterPosts(postsData, startDate, endDate, filterKeywords);

  // Setup the feed
  setupFeed(widget, filteredPosts, cardSize);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeWidget();
});
