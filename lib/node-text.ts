import type { ReactNode } from "react";

import { isValidElement } from "react";

const BLOCK = new Set(["p", "li", "ul", "ol", "div", "section", "h2", "h3"]);

/** Plain text of a JSX tree, so structured data reuses the copy on the page. */
export function nodeText(node: ReactNode): string {
  return rawText(node)
    .replace(/[ \t]*\n[ \t\n]*/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Text with inline whitespace kept and a newline around blocks and `<br>`. */
function rawText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return `${node}`;
  if (Array.isArray(node)) return node.map(rawText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    if (node.type === "br") return "\n";
    const text = rawText(node.props.children);

    return typeof node.type === "string" && BLOCK.has(node.type)
      ? `\n${text}\n`
      : text;
  }

  return "";
}
