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

// Helper: Remove all emojis and special characters
export function removeEmojis(text) {
  if (!text) return "";
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}]/gu, // Emoticons
      "",
    )
    .replace(
      /[\u{1F300}-\u{1F5FF}]/gu, // Misc Symbols and Pictographs
      "",
    )
    .replace(
      /[\u{1F680}-\u{1F6FF}]/gu, // Transport and Map
      "",
    )
    .replace(
      /[\u{1F1E0}-\u{1F1FF}]/gu, // Flags
      "",
    )
    .replace(
      /[\u{2600}-\u{26FF}]/gu, // Misc symbols
      "",
    )
    .replace(
      /[\u{2700}-\u{27BF}]/gu, // Dingbats
      "",
    )
    .replace(
      /[\u{1F900}-\u{1F9FF}]/gu, // Supplemental Symbols and Pictographs
      "",
    )
    .replace(
      /[\u{1FA00}-\u{1FA6F}]/gu, // Chess Symbols
      "",
    )
    .replace(
      /[\u{1FA70}-\u{1FAFF}]/gu, // Symbols and Pictographs Extended-A
      "",
    )
    .replace(
      /[\u{2300}-\u{23FF}]/gu, // Miscellaneous Technical (includes ⏰)
      "",
    )
    .replace(
      /[\u{2B00}-\u{2BFF}]/gu, // Miscellaneous Symbols and Arrows (includes ⭐)
      "",
    )
    .replace(
      /[\u{FE00}-\u{FE0F}]/gu, // Variation Selectors
      "",
    )
    .replace(
      /[\u{200D}]/gu, // Zero Width Joiner
      "",
    )
    .replace(
      /[\u{20E3}]/gu, // Combining Enclosing Keycap
      "",
    )
    .replace(
      /[\u{E0020}-\u{E007F}]/gu, // Tags
      "",
    )
    .replace(/[ \t]+/g, " ") // Replace multiple spaces/tabs (not newlines) with single space
    .trim();
}

// Helper: Extract title from caption (first line or sentence)
export function extractTitle(caption) {
  if (!caption) return "View post";

  // Remove emojis comprehensively
  let cleaned = removeEmojis(caption);

  // Normalize line endings (convert \r\n to \n)
  cleaned = cleaned.replace(/\r\n/g, "\n");

  // Check if starts with non-alphanumeric character (e.g., quote, emoji)
  const startsWithNonAlpha = /^[^a-zA-Z0-9]/.test(cleaned);

  // Remove leading non-alphanumeric characters
  cleaned = cleaned.replace(/^[^a-zA-Z0-9]+/, "");

  let endIndex = cleaned.length;

  if (startsWithNonAlpha) {
    // For quoted or special text, extract only first sentence
    const periodIndex = cleaned.indexOf(".");
    const exclamationIndex = cleaned.indexOf("!");
    const questionIndex = cleaned.indexOf("?");

    // Find first valid punctuation mark
    const validIndices = [periodIndex, exclamationIndex, questionIndex].filter(
      (idx) => idx > 0,
    );

    if (validIndices.length > 0) {
      endIndex = Math.min(...validIndices);
    }
  } else {
    // For normal text, find first terminator (punctuation or double newline)
    const periodIndex = cleaned.indexOf(".");
    const exclamationIndex = cleaned.indexOf("!");
    const questionIndex = cleaned.indexOf("?");
    const doubleNewlineIndex = cleaned.indexOf("\n\n");

    // Collect all valid terminators
    const validIndices = [
      periodIndex,
      exclamationIndex,
      questionIndex,
      doubleNewlineIndex,
    ].filter((idx) => idx > 0);

    if (validIndices.length > 0) {
      // Use the first terminator found
      endIndex = Math.min(...validIndices);
    } else {
      // Fallback to first line
      const firstNewline = cleaned.indexOf("\n");
      if (firstNewline > 0) {
        endIndex = firstNewline;
      }
    }
  }

  // Extract title
  let title = cleaned.substring(0, endIndex).trim();

  // Remove trailing punctuation and whitespace
  return title.replace(/[.,;:!?]+\s*$/, "").trim();
}

