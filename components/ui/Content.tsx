type ContentProps = {
  children: React.ReactNode
  className?: string
}

export default function Content({ children, className = '' }: ContentProps) {
  return <div className={` 2xl:text-xl  xl:text-base font-normal  leading-6 text-darkblack ${className}`}>{children}</div>
}
