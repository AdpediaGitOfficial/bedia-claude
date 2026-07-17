import { Content, Subtitle, Title } from "../ui";

const TestimonialsHeader = () => {
  return (
    <div className="text-center mb-[50px] flex flex-col items-center">
      <Subtitle className="mb-[30px]">Testimonials</Subtitle>
      <Title className="mb-2.5 font-normal">
        What Our Community Says
      </Title>
      <Content className="max-w-xl ">
        Join hundreds of happy creators discovering creativity, calm, and joy
        through pottery at Bedia.
      </Content>
    </div>
  );
};

export default TestimonialsHeader;
