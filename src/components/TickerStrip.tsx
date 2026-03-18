const TickerStrip = () => {
  const items = [
    "founded in 2026",
    "born from travel",
    "925 sterling silver",
    "18K gold plated",
    "made for you",
    "hypoallergenic",
    "free shipping over $35",
  ];

  const content = items.map((item) => `· ${item} `).join("");

  return (
    <div className="bg-primary overflow-hidden py-2.5">
      <div className="ticker-animate whitespace-nowrap flex">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary-foreground">
          {content}{content}
        </span>
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary-foreground">
          {content}{content}
        </span>
      </div>
    </div>
  );
};

export default TickerStrip;
