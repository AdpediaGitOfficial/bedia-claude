import { termsData } from "@/constants/termsData";
import { Content, Title } from "@/components/ui";
import { getTermsData } from "@/services/terms.service";

export const metadata = {
  title: "Terms and Conditions | Bedia Pottery",
  description:
    "Read the terms and conditions for booking workshops with Bedia Pottery.",
};

export default async function TermsPage() {
  const termsData = await getTermsData();
  return (
    <main className="min-h-screen bg-secondary-dark">
      <div className="page-wrapper px-[17px]  py-24">
        <Title className="mb-4">Terms and Conditions</Title>
        <Content>Please read these Terms and Conditions carefully before booking a workshop with Bedia Pottery ("us", "we", or "our").</Content>
        <div className="mt-[40px] bg-white p-5 lg:p-10 ">
          {termsData.map((section, index) => (
            <div key={index}>
              <Content className="font-semibold mb-4">
                {section.title}
              </Content>
              <div className="mb-6">
                  <Content  className="leading-[150%]">
                    {section.content}
                  </Content>

                {/* {section?.points && (
                  <ul className="list-decimal  pl-5">
                    {section?.points.map((item, i) => (
                      <Content key={i} className="leading-[150%]">
                        <li>{item}</li>
                      </Content>
                    ))}
                  </ul>
                )} */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