// Helper: Truncate text to specified length
export function truncateText(text, maxLength = 150) {
  if (!text) return "";

  // Remove emojis comprehensively
  let cleaned = removeEmojis(text);

  // Normalize line endings (convert \r\n to \n)
  cleaned = cleaned.replace(/\r\n/g, "\n");

  // Check if starts with non-alphanumeric character (before removing leading chars)
  const startsWithNonAlpha = /^[^a-zA-Z0-9]/.test(cleaned);

  // Remove leading non-alphanumeric characters
  const originalCleaned = cleaned.replace(/^[^a-zA-Z0-9]+/, "");

  let titleEndIndex = originalCleaned.length;

  if (startsWithNonAlpha) {
    // For quoted text, title is just first sentence
    const periodIndex = originalCleaned.indexOf(".");
    const exclamationIndex = originalCleaned.indexOf("!");
    const questionIndex = originalCleaned.indexOf("?");

    // Find first valid punctuation mark
    const validIndices = [periodIndex, exclamationIndex, questionIndex].filter(
      (idx) => idx > 0,
    );

    if (validIndices.length > 0) {
      titleEndIndex = Math.min(...validIndices) + 1;
      cleaned = originalCleaned.substring(titleEndIndex).trim();
    } else {
      return "";
    }
  } else {
    // For normal text, find first terminator (punctuation or double newline)
    const periodIndex = originalCleaned.indexOf(".");
    const exclamationIndex = originalCleaned.indexOf("!");
    const questionIndex = originalCleaned.indexOf("?");
    const doubleNewlineIndex = originalCleaned.indexOf("\n\n");

    // Collect all valid terminators
    const validIndices = [
      periodIndex,
      exclamationIndex,
      questionIndex,
      doubleNewlineIndex,
    ].filter((idx) => idx > 0);

    if (validIndices.length > 0) {
      // Use the first terminator found
      titleEndIndex = Math.min(...validIndices);
      // Skip past the terminator (and extra newline if double newline)
      const skipLength = titleEndIndex === doubleNewlineIndex ? 2 : 1;
      cleaned = originalCleaned.substring(titleEndIndex + skipLength).trim();
    } else {
      const firstNewline = originalCleaned.indexOf("\n");
      if (firstNewline > 0) {
        titleEndIndex = firstNewline;
        cleaned = originalCleaned.substring(titleEndIndex + 1).trim();
      } else {
        return "";
      }
    }
  }

  // Remove any leading punctuation, quotes, spaces, or attribution markers
  cleaned = cleaned.replace(/^[""".,;:!?\s–—-]+/, "");

  // Remove attribution if it starts with a dash and name
  cleaned = cleaned.replace(/^[–—-]\s*[A-Z][^,\n]*,?\s*/, "");

  if (!cleaned || cleaned.length <= maxLength) return cleaned;

  // Look ahead for next punctuation mark within 50 chars after limit
  const searchEnd = Math.min(cleaned.length, maxLength + 50);
  const afterLimit = cleaned.substring(maxLength, searchEnd);
  const punctuationMatch = afterLimit.match(/[.!?\n]/);

  if (punctuationMatch) {
    // Cut at the punctuation mark
    const cutPoint = maxLength + punctuationMatch.index + 1;
    return cleaned.substring(0, cutPoint).trim();
  }

  // No punctuation found nearby, truncate at word boundary without ellipsis
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated).trim();
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
  let remainingText = escapeHtml(text.substring(lastIndex));

  // Convert @mentions to Facebook profile links
  remainingText = remainingText.replace(
    /@([a-zA-Z0-9.]{1,50})\b/g,
    '<a href="https://facebook.com/$1" target="_blank" rel="noopener noreferrer" class="fb-text-link">@$1</a>',
  );

  // Convert #hashtags to Facebook hashtag search links
  // Negative lookbehind (?<!&) prevents matching HTML entities like &#039;
  // Hashtags can start with a letter or number (e.g., #16days)
  // Semi-colons are excluded as they're not in the allowed character class
  remainingText = remainingText.replace(
    /(?<!&)#([a-zA-Z0-9][a-zA-Z0-9_]*)\b/g,
    '<a href="https://facebook.com/hashtag/$1" target="_blank" rel="noopener noreferrer" class="fb-text-link">#$1</a>',
  );

  result += remainingText.replace(/\n/g, "<br>");

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

  // Use sophisticated title extraction
  const title = extractTitle(message);

  // Use smart truncation for description (150 chars with punctuation lookahead)
  const description = truncateText(message, 150);

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
