export interface FAQItem {
  _id: string
  question: string
  answer: string
  isActive: boolean;
}
export type TermItem = {
  _id: string;
  title: string;
  content: string;
  isActive: boolean;
};
export const faqData = [
 
      {
        _id: "698ec6c8887a59f3dcc2e753",
        question: "Who are the instructors at Bedia Pottery?",
        answer: "Our instructors are certified professionals who are seasoned in the art of pottery and sculpting, ready to guide you through a fulfilling artistic journey.",
        category: "",
       isActive: true,
        createdAt: "2026-02-13T06:38:00.215Z",
        updatedAt: "2026-02-13T06:38:00.215Z"
      },
      {
        _id: "698ec4e2259ef3a883aa08af",
        question: "What workshops do you offer at Bedia Pottery?",
        answer: "We bring a unique fusion of art, mental well-being, and fun through our pottery wheel and handbuilding workshops, designed for kids and adults alike. Perfect for beginners, our classes are suitable for all ages, offering a welcoming space to explore creativity and connect with clay.",
        category: "",
       isActive: true,
        createdAt: "2026-02-13T06:29:54.058Z",
        updatedAt: "2026-02-13T06:29:54.058Z"
      },
      {
        _id: "698ec433259ef3a883aa08a3",
        question: "what is clay",
        answer: "Clay is a fine-grained natural soil material containing hydrated aluminum silicates, formed by the weathering of rocks over long periods",
        category: "",
       isActive: true,
        createdAt: "2026-02-13T06:26:59.569Z",
        updatedAt: "2026-02-13T06:37:13.407Z"
      },
      {
        _id: "697f27a658b3077a62d27880",
        question: "Can I buy tools, clay and glazes?",
        answer: "Yes, you can! We sell a range of tools & clay through in-person at our studio. Bags of clay cost anywhere from AED 50 to AED 100 depending on type and weight. We suggest you call our studio beforehand to inquire about available stock.",
        category: "categ",
       isActive: true,
        createdAt: "2026-02-01T10:15:02.817Z",
        updatedAt: "2026-02-13T06:28:48.367Z"
      }
    ]