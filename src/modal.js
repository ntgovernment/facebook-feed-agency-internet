// Modal functionality
import {
  formatDate,
  extractContent,
  processText,
  getImageUrl,
} from "./utils.js";

// Track focus for restoration
let previouslyFocusedElement = null;
let focusTrapListener = null;

// Get all focusable elements within a container
function getFocusableElements(container) {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll(focusableSelectors));
}

// Create focus trap for modal
function createFocusTrap(modal) {
  const focusableElements = getFocusableElements(modal);

  if (focusableElements.length === 0) return null;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function trapFocus(e) {
    if (e.key !== "Tab") return;

    // Shift + Tab on first element -> move to last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab on last element -> move to first
    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
}

// Show post modal
export function showPostModal(post, triggeringElement = null) {
  const { title } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const imageUrl = getImageUrl(post);

  // Get engagement stats
  const likes = post.reactions?.summary?.total_count || 0;
  const comments = post.comments?.summary?.total_count || 0;
  const shares = post.shares?.count || 0;

  const postUrl =
    post.attachments?.data?.[0]?.target?.url ||
    post.attachments?.data?.[0]?.unshimmed_url ||
    "#";
  const permalink = post.permalink_url || "#";
  const fullMessage = post.message || "No message available";
  const processedMessage = processText(fullMessage);

  // Store previously focused element
  previouslyFocusedElement = triggeringElement || document.activeElement;

  const modal = document.createElement("div");
  modal.className = "fb-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "modal-date");
  modal.setAttribute("aria-describedby", "modal-body");

  modal.innerHTML = `
    <div class="fb-modal__overlay" aria-hidden="true"></div>
    <div class="fb-modal__content">
      <div class="fb-modal__image" style="background-image: url('${imageUrl}')">
        <img src="${imageUrl}" alt="Post image" onerror="this.src='https://placehold.co/600x400/transparent/777?text=Image+not+available'">
        <button class="fb-modal__close" aria-label="Close modal">&times;</button>
      </div>
      <div class="fb-modal__header">
        <div class="fb-modal__engagement">
          <div class="fb-modal__stat">
            <i class="${likes > 0 ? "far" : "fal"} fa-thumbs-up fb-card__icon${likes === 0 ? " fb-card__icon--inactive" : ""}"></i>
            ${likes > 0 ? `<span class="fb-card__count">${likes}</span>` : ""}
          </div>
          <div class="fb-modal__stat">
            <i class="${comments > 0 ? "far" : "fal"} fa-comment fb-card__icon fb-card__icon--flipped${comments === 0 ? " fb-card__icon--inactive" : ""}"></i>
            ${comments > 0 ? `<span class="fb-card__count">${comments}</span>` : ""}
          </div>
          <div class="fb-modal__stat">
            <i class="${shares > 0 ? "far" : "fal"} fa-share fb-card__icon${shares === 0 ? " fb-card__icon--inactive" : ""}"></i>
            ${shares > 0 ? `<span class="fb-card__count">${shares}</span>` : ""}
          </div>
        </div>
        <div class="fb-modal__date" id="modal-date">${formattedDate}</div>
      </div>
      <div class="fb-modal__body" id="modal-body">
      </div>
      ${
        permalink !== "#" || postUrl !== "#"
          ? `
        <div class="fb-modal__footer">
          ${
            permalink !== "#"
              ? `<a href="${permalink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  <i class="fab fa-facebook-f"></i>
                  View post on Facebook
                </a>`
              : ""
          }
          ${
            postUrl !== "#"
              ? `<a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-tertiary">
                  View original post on Facebook
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 8.67v4.66a.67.67 0 01-.67.67H2.67A.67.67 0 012 13.33V4.67c0-.37.3-.67.67-.67h4.66M10 2h4v4M6.67 9.33L14 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>`
              : ""
          }
        </div>
      `
          : ""
      }
    </div>
  `;

  // Insert processed message with HTML
  modal.querySelector(".fb-modal__body").innerHTML = processedMessage;

  // Hide background content from assistive technologies
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.setAttribute("aria-hidden", "true");
  }

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  // Set up focus trap
  focusTrapListener = createFocusTrap(modal);
  if (focusTrapListener) {
    modal.addEventListener("keydown", focusTrapListener);
  }

  // Trigger animation
  requestAnimationFrame(() => {
    modal.classList.add("fb-modal--active");

    // Set initial focus to close button after animation starts
    setTimeout(() => {
      const closeButton = modal.querySelector(".fb-modal__close");
      if (closeButton) {
        closeButton.focus();
      }
    }, 100);
  });

  // Close handlers
  const closeModal = () => {
    // Remove focus trap
    if (focusTrapListener) {
      modal.removeEventListener("keydown", focusTrapListener);
      focusTrapListener = null;
    }

    // Restore background content accessibility
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.removeAttribute("aria-hidden");
    }

    modal.classList.remove("fb-modal--active");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";

      // Restore focus to triggering element
      if (
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus === "function"
      ) {
        previouslyFocusedElement.focus();
      }
      previouslyFocusedElement = null;
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
