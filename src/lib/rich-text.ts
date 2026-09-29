/**
 * Rich Text and Formatting Utilities for Digital Diary
 * Handles formatting state detection, safe HTML sanitization, and structured parsing
 * for the contentEditable editor and living-ink handwriting renderer.
 */

export interface ActiveFormatting {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: "left" | "center" | "right";
}

export type FormatCommand =
  | "bold"
  | "italic"
  | "underline"
  | "justifyLeft"
  | "justifyCenter"
  | "justifyRight";

export interface FormattedRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface FormattedParagraph {
  align: "left" | "center" | "right";
  runs: FormattedRun[];
}

/**
 * Checks the current cursor position / selection within the document
 * to determine which formatting styles are active.
 */
export function querySelectionFormatting(): ActiveFormatting {
  if (typeof window === "undefined" || !window.getSelection) {
    return { isBold: false, isItalic: false, isUnderline: false, textAlign: "left" };
  }

  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  let textAlign: "left" | "center" | "right" = "left";

  try {
    isBold = document.queryCommandState("bold");
    isItalic = document.queryCommandState("italic");
    isUnderline = document.queryCommandState("underline");

    if (document.queryCommandState("justifyCenter")) {
      textAlign = "center";
    } else if (document.queryCommandState("justifyRight")) {
      textAlign = "right";
    } else if (document.queryCommandState("justifyLeft")) {
      textAlign = "left";
    }
  } catch {
    // fallback if queryCommandState is unavailable
  }

  // Also verify computed style on the selection anchor node
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let node: Node | null = selection.anchorNode;
    if (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }
      if (node && node instanceof HTMLElement) {
        let curr: HTMLElement | null = node;
        while (curr && curr.getAttribute("contenteditable") !== "true") {
          const comp = window.getComputedStyle(curr);
          if (!isBold && (comp.fontWeight === "bold" || parseInt(comp.fontWeight, 10) >= 600)) {
            isBold = true;
          }
          if (!isItalic && comp.fontStyle === "italic") {
            isItalic = true;
          }
          if (!isUnderline && comp.textDecorationLine.includes("underline")) {
            isUnderline = true;
          }
          if (curr.style.textAlign === "center" || curr.getAttribute("align") === "center" || comp.textAlign === "center") {
            textAlign = "center";
          } else if (curr.style.textAlign === "right" || curr.getAttribute("align") === "right" || comp.textAlign === "right") {
            textAlign = "right";
          } else if (curr.style.textAlign === "left" || curr.getAttribute("align") === "left" || comp.textAlign === "left" || comp.textAlign === "start") {
            // only overwrite if not already explicitly set to center/right by closer child
            if (curr.style.textAlign || curr.getAttribute("align")) {
              textAlign = "left";
            }
          }
          curr = curr.parentElement;
        }
      }
    }
  }

  return { isBold, isItalic, isUnderline, textAlign };
}

/**
 * Sanitizes rich text HTML to allow ONLY safe formatting tags:
 * <b>, <strong>, <i>, <em>, <u>, <p>, <div>, <span>, <br>
 * with style restricted strictly to text-align.
 * Completely eliminates any scripts, event handlers, or foreign elements.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") {
    // Basic SSR fallback
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const allowedTags = new Set(["B", "STRONG", "I", "EM", "U", "P", "DIV", "SPAN", "BR"]);

  function cleanNode(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toUpperCase();

      if (!allowedTags.has(tag)) {
        // Drop dangerous elements like script, iframe, object entirely
        if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "LINK", "META"].includes(tag)) {
          el.remove();
          return;
        }
        // Unwrap any other tag (keep children text)
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          parent.removeChild(el);
        }
        return;
      }

      // Filter attributes: ONLY allow style="text-align: ..." and align="..."
      const attrs = Array.from(el.attributes);
      let preservedTextAlign: string | null = null;

      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        if (name === "style") {
          const alignMatch = attr.value.match(/text-align\s*:\s*(left|center|right)/i);
          if (alignMatch) {
            preservedTextAlign = alignMatch[1].toLowerCase();
          }
        } else if (name === "align") {
          const val = attr.value.toLowerCase();
          if (val === "left" || val === "center" || val === "right") {
            preservedTextAlign = val;
          }
        }
        el.removeAttribute(attr.name);
      }

      if (preservedTextAlign) {
        el.style.textAlign = preservedTextAlign;
      }

      // Recursively clean children
      Array.from(el.childNodes).forEach(cleanNode);
    }
  }

  Array.from(doc.body.childNodes).forEach(cleanNode);
  return doc.body.innerHTML;
}

/**
 * Returns clean plain text from HTML string for word count and char count.
 */
