
import { getWorkshopData } from '@/services/workshop.service'
import FamilyProductDetailClient from '@/components/product/FamilyProductDetailClient'


export default async function ProductDetailPage() {

  const data = await getWorkshopData("family-pottery-workshop")

  return (
    <main className="min-h-screen bg-secondary-dark">
      <FamilyProductDetailClient product={data} />
    </main>
  )
}
