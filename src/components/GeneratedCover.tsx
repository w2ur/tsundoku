"use client";

const PALETTE = [
  "#2D4A3E", // forest green
  "#4A6741", // muted olive green
  "#6B5B3E", // warm brown
  "#8B6F4E", // sandy brown
  "#C4956A", // amber
  "#A0522D", // sienna
  "#5C7A6B", // sage green
  "#7B6B8D", // muted purple
  "#4A7B9D", // muted blue
  "#8D6B4A", // caramel
  "#3D6B5C", // deep teal
  "#7A5C6B", // dusty mauve
];

export function generateCoverColor(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

interface GeneratedCoverProps {
  title: string;
  author: string;
  width?: number;
  height?: number;
}

export default function GeneratedCover({
  title,
  author,
  width = 120,
  height = 180,
}: GeneratedCoverProps) {
  const bgColor = generateCoverColor(title);
  const padding = Math.round(width * 0.1);
  const usableWidth = width - padding * 2;

  const titleFontSize = Math.max(Math.round(width * 0.1), 8);
  const authorFontSize = Math.max(Math.round(width * 0.075), 6);

  const titleAreaHeight = height * 0.6;
  const titleY = height * 0.25;
  const authorY = height * 0.78;

  const maxTitleChars = Math.floor((usableWidth / (titleFontSize * 0.55)) * 2);
  const truncatedTitle =
    title.length > maxTitleChars
      ? title.slice(0, maxTitleChars - 1) + "\u2026"
      : title;

  const words = truncatedTitle.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  const charsPerLine = Math.floor(usableWidth / (titleFontSize * 0.55));

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= charsPerLine) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const maxLines = Math.floor(titleAreaHeight / (titleFontSize * 1.3));
  const titleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && titleLines.length > 0) {
    const last = titleLines[titleLines.length - 1];
    titleLines[titleLines.length - 1] =
      last.length > 2 ? last.slice(0, -1) + "\u2026" : last + "\u2026";
  }

  const lineHeight = titleFontSize * 1.3;
  const blockHeight = titleLines.length * lineHeight;
  const blockStartY = titleY - blockHeight / 2;

  const maxAuthorChars = Math.floor(usableWidth / (authorFontSize * 0.6));
  const truncatedAuthor =
    author.length > maxAuthorChars
      ? author.slice(0, maxAuthorChars - 1) + "\u2026"
      : author;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${title} — ${author}`}
    >
      <rect width={width} height={height} fill={bgColor} />
      <rect
        x={padding * 0.5}
        y={padding * 0.5}
        width={width - padding}
        height={height - padding}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      {titleLines.map((line, i) => (
        <text
          key={i}
          x={width / 2}
          y={blockStartY + i * lineHeight + titleFontSize}
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize={titleFontSize}
          fontWeight="600"
          fill="rgba(255,255,255,0.95)"
        >
          {line}
        </text>
      ))}
      <text
        x={width / 2}
        y={authorY}
        textAnchor="middle"
        fontFamily="'Inter', system-ui, sans-serif"
        fontSize={authorFontSize}
        fontWeight="400"
        fill="rgba(255,255,255,0.70)"
      >
        {truncatedAuthor}
      </text>
    </svg>
  );
}
