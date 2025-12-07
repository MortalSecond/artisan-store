import { Injectable } from '@angular/core';
import { CommissionConfig, FeaturesOption, FrameOption, ShippingOption, SizeOption, StoneCoverage, TreatmentsOption } from '../shared/models/commission-config';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  // Size Prices
  private readonly sizePrices: Record<SizeOption, number> = {
    'small': 200,
    'medium': 400,
    'large': 700,
    'extra-large': 1200
  }

  // Stone Coverage Prices
  private readonly stonePrices: Record<StoneCoverage, number> = {
    'none': 0,
    'light': 200,
    'medium': 400,
    'heavy': 800
  }
  
  // Frame Prices
  private readonly framePrices: Record<FrameOption, number> = {
    'wooden': 80,
    'mirror': 300,
    'led-wooden': 450,
    'led-mirror': 650
  }
  
  // Special Features Prices
  private readonly featurePrices: Record<FeaturesOption, number> = {
    'clock': 180,
    'diamond-strips': 80,
    'studs': 80,
    'leds': 75
  }
  
  // Surface Treatments Prices
  private readonly treatmentPrices: Record<TreatmentsOption, number> = {
    'resin': 180,
    'geode': 250
  }
  
  // Shipping Location Prices
  private readonly shippingPrices: Record<ShippingOption, number> = {
    'domestic': 50,
    'north-america': 150,
    'international': 250
  }

  constructor() { }

  // Get Individual Prices
  getSizePrice(size: SizeOption):number{
    return this.sizePrices[size];
  }

  getStonePrice(coverage: StoneCoverage):number{
    return this.stonePrices[coverage];
  }

  getFramePrice(frame: FrameOption):number{
    return this.framePrices[frame];
  }

  getFeaturePrice(feature: FeaturesOption):number{
    return this.featurePrices[feature];
  }

  getTreatmentPrice(treatment: TreatmentsOption):number{
    return this.treatmentPrices[treatment];
  }

  getShippingPrice(location: ShippingOption):number{
    return this.shippingPrices[location];
  }

  // Calculate Total Special Features Price
  getFeaturesTotal(features: FeaturesOption[]):number{
    // Despite the weird look, this is essentially the same as
    // a foreach(feature in features) plus an accumulator.

    return features.reduce((total, feature) => {
      return total + this.featurePrices[feature];
    }, 0);
  }
  
  // Calculate Total Surface Treatments Price
  getTreatmentsTotal(treatments: TreatmentsOption[]):number{
    return treatments.reduce((total, treatment) => {
      return total + this.treatmentPrices[treatment];
    }, 0);
  }

  // Calculate Grand Total
  calculateTotal(config: CommissionConfig): number{
    const base = this.sizePrices[config.size];
    const stone = this.stonePrices[config.stoneCoverage];
    const frame = this.framePrices[config.frame];
    const features = this.getFeaturesTotal(config.features);
    const treatments = this.getTreatmentsTotal(config.treatments);
    const shipping = this.shippingPrices[config.shipping];

    return (base + stone + frame + features + treatments + shipping);
  }
}
