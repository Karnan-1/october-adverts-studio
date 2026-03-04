import { useState, useEffect, MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import './parallax.css'


function App() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [projectInput, setProjectInput] = useState('')
  const [greeting, setGreeting] = useState('Good Afternoon')

  // Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'it', name: 'IT' },
    { code: 'es', name: 'ES' },
    { code: 'fr', name: 'FR' },
    { code: 'de', name: 'DE' }
  ]

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const handleMouseMove = (e: MouseEvent) => {
    // Calculate mouse position relative to center of screen (-1 to 1)
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  }

  const handleAnalyze = async () => {
    console.log('Analyzing project:', projectInput)

    try {
      // Save the analysis request to Supabase backend
      const { data, error } = await supabase
        .from('analysis_requests')
        .insert([
          { project_description: projectInput, created_at: new Date().toISOString() }
        ])

      if (error) {
        console.error('Error saving to backend:', error)
      } else {
        console.log('Successfully saved to backend:', data)
      }
    } catch (err) {
      console.error('Backend connection failed:', err)
    }
  }

  return (
    <div className="app light-theme" onMouseMove={handleMouseMove}>

      {/* Background Parallax Layer */}
      <div className="parallax-container">
        <div
          className="parallax-bg"
          style={{
            transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
          }}
        />
      </div>

      <div className="content-wrapper">
        {/* Navigation */}
        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <h1>October Adverts</h1>
            </div>
            <div className="nav-menu">
              <a href="/" className="nav-link">Home</a>
              <a href="/about" className="nav-link">About</a>
              <a href="/case-studies" className="nav-link">Case Studies</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-modern">
          <div className="container">
            <div className="hero-content-center">
              <p className="greeting">{greeting} 👋</p>
              <h1 className="hero-title-large">
                We Build <br />
                <span className="gradient-text">Brand Experiences</span> <br />
                End-to-End
              </h1>
              <p className="hero-description-large">
                From idea to sales. Tell us what you're building and our AI will show you<br />
                how we can help bring your vision to life.
              </p>

              {/* Language Selector */}
              <div className="language-selector-inline">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>

              {/* AI Input Box */}
              <div className="ai-input-container">
                <div className="input-box">
                  <span className="sparkle-icon">✨</span>
                  <input
                    type="text"
                    placeholder="Looking for a complete digital transformation..."
                    value={projectInput}
                    onChange={(e) => setProjectInput(e.target.value)}
                    className="ai-input"
                  />
                </div>
                <p className="input-helper">Tell us about your project and we'll show you how we can help</p>
                <button className="analyze-btn" onClick={handleAnalyze}>
                  ✈️ Analyze
                </button>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
