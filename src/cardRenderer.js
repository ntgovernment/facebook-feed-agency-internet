// Card rendering functions
import {
  formatDate,
  extractContent,
  getImageUrl,
  processText,
  escapeHtml,
} from "./utils.js";
import { showPostModal } from "./modal.js";

// Create photo card layout
export function createPhotoCard(post) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const imageUrl = getImageUrl(post);
  const tagLabel = post.full_picture
    ? (post.attachments?.data?.[0]?.type || "Post").replace(/_/g, " ")
    : "Shared post";

  // Process description to include links
  const processedDescription = processText(description);

  const card = document.createElement("div");
  card.className = "fb-card";
  card.innerHTML = `
    <div class="fb-card__inner" data-footer="false" data-header="true" data-rich-media="true">
      <div class="fb-card__image" data-ratio="16:9" style="background-image: url('${imageUrl}')">
        <img src="${imageUrl}" alt="Post image" onerror="this.src='https://placehold.co/353x199?text=Image+Not+Available'">
      </div>
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__tag-wrapper">
          <div class="fb-card__tag" data-variant="Blue">
            <div>${tagLabel}</div>
          </div>
        </div>
        <div class="fb-card__date">${formattedDate}</div>
      </div>
      <div class="fb-card__content" data-icon="false" data-type="Default">
        <div class="fb-card__text">
          <div class="fb-card__title-row">
            <a href="#" class="fb-card__title fb-card__title--link">${escapeHtml(title)}</a>
          </div>
          ${processedDescription ? '<div class="fb-card__description"></div>' : ""}
        </div>
      </div>
    </div>
  `;

  // Insert processed description with HTML if it exists
  if (processedDescription) {
    card.querySelector(".fb-card__description").innerHTML =
      processedDescription;
  }

  card.querySelector(".fb-card__title--link").addEventListener("click", (e) => {
    e.preventDefault();
    showPostModal(post);
  });

  return card;
}

// Create text-only card layout
export function createTextCard(post) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const tagLabel = post.full_picture
    ? (post.attachments?.data?.[0]?.type || "Post").replace(/_/g, " ")
    : "Shared post";

  // Process description to include links
  const processedDescription = processText(description);

  const card = document.createElement("div");
  card.className = "fb-card";
  card.innerHTML = `
    <div class="fb-card__inner fb-card__inner--text" data-footer="false" data-header="true" data-rich-media="false">
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__tag-wrapper">
          <div class="fb-card__tag" data-variant="Blue">
            <div>${tagLabel}</div>
          </div>
        </div>
        <div class="fb-card__date">${formattedDate}</div>
      </div>
      <div class="fb-card__content" data-icon="false" data-type="Default">
        <div class="fb-card__text">
          <div class="fb-card__title-row">
            <a href="#" class="fb-card__title fb-card__title--link">${escapeHtml(title)}</a>
          </div>
          ${processedDescription ? '<div class="fb-card__description"></div>' : ""}
        </div>
      </div>
    </div>
  `;

  // Insert processed description with HTML if it exists
  if (processedDescription) {
    card.querySelector(".fb-card__description").innerHTML =
      processedDescription;
  }

  card.querySelector(".fb-card__title--link").addEventListener("click", (e) => {
    e.preventDefault();
    showPostModal(post);
  });

  return card;
}
