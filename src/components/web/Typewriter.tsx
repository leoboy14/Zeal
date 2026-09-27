import React, { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface TypewriterProps {
  phrases: string[]
  /** ms per typed character */
  typeSpeed?: number
  /** ms per deleted character */
  deleteSpeed?: number
  /** ms a finished phrase stays on screen */
  hold?: number
  caretClassName?: string
}

/**
 * Types each phrase, holds it, deletes it, and moves on to the next — forever.
 * The caret blinks while holding and stays solid while typing. With reduced
 * motion it just shows the first phrase. Screen readers get the full list via
 * the parent's accessible label, so this is aria-hidden.
 */
const Typewriter: React.FC<TypewriterProps> = ({
  phrases,
  typeSpeed = 70,
  deleteSpeed = 35,
  hold = 1800,
  caretClassName = '',
}) => {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(phrases[0].length)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) return
    const phrase = phrases[index]
    let delay: number
    let next: () => void

    if (!deleting && length === phrase.length) {
      delay = hold
      next = () => setDeleting(true)
    } else if (deleting && length === 0) {
      delay = 250
      next = () => {
        setDeleting(false)
        setIndex((i) => (i + 1) % phrases.length)
      }
    } else {
      delay = deleting ? deleteSpeed : typeSpeed
      next = () => setLength((l) => l + (deleting ? -1 : 1))
    }

    const id = window.setTimeout(next, delay)
    return () => window.clearTimeout(id)
  }, [reduce, phrases, index, length, deleting, typeSpeed, deleteSpeed, hold])

  const text = reduce ? phrases[0] : phrases[index].slice(0, length)
  const idle = reduce || (!deleting && length === phrases[index].length)

  return (
    <span aria-hidden>
      {text}
      {/* zero-width space keeps the line height while the phrase is empty */}
      {text.length === 0 && '​'}
      <span className={`${caretClassName} ${idle ? 'web-caret' : ''}`} />
    </span>
  )
}

export default Typewriter
