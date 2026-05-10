'use client'

import { motion } from 'framer-motion'
import TravelTile from './TravelTile'
import SportsTile from './SportsTile'
import ChessTile from './ChessTile'
import FitnessTile from './FitnessTile'
import CarsTile from './CarsTile'
import MoreTile from './MoreTile'
import FoodTile from './FoodTile'

export default function LifeSection() {
  return (
    <section id="life" style={{ background: '#000', padding: '100px 0 80px' }}>
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)' }}>05</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
              The Life
            </h2>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
            Beyond the screen · What makes me, me
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="bento-grid">
          {/* Travel — tall, spans 3 rows */}
          <TravelTile />

          {/* Sports */}
          <SportsTile />

          {/* Chess */}
          <ChessTile />

          {/* Fitness */}
          <FitnessTile />

          {/* Cars */}
          <CarsTile />

          {/* More */}
          <MoreTile />

          {/* Food — full width */}
          <FoodTile />
        </div>
      </div>
    </section>
  )
}
