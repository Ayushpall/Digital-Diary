/**
 * Intelligent pagination for digital diary entries.
 * Splits continuous journal text into realistic notebook pages of approximately
 * maxCharsPerPage (default: 500 characters).
 *
 * Respects paragraph boundaries, sentence endings, and word breaks so lines
 * never break awkwardly and text fits within the physical notebook page height.
 */
export function paginateContent(content: string, maxCharsPerPage = 500): string[] {
  if (!content || content.trim().length === 0) {
    return [""];
  }

  // If entire content fits in one page, return it as single page
  if (content.length <= maxCharsPerPage) {
    return [content];
  }

  const pages: string[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    if (remaining.length <= maxCharsPerPage) {
      pages.push(remaining);
      break;
    }

    // Inspect the slice up to maxCharsPerPage
    const slice = remaining.slice(0, maxCharsPerPage);

    // 1. Try double newline (paragraph break) within the latter half
    const paragraphBreak = slice.lastIndexOf("\n\n");
    if (paragraphBreak > maxCharsPerPage * 0.55) {
      pages.push(remaining.slice(0, paragraphBreak).trimEnd());
      remaining = remaining.slice(paragraphBreak + 2).trimStart();
      continue;
    }

    // 2. Try single newline
    const lineBreak = slice.lastIndexOf("\n");
    if (lineBreak > maxCharsPerPage * 0.65) {
      pages.push(remaining.slice(0, lineBreak).trimEnd());
      remaining = remaining.slice(lineBreak + 1).trimStart();
      continue;
    }

    // 3. Try sentence boundary (. ! ?) followed by space
    const lastPeriod = slice.lastIndexOf(". ");
    const lastExclamation = slice.lastIndexOf("! ");
    const lastQuestion = slice.lastIndexOf("? ");
    const bestSentence = Math.max(lastPeriod, lastExclamation, lastQuestion);

    if (bestSentence > maxCharsPerPage * 0.6) {
      const splitIdx = bestSentence + 1; // Include the punctuation mark
      pages.push(remaining.slice(0, splitIdx).trimEnd());
      remaining = remaining.slice(splitIdx).trimStart();
      continue;
    }

    // 4. Try word boundary (space)
    const spaceBreak = slice.lastIndexOf(" ");
    if (spaceBreak > maxCharsPerPage * 0.6) {
      pages.push(remaining.slice(0, spaceBreak).trimEnd());
      remaining = remaining.slice(spaceBreak + 1).trimStart();
      continue;
    }

    // 5. Fallback: hard boundary at maxCharsPerPage
    pages.push(slice);
    remaining = remaining.slice(maxCharsPerPage);
  }

  return pages.filter((p) => p.length > 0);
}
