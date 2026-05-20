export function SoundWaveVisualizer({ className }: { className?: string }) {
  return (
    <div className={`flex items-end gap-1 ${className ?? ""}`}>
      {[12, 20, 28, 18, 32, 24, 16, 30, 22, 14].map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full animate-pulse ${
            i % 2 === 0 ? "bg-reception-purple/80" : "bg-reception-blue/80"
          }`}
          style={{
            height: `${h}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
