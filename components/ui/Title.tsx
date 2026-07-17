type TitleProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Title({ children, className = "" }: TitleProps) {
  return (
    <h6 className={`text-primary font-normal 2xl:text-[55px] xl:text-4xl leading-[125%] tracking-[-0.02em]  ${className}`}>
      {children}
    </h6>
  );
}
