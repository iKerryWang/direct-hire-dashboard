'use client'

import { useEffect, useState } from 'react'

type PreviewProps = { active?: boolean; loop?: boolean }

type AgentPhase = 'intro' | 'user' | 'typing' | 'reply'

export function AgentPreview({ active, loop }: PreviewProps) {
  const [phase, setPhase] = useState<AgentPhase>('intro')
  const [pipeline, setPipeline] = useState({ outreach: 12, conversation: 4, interviews: 2 })
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!active) {
      setPhase('intro')
      setPipeline({ outreach: 12, conversation: 4, interviews: 2 })
      return
    }

    setPhase('intro')
    setPipeline({ outreach: 12, conversation: 4, interviews: 2 })

    const t1 = window.setTimeout(() => setPhase('user'), 900)
    const t2 = window.setTimeout(() => setPhase('typing'), 2200)
    const t3 = window.setTimeout(() => {
      setPhase('reply')
      setPipeline({ outreach: 12, conversation: 5, interviews: 3 })
    }, 3400)
    const tLoop = loop
      ? window.setTimeout(() => setCycle(c => c + 1), 6200)
      : undefined

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (tLoop) clearTimeout(tLoop)
    }
  }, [active, loop, cycle])

  return (
    <div className={`features-preview-card features-preview-card--agent${active ? ' is-animating' : ''}`}>
      <div className="fp-mock fp-agent">
        <div className="fp-agent-window">
          <div className="fp-agent-hd">
            <div className="fp-agent-av">N</div>
            <div>
              <p className="fp-agent-name">Nova AI Agent</p>
              <p className="fp-agent-status"><span className="fp-live-dot" />Managing your pipeline</p>
            </div>
          </div>

          <div className="fp-agent-chat">
            <div className="fp-bubble fp-bubble--nova is-visible">
              <p>Replied to Sarah at Anthropic — she wants to schedule a call Thursday.</p>
            </div>

            {(phase === 'user' || phase === 'typing' || phase === 'reply') && (
              <div className="fp-bubble fp-bubble--user fp-bubble--enter">
                <p>Perfect, accept and add to my calendar.</p>
              </div>
            )}

            {phase === 'typing' && (
              <div className="fp-bubble fp-bubble--nova fp-bubble--typing fp-bubble--enter">
                <span /><span /><span />
              </div>
            )}

            {phase === 'reply' && (
              <div className="fp-bubble fp-bubble--nova fp-bubble--enter">
                <p>Done! Thursday 2pm is on your calendar — prep brief sent the day before.</p>
              </div>
            )}
          </div>

          <div className="fp-agent-pipeline">
            <div className="fp-pipe-item">
              <span className="fp-pipe-dot fp-pipe-dot--active" />
              <span>Outreach sent</span>
              <strong>{pipeline.outreach}</strong>
            </div>
            <div className={`fp-pipe-item${phase === 'reply' ? ' fp-pipe-item--bump' : ''}`}>
              <span className="fp-pipe-dot fp-pipe-dot--warm" />
              <span>In conversation</span>
              <strong>{pipeline.conversation}</strong>
            </div>
            <div className={`fp-pipe-item${phase === 'reply' ? ' fp-pipe-item--bump' : ''}`}>
              <span className="fp-pipe-dot fp-pipe-dot--done" />
              <span>Interviews</span>
              <strong>{pipeline.interviews}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RESUME_KEYWORDS = ['Figma', 'Design systems', 'AI products']

export function ResumePreview({ active, loop }: PreviewProps) {
  const [score, setScore] = useState(72)
  const [injected, setInjected] = useState(0)
  const [showHighlights, setShowHighlights] = useState([false, false])
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!active) {
      setScore(72)
      setInjected(0)
      setShowHighlights([false, false])
      return
    }

    setScore(72)
    setInjected(0)
    setShowHighlights([false, false])

    const timers: number[] = []
    RESUME_KEYWORDS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setInjected(i + 1), 600 + i * 700))
    })
    timers.push(window.setTimeout(() => setShowHighlights([true, false]), 2400))
    timers.push(window.setTimeout(() => setShowHighlights([true, true]), 3100))
    if (loop) {
      timers.push(window.setTimeout(() => setCycle(c => c + 1), 4800))
    }

    let frame: number
    const start = performance.now()
    const duration = 2200
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setScore(Math.round(72 + t * 24))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    timers.push(window.setTimeout(() => { frame = requestAnimationFrame(tick) }, 400))

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(frame)
    }
  }, [active, loop, cycle])

  const ringOffset = 113 - (score / 100) * 113

  return (
    <div className={`features-preview-card features-preview-card--resume${active ? ' is-animating' : ''}`}>
      <div className="fp-mock fp-resume">
        <div className="fp-resume-job">
          <p className="fp-resume-label">Target role</p>
          <h4>Senior Product Designer</h4>
          <p className="fp-resume-co">Anthropic · Remote</p>
          <div className="fp-resume-kws">
            {RESUME_KEYWORDS.map((kw, i) => (
              <span
                key={kw}
                className={`fp-kw-chip${injected > i ? ' is-injected' : ''}`}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="fp-resume-doc">
          <div className="fp-resume-score">
            <div className="fp-score-ring">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="18" fill="none" stroke="var(--color-border-default)" strokeWidth="4" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke="var(--color-main-default)" strokeWidth="4"
                  strokeLinecap="round" strokeDasharray="113"
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 22 22)"
                  className="fp-score-progress"
                />
              </svg>
              <span>{score}%</span>
            </div>
            <p>ATS Match</p>
          </div>

          <div className="fp-resume-lines">
            <div className="fp-line fp-line--lg" />
            <div className="fp-line fp-line--md" />
            {showHighlights[0] && (
              <div className="fp-line fp-line--highlight fp-line--enter">Led design systems for AI-first products</div>
            )}
            {showHighlights[1] && (
              <div className="fp-line fp-line--highlight fp-line--enter">Built Figma component libraries at scale</div>
            )}
            {!showHighlights[0] && <div className="fp-line fp-line--md fp-line--ghost" />}
            <div className="fp-line fp-line--sm" />
            <div className="fp-line fp-line--md" />
          </div>

          <div className={`fp-resume-badge${injected > 0 ? ' is-visible' : ''}`}>
            Keywords injected · {injected > 0 ? injected * 2 + 2 : 0} added
          </div>
        </div>
      </div>
    </div>
  )
}

type ApplyStatus = 'queued' | 'applying' | 'applied'

type ApplyRow = {
  id: string
  co: string
  color: string
  title: string
  company: string
  status: ApplyStatus
}

const INITIAL_ROWS: ApplyRow[] = [
  { id: 'vercel', co: 'V', color: '#000', title: 'Frontend Engineer', company: 'Vercel', status: 'applying' },
  { id: 'stripe', co: 'S', color: '#635bff', title: 'Product Designer', company: 'Stripe', status: 'applied' },
  { id: 'notion', co: 'N', color: '#000', title: 'UI Engineer', company: 'Notion', status: 'applied' },
  { id: 'linear', co: 'L', color: '#5b5bd6', title: 'Design Lead', company: 'Linear', status: 'queued' },
]

const STATUS_LABEL: Record<ApplyStatus, string> = {
  queued: 'Queued',
  applying: 'Applying…',
  applied: 'Applied',
}

export function AutoApplyPreview({ active }: PreviewProps) {
  const [rows, setRows] = useState<ApplyRow[]>(INITIAL_ROWS.map(r => ({ ...r })))
  const appliedCount = 45 + rows.filter(r => r.status === 'applied').length

  useEffect(() => {
    if (!active) {
      setRows(INITIAL_ROWS.map(r => ({ ...r })))
      return
    }

    setRows(INITIAL_ROWS.map(r => ({ ...r })))

    const advance = () => {
      setRows(prev => {
        const next = prev.map(r => ({ ...r }))
        const applyingIdx = next.findIndex(r => r.status === 'applying')
        const hadApplying = applyingIdx !== -1

        if (hadApplying) next[applyingIdx].status = 'applied'

        const queuedIdx = next.findIndex(r => r.status === 'queued')
        if (queuedIdx !== -1) {
          next[queuedIdx].status = 'applying'
        } else if (hadApplying) {
          const recycleIdx = next.findIndex(r => r.status === 'applied' && r.id === 'vercel')
          if (recycleIdx !== -1) next[recycleIdx].status = 'queued'
        }

        return next
      })
    }

    const interval = window.setInterval(advance, 2200)
    return () => clearInterval(interval)
  }, [active])

  return (
    <div className={`features-preview-card features-preview-card--auto-apply${active ? ' is-animating' : ''}`}>
      <div className="fp-mock fp-auto">
        <div className="fp-auto-stats">
          <div>
            <p className="fp-auto-stat-val">{appliedCount}</p>
            <p className="fp-auto-stat-lbl">Applied today</p>
          </div>
          <div className="fp-auto-toggle">
            <span className="fp-auto-toggle-knob" />
            <span>Auto Apply ON</span>
          </div>
        </div>

        <ul className="fp-auto-list">
          {rows.map(row => (
            <li
              key={row.id}
              className={`fp-auto-row fp-auto-row--${row.status}${row.status === 'applying' ? ' is-live' : ''}`}
            >
              <div className="fp-auto-co" style={{ background: row.color }}>{row.co}</div>
              <div className="fp-auto-info">
                <p className="fp-auto-title">{row.title}</p>
                <p className="fp-auto-company">{row.company}</p>
              </div>
              <span className={`fp-auto-status fp-auto-status--${row.status}`}>
                {row.status === 'applying' && <span className="fp-auto-spinner" aria-hidden="true" />}
                {STATUS_LABEL[row.status]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
