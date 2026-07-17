import { BirthdayPackage, EventStep, ParentNote, PricingTier } from '@/constants/birthdayData'
import { birthdayPackages, eventTimeline, parentNotes, pricingTiers } from '@/constants/birthdayData'

/**
 * IBirthdayService Interface
 * Defines contract for birthday package operations
 * Follows: Dependency Inversion & Interface Segregation
 */
export interface IBirthdayService {
  getPackages(): BirthdayPackage[]
  getPackageById(id: string): BirthdayPackage | undefined
  getEventTimeline(): EventStep[]
  getParentNotes(): ParentNote[]
  getPricingTiers(): PricingTier[]
  getPackageIncludes(packageId: string): string[]
}

/**
 * BirthdayService Implementation
 * Single Responsibility: Handle birthday package data retrieval
 */
export class BirthdayService implements IBirthdayService {
  getPackages(): BirthdayPackage[] {
    return birthdayPackages
  }

  getPackageById(id: string): BirthdayPackage | undefined {
    return birthdayPackages.find((pkg) => pkg.id === id)
  }

  getEventTimeline(): EventStep[] {
    return eventTimeline
  }

  getParentNotes(): ParentNote[] {
    return parentNotes
  }

  getPricingTiers(): PricingTier[] {
    return pricingTiers
  }

  getPackageIncludes(packageId: string): string[] {
    const pkg = this.getPackageById(packageId)
    return pkg?.includes || []
  }
}

export default BirthdayService
