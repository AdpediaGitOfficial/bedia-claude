import React from 'react'
import BirthdayHero from '@/components/kids-birthday/BirthdayHero'
import FeatureBanner from '@/components/kids-birthday/FeatureBanner'
import BirthdayDetails from '@/components/kids-birthday/BirthdayDetails'
import { Metadata } from 'next'
import { getWorkshopData } from '@/services/workshop.service'

export const metadata: Metadata = {
  title: "Kids' Birthday",
  description: 'Celebrate your child\'s birthday with a fun pottery experience at Bedia Pottery Studio.',
}

const KidsBirthdayPage = async () => {
   const data = await getWorkshopData("adults-birthday-party")
  return (
    <div>
      <BirthdayHero product={data} type="adults" />
      <FeatureBanner />
      <BirthdayDetails product={data}/>
    </div>
  )
}

export default KidsBirthdayPage
