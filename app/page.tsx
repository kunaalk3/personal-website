import SideNav from '@/components/SideNav'
import Hero from '@/components/Hero'
import Work from '@/components/Work'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import LifeSection from '@/components/Life/LifeSection'
import Connect from '@/components/Connect'
import ClientLayer from '@/components/ClientLayer'

export default function Home() {
  return (
    <>
      <ClientLayer />
      <SideNav />
      <main style={{ background: '#000' }}>
        <Hero />
        <Work />
        <Skills />
        <Projects />
        <LifeSection />
        <Connect />
      </main>
    </>
  )
}
