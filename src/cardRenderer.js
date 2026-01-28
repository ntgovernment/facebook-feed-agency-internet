// Card rendering functions
import {
  formatDate,
  extractContent,
  getImageUrl,
  processText,
} from "./utils.js";
import { showPostModal } from "./modal.js";

// Create photo card layout
export function createPhotoCard(post) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);
  const imageUrl = getImageUrl(post);

  // Process description to include links
  const processedDescription = processText(description);

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
          ${processedDescription ? '<div class="fb-card__description"></div>' : ""}
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

  // Insert processed description with HTML if it exists
  if (processedDescription) {
    card.querySelector(".fb-card__description").innerHTML =
      processedDescription;
  }

  card
    .querySelector(".fb-card__button")
    .addEventListener("click", () => showPostModal(post));

  return card;
}

// Create text-only card layout
export function createTextCard(post) {
  const { title, description } = extractContent(post.message);
  const formattedDate = formatDate(post.created_time);

  // Process description to include links
  const processedDescription = processText(description);

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
          ${processedDescription ? '<div class="fb-card__description"></div>' : ""}
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

  // Insert processed description with HTML if it exists
  if (processedDescription) {
    card.querySelector(".fb-card__description").innerHTML =
      processedDescription;
  }

  card
    .querySelector(".fb-card__button")
    .addEventListener("click", () => showPostModal(post));

  return card;
}
