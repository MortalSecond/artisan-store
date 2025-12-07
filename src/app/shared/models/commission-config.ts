export interface CommissionConfig {
    size: SizeOption;
    stoneCoverage: StoneCoverage;
    frame: FrameOption;
    features: FeaturesOption[];
    treatments: TreatmentsOption[];
    shipping: ShippingOption;
}

export type SizeOption = 'small' | 'medium' | 'large' | 'extra-large';
export type StoneCoverage = 'none' | 'light' | 'medium' | 'heavy';
export type FrameOption = 'wooden' | 'mirror' | 'led-wooden' | 'led-mirror';
export type FeaturesOption = 'clock' | 'diamond-strips' | 'studs' | 'leds';
export type TreatmentsOption = 'resin' | 'geode';
export type ShippingOption = 'domestic' | 'north-america' | 'international';