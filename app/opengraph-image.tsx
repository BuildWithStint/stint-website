import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'STINT — Hire senior freelance developers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,151,61,0.18) 0%, transparent 70%), #0A0A0B',
          color: '#F2EDE4',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#C8973D',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: '#C8973D',
            }}
          />
          STINT · stint.digital
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              display: 'flex',
              gap: 28,
            }}
          >
            <span>Design.</span>
            <span style={{ color: '#C8973D', fontStyle: 'italic' }}>Build.</span>
            <span>Scale.</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(242,237,228,0.7)',
              maxWidth: 980,
              lineHeight: 1.3,
            }}
          >
            Hire senior freelance developers — web, mobile, Next.js, React, MERN & cloud.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.55)',
          }}
        >
          <span>Remote · Worldwide</span>
          <span>buildwithstint@gmail.com</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
