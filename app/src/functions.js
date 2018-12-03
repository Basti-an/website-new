import React from "react";

function parseMarkdownLinks(text) {
  let linkSplitter = /\[([^\]]+)\]\(([^)]+)\)/g; // ex: [link.de](https://www.link.de)
  const parts = text.split(linkSplitter);

  // text is split threefold: 1: normal text, 2: display portion of link, 3: actual link
  const fragment = (
    <React.Fragment>
      {parts.map((part, index, arr) => {
        if (index % 3 === 1) {
          part = "";
        } else if (index % 3 === 2) {
          part = (
            <a target="_blank" href={part}>
              {arr[index - 1]}
            </a>
          );
        }
        return part;
      })}
    </React.Fragment>
  );
  return fragment;
}

export { parseMarkdownLinks };
