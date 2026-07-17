import { GoogleReview } from "@/types";
import GoogleIcon from "./GoogleIcon";
import RatingStars from "./RatingStars";
import Image from "next/image";
import { Content } from "../ui";

interface Props {
  testimonial: GoogleReview;
}

const TestimonialCard: React.FC<Props> = ({ testimonial }) => {
  return (
    <div className="bg-[#E6DFD566] hover:shadow-sm  p-6 h-full flex flex-col justify-between  transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-[30px]">
        <Image
          src={testimonial.profilePhotoUrl}
          alt={testimonial.authorName}
          width={65}
          height={65}
          className=" rounded-full object-cover"
        />
        <div></div>

        <GoogleIcon />
      </div>

      {/* Text */}

         <Content className="  leading-none font-normal mb-5">
        {testimonial.text}
      </Content>
      <div className="">
      <Content className=" leading-none font-medium mb-1">
          {testimonial.authorName}
        </Content>
        <p className="text-lg leading-none text-[#00000066] mb-2.5">{testimonial.reviewTime} days ago</p>
        <RatingStars rating={testimonial.rating} />
      </div>
      {/* Stars */}
    </div>
  );
};

export default TestimonialCard;
