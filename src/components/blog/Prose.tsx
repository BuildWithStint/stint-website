import { ReactNode } from 'react'

interface ProseProps {
  children: ReactNode
}

export function Prose({ children }: ProseProps) {
  return (
    <div
      className="prose-stint font-['DM_Sans']"
      style={{ color: 'rgba(242,237,228,0.78)' }}
    >
      {children}
      <style>{`
        .prose-stint { line-height: 1.75; font-size: 17px; }
        .prose-stint p { margin: 1.4em 0; }
        .prose-stint h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          color: #F2EDE4;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          line-height: 1.2;
          margin: 2.6em 0 0.8em;
        }
        .prose-stint h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          color: #F2EDE4;
          font-size: clamp(1.25rem, 2vw, 1.55rem);
          line-height: 1.3;
          margin: 2em 0 0.6em;
        }
        .prose-stint a {
          color: #C8973D;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1px;
        }
        .prose-stint a:hover { opacity: 0.85; }
        .prose-stint ul, .prose-stint ol {
          margin: 1.2em 0;
          padding-left: 1.4em;
        }
        .prose-stint li { margin: 0.5em 0; }
        .prose-stint ul li { list-style: disc; }
        .prose-stint ol li { list-style: decimal; }
        .prose-stint strong { color: #F2EDE4; font-weight: 600; }
        .prose-stint blockquote {
          border-left: 2px solid #C8973D;
          margin: 2em 0;
          padding: 0.2em 0 0.2em 1.6em;
          font-style: italic;
          color: rgba(242,237,228,0.85);
        }
        .prose-stint code {
          font-family: 'DM Mono', monospace;
          background: rgba(242,237,228,0.07);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.92em;
          color: #F2EDE4;
        }
        .prose-stint hr {
          border: none;
          border-top: 1px solid rgba(242,237,228,0.1);
          margin: 3em 0;
        }
        .prose-stint figure {
          margin: 2.4em 0;
        }
        .prose-stint figure img,
        .prose-stint > div > img,
        .prose-stint img {
          width: 100%;
          height: auto;
          border: 1px solid rgba(242,237,228,0.08);
        }
        .prose-stint figcaption {
          font-size: 0.85em;
          color: rgba(242,237,228,0.5);
          text-align: center;
          margin-top: 0.6em;
          font-style: italic;
        }
        .prose-stint pre {
          background: rgba(242,237,228,0.04);
          border: 1px solid rgba(242,237,228,0.08);
          padding: 1.2em;
          overflow-x: auto;
          font-family: 'DM Mono', monospace;
          font-size: 0.9em;
          line-height: 1.6;
          margin: 1.6em 0;
        }
        .prose-stint pre code {
          background: transparent;
          padding: 0;
          border-radius: 0;
        }
      `}</style>
    </div>
  )
}
