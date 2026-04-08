import { useState } from "react";
import { Link } from "react-router-dom";

interface PostTextProps {
  text: string | undefined;
  linkMentions?: true;
}

const PostText: React.FC<PostTextProps> = ({ text, linkMentions }) => {
  const [showFull, setShowFull] = useState<true | false>(false);

  if (!text) return null;
  const allLines = text.split('\n');

  const isTooLong = allLines.length > 9 || text.length > 275;

  const previewLines = allLines.slice(0, 9);
  const previewText = previewLines.join('\n');

  // but try to avoid cutting in the middle of a mention
  const finalPreview = previewText.length > 275
    ? previewText.substring(0, 275) + "..."
    : previewText;

  const finalLines = finalPreview.split('\n');

  const renderWithMentions = (line: string) => {
    if (!line.trim()) return line;

    const mentionRegex = /(@[a-zA-Z][a-zA-Z0-9_]{0,14})/g;
    const parts = line.split(mentionRegex);
    return parts.map((part, index) => {
      if (part.startsWith('@') && part.length > 1) {
        const username = part.substring(1);
        return (
          <Link
            key={`mention-${index}-${username}`}
            to={`/profile/${username}`}
          >
            {part}
          </Link>
        );
      }

      return <span key={`text-${index}`}>{part}</span>;
    });
  };
  if (showFull) {
    return (
      <>
        {
          allLines.map((line, index) => (
            <span key={index}>
              {linkMentions ? renderWithMentions(line) : line}
              {index < allLines.length - 1 && <br />}
            </span>
          ))
        }
      </>
    )
  }

  let truncatedText = text.substring(0, 280);
  const lastSpace = truncatedText.lastIndexOf(' ');
  if (lastSpace > 0) truncatedText = truncatedText.substring(0, lastSpace);

  return (
    <>
      {finalLines.map((line, index) => (
        <span key={index}>
          {linkMentions ? renderWithMentions(line) : line}
          {index < finalLines.length - 1 && <br />}
        </span>
      ))}
      {isTooLong && (
        <>
          <br />
          <button onClick={() => setShowFull(true)} className="show-more">
            Show more
          </button>
        </>
      )}
    </>
  );
}

export default PostText;