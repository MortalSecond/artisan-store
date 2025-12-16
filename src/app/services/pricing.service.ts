import { inject, Injectable, signal } from '@angular/core';
import { CommissionConfig, FeaturesOption, FrameOption, ShippingOption, SizeOption, StoneCoverage, TreatmentsOption } from '../shared/models/commission-config';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';

export interface PricingConfig {
  id: number;
  sizeSmall: number;
  sizeMedium: number;
  sizeLarge: number;
  sizeExtraLarge: number;
  frameWooden: number;
  frameMirror: number;
  frameLedWooden: number;
  frameLedMirror: number;
  stoneNone: number;
  stoneLight: number;
  stoneMedium: number;
  stoneHeavy: number;
  featureClock: number;
  featureDiamondStrips: number;
  featureStuds: number;
  featureLeds: number;
  treatmentResin: number;
  treatmentGeode: number;
  shippingDomestic: number;
  shippingNorthAmerica: number;
  shippingInternational: number;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Pricing`;
  pricing = signal<PricingConfig | null>(null);

  constructor() { 
    this.loadPricing();
  }

  // Load Pricing From API
  loadPricing(): Observable<PricingConfig> {
    return this.http.get<PricingConfig>(this.apiUrl).pipe(
      tap(config => this.pricing.set(config))
    );
  }

  // Update Pricing
  updatePricing(updates: Partial<PricingConfig>): Observable<any> {
    return this.http.put(`${this.apiUrl}`, updates).pipe(
      tap(() => this.loadPricing().subscribe()) // Reload after update
    );
  }

  // Get Individual Prices
  getSizePrice(size: SizeOption): number {
    const config = this.pricing();

    // Return 0 If Config Not Loaded
    if (!config) return 0;

    const mapping: Record<SizeOption, keyof PricingConfig> = {
      'small': 'sizeSmall',
      'medium': 'sizeMedium',
      'large': 'sizeLarge',
      'extra-large': 'sizeExtraLarge'
    };

    return config[mapping[size]] as number;
  }

  getStonePrice(coverage: StoneCoverage): number {
    const config = this.pricing();
    if (!config) return 0;

    const mapping: Record<StoneCoverage, keyof PricingConfig> = {
      'none': 'stoneNone',
      'light': 'stoneLight',
      'medium': 'stoneMedium',
      'heavy': 'stoneHeavy'
    };

    return config[mapping[coverage]] as number;
  }

  getFramePrice(frame: FrameOption): number {
    const config = this.pricing();
    if (!config) return 0;

    const mapping: Record<FrameOption, keyof PricingConfig> = {
      'wooden': 'frameWooden',
      'mirror': 'frameMirror',
      'led-wooden': 'frameLedWooden',
      'led-mirror': 'frameLedMirror'
    };

    return config[mapping[frame]] as number;
  }

  getFeaturePrice(feature: FeaturesOption): number {
    const config = this.pricing();
    if (!config) return 0;

    const mapping: Record<FeaturesOption, keyof PricingConfig> = {
      'clock': 'featureClock',
      'diamond-strips': 'featureDiamondStrips',
      'studs': 'featureStuds',
      'leds': 'featureLeds'
    };

    return config[mapping[feature]] as number;
  }

  getTreatmentPrice(treatment: TreatmentsOption): number {
    const config = this.pricing();
    if (!config) return 0;

    const mapping: Record<TreatmentsOption, keyof PricingConfig> = {
      'resin': 'treatmentResin',
      'geode': 'treatmentGeode'
    };

    return config[mapping[treatment]] as number;
  }

  getShippingPrice(location: ShippingOption): number {
    const config = this.pricing();
    if (!config) return 0;

    const mapping: Record<ShippingOption, keyof PricingConfig> = {
      'domestic': 'shippingDomestic',
      'north-america': 'shippingNorthAmerica',
      'international': 'shippingInternational'
    };

    return config[mapping[location]] as number;
  }

  getLastUpdatedTime():Date | null{
    const config = this.pricing();
    if(!config) return null;

    return config['updatedAt'] as Date;
  }

  // Calculate totals (same as before)
  getFeaturesTotal(features: FeaturesOption[]): number {
    return features.reduce((total, feature) => {
      return total + this.getFeaturePrice(feature);
    }, 0);
  }

  getTreatmentsTotal(treatments: TreatmentsOption[]): number {
    return treatments.reduce((total, treatment) => {
      return total + this.getTreatmentPrice(treatment);
    }, 0);
  }

  calculateTotal(config: CommissionConfig): number {
    const base = this.getSizePrice(config.size);
    const stone = this.getStonePrice(config.stoneCoverage);
    const frame = this.getFramePrice(config.frame);
    const features = this.getFeaturesTotal(config.features);
    const treatments = this.getTreatmentsTotal(config.treatments);
    const shipping = this.getShippingPrice(config.shipping);

    return base + stone + frame + features + treatments + shipping;
  }
}
