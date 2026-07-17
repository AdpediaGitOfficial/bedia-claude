
import FaqList from "@/components/faq/FaqList"
import { Title, Content } from "@/components/ui"
import { FaqSearch } from "@/components/faq/FaqSearch"
import { getFaqData } from "@/services/faq.service"

export const metadata = {
  title: "FAQ | Bedia Pottery",
  description: "Frequently asked questions about Bedia Pottery workshops."
}

export default async function FAQPage() {
  const faqData = await getFaqData()

  return (
    <main className="min-h-screen bg-[#F3EFE8]">
      <section className="page-wrapper px-[17px]  py-24">
          <Title className="mb-12 text-center">
            General Frequently Asked Questions
          </Title>
         <FaqSearch />


        {/* FAQ LIST */}
        <div className="">
          <FaqList items={faqData} />
        </div>
      </section>
    </main>
  )
}
