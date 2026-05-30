'use client'

import { useEffect, useState } from 'react'

const NAV_LOGO_ICON = '/img/nav/logo_icon.png'
const NAV_LOGO_WORDMARK = '/img/nav/logo_wordmark.png'

const GLASS_STYLE: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.78)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottomColor: 'rgba(15, 23, 42, 0.08)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}

const NAV_LINKS = [
  { href: '#features', label: 'Feature' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQs' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav
        className={`nav${menuOpen ? ' nav--menu-open' : ''}`}
        id="nav"
        style={scrolled || menuOpen ? GLASS_STYLE : undefined}
      >
        <a href="#" className="nav-brand" onClick={closeMenu}>
          <img className="nav-brand-icon" src={NAV_LOGO_ICON} alt="JobNova icon" />
          <img className="nav-brand-wordmark" src={NAV_LOGO_WORDMARK} alt="JobNova" />
        </a>

        <div className="nav-tabs">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
          ))}
          <div className="nav-affiliate">
            <a href="#" className="nav-link">Affiliate</a>
            <span className="nav-badge">30%</span>
          </div>
        </div>

        <div className="nav-actions">
          <a href="#" className="btn btn-dark nav-btn-dark">Find Talents</a>
          <div className="nav-divider" />
          <a href="/jobs" className="btn btn-ghost">Login</a>
          <a href="#" className="btn btn-primary">
            Sign Up
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <button
          className={`nav-hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div
        className={`nav-mobile-overlay${menuOpen ? ' is-open' : ''}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <div className={`nav-mobile-drawer${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="nav-mobile-links">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="nav-mobile-link" onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a href="#" className="nav-mobile-link nav-mobile-link--affiliate" onClick={closeMenu}>
            Affiliate
            <span className="nav-badge">30%</span>
          </a>
        </div>

        <div className="nav-mobile-actions">
          <a href="#" className="btn btn-dark btn-lg nav-mobile-cta" onClick={closeMenu}>Find Talents</a>
          <a href="/jobs" className="btn btn-ghost btn-lg nav-mobile-cta" onClick={closeMenu}>Login</a>
          <a href="#" className="btn btn-primary btn-lg nav-mobile-cta" onClick={closeMenu}>
            Sign Up
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
