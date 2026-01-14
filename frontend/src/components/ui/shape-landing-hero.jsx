"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Circle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    onRegister = () => {},
    onLogin = () => {},
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 py-20">
            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.h1
                            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight text-slate-900"
                        >
                            <span className="text-slate-900">
                                {title1}
                            </span>
                            <br />
                            <span className="text-slate-700">
                                {title2}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4"
                        >
                            Get Clear, Honest Feedback — Not Guesswork.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="text-sm text-slate-500 leading-relaxed tracking-wide max-w-lg mx-auto px-4"
                        >
                            Simulate real technical and behavioral interviews.  
                            Receive structured, actionable feedback on clarity, depth, and confidence — instantly.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button 
                                size="lg"
                                onClick={onRegister}
                                className="w-full sm:w-auto h-12 px-7 rounded-lg text-base font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                            >
                                Start free interview
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            
                            <Button 
                                size="lg"
                                variant="outline"
                                onClick={onLogin}
                                className="w-full sm:w-auto h-12 px-7 rounded-lg bg-transparent text-slate-600 border-slate-200 font-medium text-base transition-all"
                            >
                                Sign in
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export { HeroGeometric }

export { HeroGeometric }
