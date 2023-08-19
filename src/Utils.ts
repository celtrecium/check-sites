import { match } from "assert";

const DEFAULT_LINK_PREFIX = "https://";

export function formatLink(link: string): string {
  return link.startsWith("http") ? link : `${DEFAULT_LINK_PREFIX}${link}`;
}

export function findLinks(content: string): ReadonlyArray<string> {
  let matches = content.match(/^(http|www)(.*?)$/gm);

  return matches != null ? matches : [];
}