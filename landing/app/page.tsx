import Navbar      from '@/components/Navbar'
import Hero        from '@/components/Hero'
import Features    from '@/components/Features'
import Sobre       from '@/components/Sobre'
import Identidade  from '@/components/Identidade'
import AreaRestrita from '@/components/AreaRestrita'
import Footer      from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Sobre />
        <Identidade />
        <AreaRestrita />
      </main>
      <Footer />
    </>
  )
}
