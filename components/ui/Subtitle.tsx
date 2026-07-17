type SubtitleProps = {
  children: React.ReactNode
  className?: string
}

export default function Subtitle({
  children,
  className = '',
}: SubtitleProps) {
 

  return (
    <p className={`text-primary font-sunrise  2xl:text-2xl text-xl leading-none  ${className}`}>
      {children}
    </p>
  )
}
