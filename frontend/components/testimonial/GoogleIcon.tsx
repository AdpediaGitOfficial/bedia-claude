import Image from "next/image";

const GoogleIcon = () => (
    <div className="w-[65px] h-[65px] bg-white rounded-full flex items-center justify-center ">
  <Image
    src="/images/icons/google.svg"
    alt="Google"
    width={28}
    height={28}
    className="w-7 h-7"
  />
  </div>
);

export default GoogleIcon;
