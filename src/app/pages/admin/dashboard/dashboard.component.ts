import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Painting } from '../../../shared/models/painting';
import { PaintingService } from '../../../services/painting.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RequestsService } from '../../../services/requests.service';
import { FormsModule } from '@angular/forms';
import { PricingService } from '../../../services/pricing.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  // Services
  authService = inject(AuthService);
  paintingService = inject(PaintingService);
  requestsService = inject(RequestsService);
  pricingService = inject(PricingService);
  router = inject(Router);

  // Signals
  paintings = toSignal(this.paintingService.getAllPaintings(),{
    initialValue: []
  });
  contacts = toSignal(this.requestsService.getAllInquiries(),{
    initialValue: []
  });
  commissions = toSignal(this.requestsService.getAllCommissions())
  isDashboardSelected = signal(true);
  isPaintingsSelected = signal(false);
  isPricesSelected = signal(false);
  isContactsSelected = signal(false);
  isCommissionsSelected = signal(false);
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isUploading = signal(false);
  
  // Form data
  paintingForm = {
    title: '',
    price: 0,
    height: 0,
    width: 0,
    details: ''
  };

  // Computed Values
  paintingsCount = computed(()=>this.paintings().length);
  contactsCount = computed(()=>this.contacts.length)
  commissionsCount = computed(()=>this.commissions.length)

  // Functional Methods
  logout(){
    this.authService.logout();
    this.router.navigate(['admin/login']);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage.set(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  
  removeImage() {
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

  resetForm() {
    this.paintingForm = {
      title: '',
      price: 0,
      height: 0,
      width: 0,
      details: ''
    };
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

  uploadPainting(){
    // Validation
    if (!this.selectedImage()) {
      alert('Porfavor selecciona una imagen.');
      return;
    }
    if (!this.paintingForm.title || !this.paintingForm.price) {
      alert('Porfavor rellena los campos de titulo y precio.');
      return;
    }

    this.isUploading.set(true);

    // Create FormData
    const formData = new FormData();
    formData.append('ImageFile', this.selectedImage()!);
    formData.append('Title', this.paintingForm.title);
    formData.append('Price', this.paintingForm.price.toString());
    formData.append('HeightCm', this.paintingForm.height.toString());
    formData.append('WidthCm', this.paintingForm.width.toString());
    formData.append('Details', this.paintingForm.details);

    this.paintingService.uploadPainting(formData).subscribe({
      next: (response) =>{
        console.log("Success:", response);
        this.resetForm();
        this.isUploading.set(false);
      },
      error: (error) =>{
        console.log("Error:", error);
        if(error.status === 401){
          alert('Sesión expirada. Porfavor inicia sesión de nuevo.')
          this.logout();
        }

        this.isUploading.set(false);
      }
    });
  }

  // UI Methods
  selectDashboard(){
    this.isDashboardSelected.set(true);
    this.isPaintingsSelected.set(false);
    this.isPricesSelected.set(false);
    this.isContactsSelected.set(false);
    this.isCommissionsSelected.set(false);
  }
  
  selectPainting(){
    this.isDashboardSelected.set(false);
    this.isPaintingsSelected.set(true);
    this.isPricesSelected.set(false);
    this.isContactsSelected.set(false);
    this.isCommissionsSelected.set(false);
  }
  
  selectPrices(){
    this.isDashboardSelected.set(false);
    this.isPaintingsSelected.set(false);
    this.isPricesSelected.set(true);
    this.isContactsSelected.set(false);
    this.isCommissionsSelected.set(false);
  }
  
  selectContacts(){
    this.isDashboardSelected.set(false);
    this.isPaintingsSelected.set(false);
    this.isPricesSelected.set(false);
    this.isContactsSelected.set(true);
    this.isCommissionsSelected.set(false);
  }
  
  selectCommission(){
    this.isDashboardSelected.set(false);
    this.isPaintingsSelected.set(false);
    this.isPricesSelected.set(false);
    this.isContactsSelected.set(false);
    this.isCommissionsSelected.set(true);
  }
}
