export function HeroBackground() {
  return (
    <>
      {/* Deep navy gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071421] via-[#0B1F33] to-[#0F2847]" />
      
      {/* Subtle radial glow - top right */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-radial-glow rounded-full blur-3xl opacity-20 mix-blend-screen" 
        style={{
          background: 'radial-gradient(circle, rgba(47, 128, 237, 0.4) 0%, transparent 70%)',
        }}
      />
      
      {/* Subtle radial glow - bottom left */}
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(29, 167, 232, 0.3) 0%, transparent 70%)',
        }}
      />
      
      {/* Subtle radial glow - center-left (very faint) */}
      <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full blur-3xl opacity-10 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(188, 235, 255, 0.2) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
