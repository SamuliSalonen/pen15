import { createContext, useContext } from 'react'

// Scroll-velocity skew (a MotionValue in degrees), shared by every heading.
export const SkewContext = createContext(0)
export const useSkew = () => useContext(SkewContext)
