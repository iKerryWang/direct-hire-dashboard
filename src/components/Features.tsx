'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { AgentPreview, AutoApplyPreview, ResumePreview } from '@/components/FeaturePreviews'

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then(mod => mod.Player),
  { ssr: false }
)

type Feature = {
  id: string
  label: string
  title: string
  body: string
  duration: number
  lottie?: string
}

const FEATURES: Feature[] = [
  {
    id: 'notification',
    label: 'Instant Job Notification',
    title: 'Be first before the listing goes public',
    body: 'Our neural network scans 50,000+ sources per second. Precision-matched alerts arrive before the job hits public boards — giving you a critical head start every time.',
    duration: 8620,
    lottie: '/animations/Instant Job Notification.json',
  },
  {
    id: 'agent',
    label: 'AI Agent Support',
    title: 'A career advocate that never clocks out',
    body: 'A persistent AI agent that learns your goals, handles recruiter outreach, and manages your entire pipeline — all while you focus on life.',
    duration: 5000,
  },
  {
    id: 'resume',
    label: 'AI Resume Customizer',
    title: '100% ATS-optimized, 0% effort',
    body: 'Instantly re-tune your resume for every role. Tailored keywords and perfect formatting — automatically adapted to pass every ATS filter.',
    duration: 5000,
  },
  {
    id: 'auto-apply',
    label: 'AI Auto Apply',
    title: '300+ jobs applied while you live your life',
    body: 'Set your criteria once. Our agent automatically applies to matching positions around the clock — no forms, no repetition, no burnout.',
    duration: 5000,
  },
]

function FeaturePreview({
  feature,
  active,
  loop,
}: {
  feature: Feature
  active: boolean
  loop?: boolean
}) {
  if (feature.lottie) {
    return (
      <LottiePlayer
        autoplay={active}
        loop
        src={feature.lottie}
        className="features-lottie"
      />
    )
  }
  if (feature.id === 'agent') return <AgentPreview active={active} loop={loop} />
  if (feature.id === 'resume') return <ResumePreview active={active} loop={loop} />
  if (feature.id === 'auto-apply') return <AutoApplyPreview active={active} loop={loop} />
  return null
}

function FeatureItem({
  feature,
  index,
  active,
  pinned,
  onSelect,
  started,
  autoPlay,
  variant,
}: {
  feature: Feature
  index: number
  active: boolean
  pinned: boolean
  onSelect?: () => void
  started: boolean
  autoPlay: boolean
  variant: 'desktop' | 'mobile'
}) {
  const isMobile = variant === 'mobile'

  return (
    <div
      className={`features-item${active || isMobile ? ' is-active' : ''}${pinned ? ' is-pinned' : ''}${isMobile ? ' features-item--mobile' : ''}`}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') onSelect() } : undefined}
    >
      <div className="features-item-content">
        <p className="features-item-label">{feature.label}</p>
        <h3 className="features-item-title">{feature.title}</h3>
        <div className="features-item-desc">
          <div className="features-item-desc-inner">
            <p>{feature.body}</p>
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="features-progress">
          {started && active && autoPlay && (
            <div
              key={`pb-${index}`}
              className="features-progress-bar"
              style={{ animationDuration: `${feature.duration}ms` }}
            />
          )}
          {started && active && pinned && (
            <div className="features-progress-pinned" aria-hidden="true" />
          )}
        </div>
      )}
    </div>
  )
}

