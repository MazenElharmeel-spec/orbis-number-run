export default function TextureOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        backgroundImage: 'url(/texture.png)',
        backgroundSize: 'cover',
        mixBlendMode: 'lighten',
        opacity: 0.6,
      }}
    />
  )
}
