import { Component, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PricingService } from '../../services/pricing.service';
import { CommissionConfig, FeaturesOption, FrameOption, ShippingOption, SizeOption, StoneCoverage, TreatmentsOption } from '../../shared/models/commission-config';

@Component({
  selector: 'app-commission',
  imports: [TranslateModule],
  templateUrl: './commission.component.html',
  styleUrl: './commission.component.css'
})
export class CommissionComponent {
  // Injections
  pricingService = inject(PricingService)

  // Signals
  selectedSize = signal<SizeOption>('small');
  selectedStones = signal<StoneCoverage>('none');
  selectedFrame = signal<FrameOption>('wooden');
  selectedFeatures = signal<FeaturesOption[]>([]);
  selectedTreatments = signal<TreatmentsOption[]>([]);
  selectedShipping = signal<ShippingOption>('domestic');

  // Side Panel Configuration
  config = computed<CommissionConfig>(() => ({
    size: this.selectedSize(),
    stoneCoverage: this.selectedStones(),
    frame: this.selectedFrame(),
    features: this.selectedFeatures(),
    treatments: this.selectedTreatments(),
    shipping: this.selectedShipping()
  }))

  // Computed Prices
  basePrice = computed(() => this.pricingService.getSizePrice(this.selectedSize()));
  stonePrice = computed(() => this.pricingService.getStonePrice(this.selectedStones()));
  framePrice = computed(() => this.pricingService.getFramePrice(this.selectedFrame()));
  featuresPrice = computed(() => this.pricingService.getFeaturesTotal(this.selectedFeatures()));
  treatmentsPrice = computed(() => this.pricingService.getTreatmentsTotal(this.selectedTreatments()));
  shippingPrice = computed(() => this.pricingService.getShippingPrice(this.selectedShipping()));
  totalPrice = computed(() => this.pricingService.calculateTotal(this.config()));

  // Check If Features/Treatments Should Show
  hasFeaturesSelected = computed(() => this.selectedFeatures().length > 0);
  hasTreatmentsSelected = computed(() => this.selectedTreatments().length > 0);

  // Methods To Update Configuration
  selectSize(size: SizeOption){
    this.selectedSize.set(size);
  }

  selectStones(coverage: StoneCoverage){
    this.selectedStones.set(coverage);
  }

  selectFrame(frame: FrameOption){
    this.selectedFrame.set(frame);
  }
  
  toggleFeature(feature: FeaturesOption){
    const current = this.selectedFeatures();

    if(current.includes(feature)){
      // Remove Feature
      this.selectedFeatures.set(current.filter(f => f !== feature));
    }
    else{
      // Add Feature
      this.selectedFeatures.set([...current, feature]);
    }
  }
  
  toggleTreatment(treatment: TreatmentsOption){
    const current = this.selectedTreatments();

    if(current.includes(treatment)){
      // Remove Treatment
      this.selectedTreatments.set(current.filter(f => f !== treatment));
    }
    else{
      // Add Treatment
      this.selectedTreatments.set([...current, treatment]);
    }
  }

  selectShipping(location: ShippingOption){
    this.selectedShipping.set(location);
  }

  // Check If Checkboxes Are Selected
  isFeatureSelected(feature: FeaturesOption): boolean{
    return this.selectedFeatures().includes(feature);
  }

  isTreatmentSelected(treatment: TreatmentsOption): boolean{
    return this.selectedTreatments().includes(treatment);
  }
}
