import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import IntroSplash from './components/IntroSplash'
import Home from './pages/Home'
import Rankings from './pages/Rankings'
import Evaluations from './pages/Evaluations'
import PlayerProfile from './pages/PlayerProfile'
import Spotlight from './pages/Spotlight'
import Events from './pages/Events'
import Interviews from './pages/Interviews'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <IntroSplash />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/player/:slug" element={<PlayerProfile />} />
          <Route path="/spotlight" element={<Spotlight />} />
          <Route path="/events" element={<Events />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
