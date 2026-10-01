import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  // Parse inline markdown elements: bold, italic, code
  const formatInline = (text: string): React.ReactNode[] => {
    // Regex matches: **bold**, *italic*, `code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} style={{ fontWeight: 800, color: 'inherit' }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} style={{ color: 'inherit', fontStyle: 'italic' }}>
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            style={{
              background: 'rgba(0, 0, 0, 0.08)',
              padding: '0.15rem 0.35rem',
              borderRadius: '4px',
              color: '#121212',
              fontWeight: 700,
              fontSize: '0.85em',
            }}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  // Split content by lines and group into lists, headers, or paragraphs
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul
          key={`ul-${key}`}
          style={{
            margin: '0.4rem 0',
            paddingLeft: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Empty line: add subtle spacing
    if (!trimmed) {
      flushList(idx);
      renderedElements.push(<div key={`sp-${idx}`} style={{ height: '0.4rem' }} />);
      return;
    }

    // Bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      currentList.push(
        <li key={`li-${idx}`} style={{ lineHeight: 1.5 }}>
          {formatInline(itemText)}
        </li>
      );
      return;
    }

    // Numbered list item: e.g. "1. "
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      flushList(idx);
      renderedElements.push(
        <div
          key={`num-${idx}`}
          style={{
            display: 'flex',
            gap: '0.4rem',
            margin: '0.25rem 0',
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{numberedMatch[1]}.</span>
          <div>{formatInline(numberedMatch[2])}</div>
        </div>
      );
      return;
    }

    // Regular line
    flushList(idx);
    renderedElements.push(
      <p key={`p-${idx}`} style={{ margin: '0.2rem 0', lineHeight: 1.55 }}>
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList(lines.length);

  return <div className="formatted-message-content">{renderedElements}</div>;
};
