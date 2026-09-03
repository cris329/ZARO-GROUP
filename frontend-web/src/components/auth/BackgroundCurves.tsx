/**
 * BackgroundCurves - Curvas decorativas doradas para el fondo del login.
 * SVG responsivo que se adapta al tamaño de pantalla.
 * @author = Cristian Deysdayr Jiménez
 */
import { FC } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export const BackgroundCurves: FC = () => {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lgLight1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#b8922e" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="lgLight2" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#b8922e" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="lgDark1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#b8922e" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="lgDark2" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#b8922e" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {isLight ? (
        <>
          <path d="M-200 900 C-200 400 200 0 720 0" stroke="url(#lgLight1)" strokeWidth="1.5" />
          <path d="M-160 900 C-160 430 230 40 720 40" stroke="url(#lgLight1)" strokeWidth="1" />
          <path d="M-120 900 C-120 460 260 80 720 80" stroke="url(#lgLight1)" strokeWidth="0.7" />
          <path d="M1640 0 C1640 500 1240 900 720 900" stroke="url(#lgLight2)" strokeWidth="1.5" />
          <path d="M1600 0 C1600 470 1210 860 720 860" stroke="url(#lgLight2)" strokeWidth="1" />
          <path d="M1560 0 C1560 440 1180 820 720 820" stroke="url(#lgLight2)" strokeWidth="0.7" />
        </>
      ) : (
        <>
          <path d="M1640 0 C1640 400 1100 900 500 900" stroke="url(#lgDark1)" strokeWidth="1.2" />
          <path d="M1600 40 C1560 420 1060 860 520 870" stroke="url(#lgDark1)" strokeWidth="0.9" />
          <path d="M1560 80 C1500 430 1020 820 540 840" stroke="url(#lgDark1)" strokeWidth="0.6" />
          <path d="M-200 0 C-200 500 300 900 900 900" stroke="url(#lgDark2)" strokeWidth="1.2" />
          <path d="M-160 40 C-120 460 340 860 880 870" stroke="url(#lgDark2)" strokeWidth="0.9" />
          <path d="M-120 80 C-60 470 380 820 860 840" stroke="url(#lgDark2)" strokeWidth="0.6" />
        </>
      )}
    </svg>
  )
}
