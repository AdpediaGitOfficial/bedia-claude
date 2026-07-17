"use client"

import Image from "next/image"
import React from "react"
import { Content } from "../ui"
import { motion, AnimatePresence } from "framer-motion"

interface FaqItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle
}) => {
  return (
    <div className="bg-white shadow-sm overflow-hidden">
      {/* QUESTION */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-medium text-lg text-darkblack">
          {question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Image
            src="/images/icons/circle-arrow.svg"
            alt="Toggle"
            width={46}
            height={46}
            className="w-[46px] h-[46px]"
          />
        </motion.div>
      </button>

      {/* ANSWER */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // super smooth
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.35 }}
              className="mx-6 mb-5 bg-[#EDE8E266] border-[0.5px] border-[#0D463D33] p-5 rounded-xl"
            >
              <Content>{answer}</Content>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FaqItem
