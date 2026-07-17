import { Award, Gift, Handshake, Sparkles, Smile } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    label: 'Beginner Friendly',
  },
  {
    icon: Award,
    label: 'Top-Rated Pottery Studio',
  },
  {
    icon: Gift,
    label: 'Giftable',
  },
  {
    icon: Smile,
    label: 'Fun & Friendly Hosts',
  },
  {
    icon: Handshake,
    label: 'Hands-On Experience',
  },
]

export default function FeatureScroller() {
  const repeatedFeatures = [...features, ...features]

  return (
    <section className="overflow-hidden py-16">
      <div className="page-wrapper">
        <div className="relative overflow-hidden">
          <div className="feature-scroller flex items-center gap-6 min-w-max">
            {repeatedFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={`${feature.label}-${index}`}
                  className="inline-flex min-w-[220px] max-w-[220px] flex-col items-center justify-center rounded-3xl border border-gray-200/80 bg-white/90 px-6 py-5 text-center shadow-sm"
                >
                  <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {feature.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
