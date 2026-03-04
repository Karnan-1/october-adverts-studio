import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function App() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [projectInput, setProjectInput] = useState('')
  const [greeting, setGreeting] = useState('Good Afternoon')

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

  const handleAnalyze = () => {
    console.log('Analyzing project:', projectInput)
    // AI analysis logic here
  }

  return (
    <div className="app dark-theme">
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
  )
}

export default App
