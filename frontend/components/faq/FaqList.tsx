"use client"

import React, { useEffect, useState } from "react"
import { FAQItem } from "@/constants/faqData"
import FaqItem from "./FaqItem"

interface FaqListProps {
  items: FAQItem[]
}

const FaqList: React.FC<FaqListProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null)
  useEffect(() => {
    console.log("FAQ data in page:", items)
  }, [items])
  return (
    <div className="space-y-4 mt-[70px]">
      {items.map((faq) => (
        <FaqItem
          key={faq._id}
          question={faq.question}
          answer={faq.answer}
          isOpen={openId === faq._id}
          onToggle={() =>
            setOpenId(openId === faq._id ? null : faq._id)
          }
        />
      ))}
    </div>
  )
}

export default FaqList
