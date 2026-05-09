import Footer from '../Components/Home/Footer'
import Hero from '../Components/Home/Hero'
import Navbar from '../Components/Home/Navbar'
import Plans from '../Components/Home/Plans'
import Testimonials from '../Components/Home/Testimonials'
import Tools from '../Components/Home/Tools'
import RevealSection from '../Components/RevealSection'

const Home = () => {
  return (
    <div>
  <Navbar/>
  <RevealSection>
    <Hero/>
  </RevealSection>
  <RevealSection delay={0.05}>
    <Tools/>
  </RevealSection>
  <RevealSection delay={0.08}>
    <Testimonials/>
  </RevealSection>
  <RevealSection delay={0.1}>
    <Plans/>
  </RevealSection>
  <RevealSection delay={0.12}>
    <Footer/>
  </RevealSection>

    </div>
  )
}

export default Home
