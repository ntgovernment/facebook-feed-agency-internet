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

  // Get engagement stats
  const likes = post.reactions?.summary?.total_count || 0;
  const comments = post.comments?.summary?.total_count || 0;
  const shares = post.shares?.count || 0;

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
        <div class="fb-card__engagement">
          <div class="fb-card__stat">
            <i class="far fa-thumbs-up fb-card__icon"></i>
            ${likes > 0 ? `<span class="fb-card__count">${likes}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="far fa-comment fb-card__icon fb-card__icon--flipped"></i>
            ${comments > 0 ? `<span class="fb-card__count">${comments}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="far fa-share fb-card__icon"></i>
            ${shares > 0 ? `<span class="fb-card__count">${shares}</span>` : ""}
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

  // Get engagement stats
  const likes = post.reactions?.summary?.total_count || 0;
  const comments = post.comments?.summary?.total_count || 0;
  const shares = post.shares?.count || 0;

  // Process description to include links
  const processedDescription = processText(description);

  const card = document.createElement("div");
  card.className = "fb-card";
  card.innerHTML = `
    <div class="fb-card__inner fb-card__inner--text" data-footer="false" data-header="true" data-rich-media="false">
      <div class="fb-card__header" data-show-date="true" data-show-tag="true">
        <div class="fb-card__engagement">
          <div class="fb-card__stat">
            <i class="far fa-thumbs-up fb-card__icon"></i>
            ${likes > 0 ? `<span class="fb-card__count">${likes}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="far fa-comment fb-card__icon fb-card__icon--flipped"></i>
            ${comments > 0 ? `<span class="fb-card__count">${comments}</span>` : ""}
          </div>
          <div class="fb-card__stat">
            <i class="far fa-share fb-card__icon"></i>
            ${shares > 0 ? `<span class="fb-card__count">${shares}</span>` : ""}
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