export function getPlainText(content: string): string {
  if (!content) return "";
  if (!content.includes("<") || !content.includes(">")) {
    return content;
  }
  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"');
}

/**
 * Parses formatted HTML or plain text into a structured list of paragraphs and formatted runs
 * for handwriting preview rendering.
 */
export function parseFormattedText(content: string): FormattedParagraph[] {
  if (!content || content.trim() === "") {
    return [];
  }

  // If plain text with no HTML tags, split by newline
  if (!content.includes("<") || !content.includes(">")) {
    return content.split("\n").map((line) => ({
      align: "left",
      runs: [{ text: line }],
    }));
  }

  if (typeof window === "undefined") {
    return content.split("\n").map((line) => ({
      align: "left",
      runs: [{ text: line.replace(/<[^>]*>/g, "") }],
    }));
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const paragraphs: FormattedParagraph[] = [];

  function getAlignment(el: HTMLElement): "left" | "center" | "right" {
    let curr: HTMLElement | null = el;
    while (curr && curr !== doc.body) {
      const alignAttr = curr.getAttribute("align")?.toLowerCase();
      if (alignAttr === "center" || alignAttr === "right" || alignAttr === "left") {
        return alignAttr;
      }
      const styleAlign = curr.style?.textAlign?.toLowerCase();
      if (styleAlign === "center" || styleAlign === "right" || styleAlign === "left") {
        return styleAlign;
      }
      curr = curr.parentElement;
    }
    return "left";
  }

  function collectRuns(
    node: Node,
    inherited: { bold: boolean; italic: boolean; underline: boolean },
    out: FormattedRun[]
  ) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) {
        out.push({
          text,
          bold: inherited.bold,
          italic: inherited.italic,
          underline: inherited.underline,
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toUpperCase();

      const bold =
        inherited.bold ||
        tag === "B" ||
        tag === "STRONG" ||
        el.style.fontWeight === "bold" ||
        parseInt(el.style.fontWeight, 10) >= 600;

      const italic =
        inherited.italic || tag === "I" || tag === "EM" || el.style.fontStyle === "italic";

      const underline =
        inherited.underline || tag === "U" || el.style.textDecoration.includes("underline");

      if (tag === "BR") {
        out.push({ text: "\n", bold, italic, underline });
        return;
      }

      Array.from(el.childNodes).forEach((child) => {
        collectRuns(child, { bold, italic, underline }, out);
      });
    }
  }

  // Traverse top-level nodes in body
  const bodyNodes = Array.from(doc.body.childNodes);

  let currentBlockRuns: FormattedRun[] = [];
  let currentAlign: "left" | "center" | "right" = "left";

  const flushParagraph = () => {
    if (currentBlockRuns.length > 0) {
      paragraphs.push({
        align: currentAlign,
        runs: currentBlockRuns,
      });
      currentBlockRuns = [];
    }
  };

  for (const node of bodyNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (text) {
        currentBlockRuns.push({ text });
      }
      continue;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toUpperCase();

      // If it's a block element (<p>, <div>)
      if (tag === "P" || tag === "DIV") {
        flushParagraph();
        const align = getAlignment(el);
        const runs: FormattedRun[] = [];
        collectRuns(el, { bold: false, italic: false, underline: false }, runs);

        // Split on any embedded \n (from <br>) inside paragraph if present
        let splitParagraphRuns: FormattedRun[] = [];
        for (const run of runs) {
          if (run.text.includes("\n")) {
            const parts = run.text.split("\n");
            for (let i = 0; i < parts.length; i++) {
              if (parts[i]) {
                splitParagraphRuns.push({ ...run, text: parts[i] });
              }
              if (i < parts.length - 1) {
                paragraphs.push({
                  align,
                  runs: splitParagraphRuns.length > 0 ? splitParagraphRuns : [{ text: "" }],
                });
                splitParagraphRuns = [];
              }
            }
          } else {
            splitParagraphRuns.push(run);
          }
        }
        if (splitParagraphRuns.length > 0) {
          paragraphs.push({ align, runs: splitParagraphRuns });
        } else if (runs.length === 0) {
          // Empty block (e.g. <p><br></p>)
          paragraphs.push({ align, runs: [{ text: "" }] });
        }
        continue;
      }

      if (tag === "BR") {
        flushParagraph();
        paragraphs.push({ align: currentAlign, runs: [{ text: "" }] });
        continue;
      }

      // Inline element at root level
      collectRuns(el, { bold: false, italic: false, underline: false }, currentBlockRuns);
    }
  }

  flushParagraph();

  return paragraphs.length > 0 ? paragraphs : [{ align: "left", runs: [{ text: "" }] }];
}
