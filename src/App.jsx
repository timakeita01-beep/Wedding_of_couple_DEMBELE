import { useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, useScroll } from 'motion/react'
import * as m from 'motion/react-m'
import { EnvelopeIntro } from './components/EnvelopeIntro/EnvelopeIntro'
import { Hero } from './components/Hero/Hero'
import { CountdownSection } from './components/Countdown/CountdownSection'
import { WeddingDates } from './components/WeddingDates/WeddingDates'
import { LoveStory } from './components/LoveStory/LoveStory'
import { Gallery } from './components/Gallery/Gallery'
import { WeddingDetails } from './components/WeddingDetails/WeddingDetails'
import { RSVP } from './components/RSVP/RSVP'
import { FinalSection } from './components/Footer/FinalSection'
import { Footer } from './components/Footer/Footer'
import { Sparkles } from './components/Sparkles/Sparkles'

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return <m.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
}

export default function App() {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    window.scrollTo(0, 0)
    setOpened(true)
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <Sparkles />
        <AnimatePresence>{!opened && <EnvelopeIntro key="envelope" onOpen={handleOpen} />}</AnimatePresence>

        {opened && (
          <>
            <ScrollProgress />
            <main>
              <Hero />
              <CountdownSection />
              <WeddingDates />
              <LoveStory />
              <Gallery />
              <WeddingDetails />
              <RSVP />
              <FinalSection />
            </main>
            <Footer />
          </>
        )}
      </LazyMotion>
    </MotionConfig>
  )
}
