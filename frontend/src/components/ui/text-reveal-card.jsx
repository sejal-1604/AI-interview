import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const TextRevealCard = React.forwardRef(({ className, children, text, revealText, ...props }, ref) => {
  const [isRevealed, setIsRevealed] = React.useState(false)

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative z-10 flex h-[400px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-2xl cursor-pointer",
        className
      )}
      onClick={() => setIsRevealed(!isRevealed)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-60" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {children || (
          <>
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: isRevealed ? 0 : 1, y: isRevealed ? -20 : 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-white text-2xl font-bold">
                {text || "Interview Performance Analysis"}
              </h3>
              <p className="text-gray-300 text-base">
                Click to reveal insights
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold">
                Beyond Surface Level
              </h3>
              <p className="text-gray-300 text-base leading-relaxed max-w-sm mx-auto">
                {revealText || "Hidden insights revealed through AI"}
              </p>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  )
})
TextRevealCard.displayName = "TextRevealCard"

const TextRevealCardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-center text-3xl font-bold leading-tight text-gray-800 md:text-4xl",
      className
    )}
    {...props}
  >
    {children}
  </h2>
))
TextRevealCardTitle.displayName = "TextRevealCardTitle"

const TextRevealCardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-4 text-center text-base text-gray-600 md:text-lg",
      className
    )}
    {...props}
  >
    {children}
  </p>
))
TextRevealCardDescription.displayName = "TextRevealCardDescription"

export { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription }
