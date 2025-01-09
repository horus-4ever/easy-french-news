import DOMPurify from "isomorphic-dompurify";

let configuration: DOMPurify.Config | null = null;

export function sanitizeHtml(html: string) {
  if (!configuration) {
    configuration = {
      ALLOWED_TAGS: ["vocab", "place", "p", "ul", "ol", "li"],
      ALLOWED_ATTR: ["vocab-id", "lat", "long"],
    };
  }
  return DOMPurify.sanitize(html, configuration);
}