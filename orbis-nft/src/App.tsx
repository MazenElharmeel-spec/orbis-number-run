import Hero from './sections/Hero'
import About from './sections/About'
import Collection from './sections/Collection'
import Cta from './sections/Cta'
import TextureOverlay from './components/TextureOverlay'

export default function App() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <About />
      <Collection />
      <Cta />
      <TextureOverlay />
    </div>
  )
}
