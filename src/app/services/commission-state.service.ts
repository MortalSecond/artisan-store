import { Injectable, signal } from '@angular/core';
import { CommissionConfig } from '../shared/models/commission-config';

@Injectable({
  providedIn: 'root'
})
export class CommissionStateService {
  // Current Commission Config
  private currentConfig = signal<CommissionConfig | null>(null);
  private estimatedPrice = signal<number>(0);

  constructor() { }

  setCommissionConfig(config: CommissionConfig, price: number){
    this.currentConfig.set(config);
    this.estimatedPrice.set(price);
  }

  getCommissionConfig(){
    return this.currentConfig();
  }

  getEstimatedPrice(){
    return this.estimatedPrice();
  }

  clearCommissionConfig(){
    this.currentConfig.set(null);
    this.estimatedPrice.set(0);
  }

  hasCommissionConfig():boolean{
    return this.currentConfig() !== null;
  }
}
