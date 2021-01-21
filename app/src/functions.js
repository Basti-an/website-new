import React from "react";

function parseMarkdownLinks(text, linkClass) {
  const linkSplitter = /\[([^\]]+)\]\(([^)]+)\)/g; // ex: [link.de](https://www.link.de)
  const parts = text.split(linkSplitter);

  // text is split threefold: 1: normal text, 2: display portion of link, 3: actual link
  const fragment = (
    <>
      {parts.map((part, index, arr) => {
        if (index % 3 === 1) {
          part = "";
        } else if (index % 3 === 2) {
          part = (
            <a className={linkClass} target="_blank" rel="noopener noreferrer" href={part}>
              {arr[index - 1]}
            </a>
          );
        }
        return part;
      })}
    </>
  );
  return fragment;
}

export { parseMarkdownLinks };
