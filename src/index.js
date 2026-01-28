// Main JavaScript entry point
import "./styles.css";
import facebookData from "./data.json";

console.log("Facebook Feed Agency Internet - Loaded!");

// State management
let currentPage = 1;
let itemsPerPage = 5;
let filteredPosts = [];

// Helper: Format date as DD MMM YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Helper: Determine if post has photo/album attachment
function hasPhotoAttachment(post) {
  if (
    !post.attachments ||
    !post.attachments.data ||
    !post.attachments.data[0]
  ) {
    return false;
  }
  // Check if post has an image in media field
  return !!post.attachments.data[0].media?.image?.src;
}

// Helper: Get image URL from post
function getImageUrl(post) {
  // Check for full_picture field (from Facebook Graph API)
  if (post.full_picture) {
    return post.full_picture;
  }

  // Get image from media field in attachments
  if (post.attachments?.data?.[0]?.media?.image?.src) {
    return post.attachments.data[0].media.image.src;
  }

  // Fallback to placeholder
  return "https://placehold.co/353x199?text=Facebook+Post";
}

// Helper: Extract title and description from message
function extractContent(message) {
  if (!message) {
    return { title: "View post", description: "" };
  }

  // First sentence or 60 chars for title
  const sentenceEnd = message.match(/[.!?]\s/);
  let title;
  if (sentenceEnd && sentenceEnd.index < 80) {
    title = message.substring(0, sentenceEnd.index + 1).trim();
  } else {
    title =
      message.substring(0, 60).trim() + (message.length > 60 ? "..." : "");
  }

  // Next 120 chars for description
  const afterTitle = message.substring(title.length).trim();
  const description =
    afterTitle.length > 120
      ? afterTitle.substring(0, 120).trim() + "..."
      : afterTitle;

  return { title, description };
}

// Filter posts based on widget configuration
function filterPosts(posts, startDate, endDate, keywords) {
  let filtered = [...posts];

  // Filter by date range
  if (startDate) {
    const start = new Date(startDate);
    filtered = filtered.filter((post) => new Date(post.created_time) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    filtered = filtered.filter((post) => new Date(post.created_time) <= end);
  }

  // Filter by keywords
  if (keywords) {
    const keywordArray = keywords
      .toLowerCase()
      .split(",")
      .map((k) => k.trim());
    filtered = filtered.filter((post) => {
      const message = (post.message || "").toLowerCase();
      return keywordArray.some((keyword) => message.includes(keyword));
    });
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

  return filtered;
}

// Create photo card layout
function createPhotoCard(post) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const postUrl = post.attachments?.data?.[0]?.unshimmed_url || "#";
  const imageUrl = getImageUrl(post);

  const card = document.createElement("div");
  card.className = "fb-card";
  card.innerHTML = `
    <div class="fb-card__inner" data-footer="true" data-header="true" data-rich-media="true">
      <div class="fb-card__image" data-ratio="16:9" style="background-image: url('${imageUrl}')">
        <img src="${imageUrl}" alt="Post image" onerror="this.src='https://placehold.co/353x199?text=Image+Not+Available'">
      </div>
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__tag-wrapper">
          <div class="fb-card__tag" data-variant="Blue">
            <div>News</div>
          </div>
        </div>
        <div class="fb-card__date">${formattedDate}</div>
      </div>
      <div class="fb-card__content" data-icon="false" data-type="Default">
        <div class="fb-card__text">
          <div class="fb-card__title-row">
            <div class="fb-card__title">${title}</div>
          </div>
          ${description ? `<div class="fb-card__description">${description}</div>` : ""}
        </div>
      </div>
      <div class="fb-card__footer">
        <button class="fb-card__button" data-left-icon="false" data-right-icon="true" data-size="Small" data-state="Default" data-type="Tertiary">
          <span>Find out more</span>
          <div class="fb-card__arrow" data-colour="Black">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.33 8h13.34M8.67 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  `;

  card
    .querySelector(".fb-card__button")
    .addEventListener("click", () => showPostModal(post));

  return card;
}

// Create text-only card layout
function createTextCard(post) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const postUrl = post.attachments?.data?.[0]?.unshimmed_url || "#";

  const card = document.createElement("div");
  card.className = "fb-card";
  card.innerHTML = `
    <div class="fb-card__inner fb-card__inner--text" data-footer="true" data-header="true" data-rich-media="false">
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__tag-wrapper">
          <div class="fb-card__tag" data-variant="Blue">
            <div>News</div>
          </div>
        </div>
        <div class="fb-card__date">${formattedDate}</div>
      </div>
      <div class="fb-card__content" data-icon="false" data-type="Default">
        <div class="fb-card__text">
          <div class="fb-card__title-row">
            <div class="fb-card__title">${title}</div>
          </div>
          ${description ? `<div class="fb-card__description">${description}</div>` : ""}
        </div>
      </div>
      <div class="fb-card__footer">
        <button class="fb-card__button" data-left-icon="false" data-right-icon="true" data-size="Small" data-state="Default" data-type="Tertiary">
          <span>Find out more</span>
          <div class="fb-card__arrow" data-colour="Black">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.33 8h13.34M8.67 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  `;

  card
    .querySelector(".fb-card__button")
    .addEventListener("click", () => showPostModal(post));

  return card;
}

// Show post modal
function showPostModal(post) {
  const { title } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const postUrl = post.attachments?.data?.[0]?.unshimmed_url || "#";
  const fullMessage = post.message || "No message available";

  const modal = document.createElement("div");
  modal.className = "fb-modal";
  modal.innerHTML = `
    <div class="fb-modal__overlay"></div>
    <div class="fb-modal__content">
      <button class="fb-modal__close" aria-label="Close modal">&times;</button>
      <div class="fb-modal__header">
        <h2>${title}</h2>
        <p class="fb-modal__date">${formattedDate}</p>
      </div>
      <div class="fb-modal__body">
        <p>${fullMessage.replace(/\n/g, "<br>")}</p>
      </div>
      ${
        postUrl !== "#"
          ? `
        <div class="fb-modal__footer">
          <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="fb-modal__link">
            View original post on Facebook
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 8.67v4.66a.67.67 0 01-.67.67H2.67A.67.67 0 012 13.33V4.67c0-.37.3-.67.67-.67h4.66M10 2h4v4M6.67 9.33L14 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      `
          : ""
      }
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  // Trigger animation
  requestAnimationFrame(() => {
    modal.classList.add("fb-modal--active");
  });

  // Close handlers
  const closeModal = () => {
    modal.classList.remove("fb-modal--active");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  };

  modal.querySelector(".fb-modal__close").addEventListener("click", closeModal);
  modal
    .querySelector(".fb-modal__overlay")
    .addEventListener("click", closeModal);

  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", escHandler);
    }
  });
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
