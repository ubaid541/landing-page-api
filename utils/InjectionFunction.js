export function injectHeadAndCSS(content, cssContent) {
  const headStart = content.indexOf("<body");
  if (headStart !== -1) {
    const styledHTML =
      content.slice(0, headStart) +
      "<head><style>" +
      cssContent +
      "</style></head>" +
      content.slice(headStart);
    return styledHTML;
  } else {
    // Handle case where no `<body>` tag is found
    console.warn("`<body>` tag not found in HTML content.");
    return content; // Fallback to unstyled content
  }
}
