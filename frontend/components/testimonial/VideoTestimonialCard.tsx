import Image from "next/image";
import RatingStars from "./RatingStars";
import { GoogleReview } from "@/types";

interface Props {
  testimonial: GoogleReview;
}

const VideoTestimonialCard: React.FC<Props> = ({ testimonial }) => {
  return (
    <div className="relative  overflow-hidden  hover:shadow-sm h-full min-h-[480px]">
  
      <Image
        src={testimonial.media?.videos?.[0] || "/images/testimonials/video-placeholder.jpg"} 
        alt={testimonial.authorName}
        width={1000}
        height={1000}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <button className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          <Image
        src="/images/icons/play.png"
        alt="playbutton"
        width={64}
        height={64}
        className=" w-full h-full object-cover"
      />
        </button>
      </div>

      <div className="absolute bottom-5 left-5 text-white">
        <h4 className="font-semibold">{testimonial.authorName}</h4>
        <RatingStars rating={testimonial.rating} />
      </div>
    </div>
  );
};

export default VideoTestimonialCard;
