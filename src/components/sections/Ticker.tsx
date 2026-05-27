import { TICKER_ITEMS } from "../../constants";

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="border-y overflow-hidden"
      style={{ borderColor: "rgba(242,237,228,0.07)" }}
    >
      <style>{`
        @keyframes tick {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .tick {
          display: flex;
          width: max-content;
          animation: tick 28s linear infinite;
        }
        .tick:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="tick py-3.5">
        {items.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="font-['Playfair_Display'] italic px-7 text-base"
              style={{ color: "rgba(242,237,228,0.28)" }}
            >
              {item}
            </span>
            <span style={{ color: "var(--accent)", opacity: 0.6 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
