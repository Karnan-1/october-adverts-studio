import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ar', name: 'العربية' }
  ]

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setMenuOpen(false)
  }

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <h1>October Adverts</h1>
          </div>
          <div className="nav-menu">
            <div className="language-selector">
              <button 
                className="language-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={t('language')}
              >
                🌐 {languages.find(l => l.code === i18n.language)?.name || 'English'}
              </button>
              {menuOpen && (
                <div className="language-dropdown">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={i18n.language === lang.code ? 'active' : ''}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('welcome')}</h1>
            <h2 className="hero-tagline">{t('tagline')}</h2>
            <p className="hero-subtitle">{t('subtitle')}</p>
            <p className="hero-description">{t('description')}</p>
            <button className="cta-button">{t('contact')}</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2 className="section-title">{t('services')}</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>{t('service1')}</h3>
              <p>We craft strategic brand identities that resonate with your audience and drive business growth.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <h3>{t('service2')}</h3>
              <p>Comprehensive digital marketing campaigns that amplify your brand across all online channels.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">✍️</div>
              <h3>{t('service3')}</h3>
              <p>Engaging content that tells your brand story and connects with your target audience.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>{t('service4')}</h3>
              <p>Memorable experiential campaigns that create lasting impressions and brand loyalty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 October Adverts. All rights reserved.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
