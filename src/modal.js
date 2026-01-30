// Modal functionality
import {
  formatDate,
  extractContent,
  processText,
  getImageUrl,
} from "./utils.js";

// Show post modal
export function showPostModal(post) {
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
  const fullMessage = post.message || "No message available";
  const processedMessage = processText(fullMessage);

  const modal = document.createElement("div");
  modal.className = "fb-modal";
  modal.innerHTML = `
    <div class="fb-modal__overlay"></div>
    <div class="fb-modal__content">
      <div class="fb-modal__image" style="background-image: url('${imageUrl}')">
        <img src="${imageUrl}" alt="Post image" onerror="this.src='https://placehold.co/600x338?text=Image+Not+Available'">
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
        <div class="fb-modal__date">${formattedDate}</div>
      </div>
      <div class="fb-modal__body">
      </div>
      ${
        postUrl !== "#"
          ? `
        <div class="fb-modal__footer">
          <a href="${postUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-tertiary">
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

  // Insert processed message with HTML
  modal.querySelector(".fb-modal__body").innerHTML = processedMessage;

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
