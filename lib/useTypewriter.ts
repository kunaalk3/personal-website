'use client'

import { useState, useEffect } from 'react'

export function useTypewriter(
  words: string[],
  typeSpeed = 90,
  deleteSpeed = 60,
  pauseDuration = 1800
): string {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [pausing, setPausing] = useState(false)

  useEffect(() => {
    if (pausing) {
      const t = setTimeout(() => {
        setPausing(false)
        setDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(t)
    }

    const current = words[wordIndex]

    if (!deleting) {
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setPausing(true)
        } else {
          setCharIndex((c) => c + 1)
        }
      }, typeSpeed)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setDeleting(false)
          setCharIndex(0)
          setWordIndex((i) => (i + 1) % words.length)
        } else {
          setCharIndex((c) => c - 1)
        }
      }, deleteSpeed)
      return () => clearTimeout(t)
    }
  }, [charIndex, deleting, pausing, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration])

  return displayed
}
