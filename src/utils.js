// Utility functions

// Helper: Format date as DD MMM YYYY
export function formatDate(dateString) {
  if (!dateString) return "Unknown date";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

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

// Helper: Convert URLs in text to clickable links
export function linkifyText(text) {
  if (!text) return "";

  // URL pattern that matches http, https, and www URLs
  const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;

  return text.replace(urlPattern, (url) => {
    // Add protocol if missing (for www. links)
    const href = url.startsWith("www.") ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="fb-text-link">${url}</a>`;
  });
}

// Helper: Escape HTML to prevent XSS
export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Helper: Process text with line breaks and links
export function processText(text) {
  if (!text) return "";

  // First, split text into parts (URLs and non-URLs)
  const urlPattern = /(https?:\/\/[^\s<>]+)|(www\.[^\s<>]+)/gi;
  let lastIndex = 0;
  let result = "";
  let match;

  // Reset regex
  const regex = new RegExp(urlPattern);

  while ((match = regex.exec(text)) !== null) {
    // Add the text before the URL (escaped)
    const beforeUrl = text.substring(lastIndex, match.index);
    result += escapeHtml(beforeUrl).replace(/\n/g, "<br>");

    // Add the URL as a link
    const url = match[0];
    const href = url.startsWith("www.") ? `https://${url}` : url;
    result += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="fb-text-link">${escapeHtml(url)}</a>`;

    lastIndex = regex.lastIndex;
  }

  // Add any remaining text after the last URL
  result += escapeHtml(text.substring(lastIndex)).replace(/\n/g, "<br>");

  return result;
}

// Helper: Determine if post has photo/album attachment
export function hasPhotoAttachment(post) {
  // Always return true to show all posts with photo card layout
  // Posts without images will use the placeholder
  return true;
}

// Helper: Get image URL from post
export function getImageUrl(post) {
  // Check for full_picture field (from Facebook Graph API)
  if (post.full_picture) {
    return post.full_picture;
  }

  // Get image from media field in attachments
  if (post.attachments?.data?.[0]?.media?.image?.src) {
    return post.attachments.data[0].media.image.src;
  }

  // Fallback to local placeholder image
  return "./placeholder.png";
}

// Helper: Extract title and description from message
export function extractContent(message) {
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
export function filterPosts(posts, startDate, endDate, keywords) {
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