export default function Features() {
  const [active, setActive] = useState(0)
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null)
  const [started, setStarted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [visibleMobileSteps, setVisibleMobileSteps] = useState<Set<number>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)
  const mobileStepRefs = useRef<(HTMLDivElement | null)[]>([])

  const isPinned = pinnedIndex !== null
  const isLooping = isPinned && pinnedIndex === active

  const handleSelect = (index: number) => {
    if (pinnedIndex === index) {
      setPinnedIndex(null)
      setActive(index)
      return
    }
    setActive(index)
    setPinnedIndex(index)
  }

  const handlePinPreview = () => {
    if (pinnedIndex === active) return
    setPinnedIndex(active)
  }

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.25 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Desktop: scroll-pinned tab switching (paused while a tab is pinned)
  useEffect(() => {
    if (!isDesktop || isPinned) return

    let ticking = false

    const updateByScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportH = window.innerHeight || 1
      const lastIndex = FEATURES.length - 1

      if (rect.top < viewportH && rect.bottom > 0) setStarted(true)

      if (rect.top >= viewportH * 0.12) {
        setActive(prev => (prev === 0 ? prev : 0))
        return
      }

      if (rect.bottom <= viewportH * 0.42) {
        setActive(prev => (prev === lastIndex ? prev : lastIndex))
        return
      }

      const start = viewportH * 0.12
      const end = -(rect.height - viewportH * 0.42)
      const progress = (start - rect.top) / (start - end)
      const clamped = Math.min(1, Math.max(0, progress))
      const nextActive = Math.min(lastIndex, Math.floor(clamped * FEATURES.length))
      setActive(prev => (prev === nextActive ? prev : nextActive))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        updateByScroll()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isDesktop, isPinned])

  // Desktop: auto-advance when not pinned
  useEffect(() => {
    if (!isDesktop || !started || isPinned) return
    const feature = FEATURES[active]
    const timer = window.setTimeout(() => {
      setActive(prev => (prev + 1) % FEATURES.length)
    }, feature.duration)
    return () => clearTimeout(timer)
  }, [active, isDesktop, isPinned, started])

  // Mobile: run preview animations only while each step is in view
  useEffect(() => {
    if (isDesktop) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleMobileSteps(prev => {
          const next = new Set(prev)
          entries.forEach(entry => {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            if (Number.isNaN(idx)) return
            if (entry.isIntersecting) next.add(idx)
            else next.delete(idx)
          })
          return next
        })
      },
      { threshold: 0.4, rootMargin: '0px 0px -5% 0px' }
    )

    mobileStepRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [isDesktop])

  return (
    <section ref={sectionRef} className="features" id="features">
      <div className="features-pin">
        <div className="container">
          <div className="section-header section-header--center">
            <p className="section-label">✦ How It Works</p>
            <h2 className="section-title">Discover. Optimize. Apply.</h2>
            <p className="section-body">
              Your AI agent handles every step — you just show up to interviews.
            </p>
          </div>
        </div>

        <div className="container features-body features-body--desktop">
          <div className="features-list">
            {FEATURES.map((f, i) => (
              <FeatureItem
                key={f.id}
                feature={f}
                index={i}
                active={i === active}
                pinned={pinnedIndex === i}
                started={started}
                autoPlay={!isPinned}
                variant="desktop"
                onSelect={() => handleSelect(i)}
              />
            ))}
          </div>

          <div
            className={`features-preview-wrap${isPinned ? ' is-pinned' : ''}`}
            onClick={handlePinPreview}
            role="button"
            tabIndex={0}
            aria-label="Click to stay on this preview"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePinPreview() }}
          >
            {FEATURES.map((f, i) => (
              <div
                key={f.id}
                className={`features-preview${i === active ? ' is-active' : ''}`}
              >
                <FeaturePreview
                  feature={f}
                  active={i === active}
                  loop={isLooping && i === active}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="container features-mobile">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              className="features-mobile-step"
              data-index={i}
              ref={el => { mobileStepRefs.current[i] = el }}
            >
              <FeatureItem
                feature={f}
                index={i}
                active
                pinned={false}
                started={started}
                autoPlay={false}
                variant="mobile"
              />
              <div className="features-mobile-preview">
                <FeaturePreview
                  key={`${f.id}-${visibleMobileSteps.has(i) ? 'on' : 'off'}`}
                  feature={f}
                  active={visibleMobileSteps.has(i)}
                  loop={visibleMobileSteps.has(i)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
