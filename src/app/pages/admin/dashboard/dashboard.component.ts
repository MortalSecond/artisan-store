import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { PaintingService } from '../../../services/painting.service';
import { RequestsService } from '../../../services/requests.service';
import { FormsModule } from '@angular/forms';
import { PricingService } from '../../../services/pricing.service';
import { DecimalPipe } from '@angular/common';
import { Painting } from '../../../shared/models/painting';

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
  paintings = signal<Painting[]>([]);
  contacts = signal<any[]>([]);
  commissions = signal<any[]>([]);
  // Loading states
  isLoadingPaintings = signal(true);
  isLoadingContacts = signal(true);
  isLoadingCommissions = signal(true);
  // UI State
  isDashboardSelected = signal(true);
  isPaintingsSelected = signal(false);
  isPricesSelected = signal(false);
  isContactsSelected = signal(false);
  isCommissionsSelected = signal(false);
  // Upload State
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  isUploading = signal(false);
  uploadError = signal<string | null>(null);
  uploadSuccess = signal(false);
  
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

  constructor(){
    this.loadPaintings();
    this.loadContacts();
    this.loadCommissions();
  }

  // Data loading methods
  private loadPaintings() {
    this.isLoadingPaintings.set(true);
    this.paintingService.getAllPaintings().subscribe({
      next: (paintings) => {
        this.paintings.set(paintings);
        this.isLoadingPaintings.set(false);
      },
      error: (error) => {
        console.error('Error loading paintings:', error);
        this.isLoadingPaintings.set(false);
      }
    });
  }

  private loadContacts() {
    this.isLoadingContacts.set(true);
    this.requestsService.getAllInquiries().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.isLoadingContacts.set(false);
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.isLoadingContacts.set(false);
      }
    });
  }

  private loadCommissions() {
    this.isLoadingCommissions.set(true);
    this.requestsService.getAllCommissions().subscribe({
      next: (commissions) => {
        this.commissions.set(commissions);
        this.isLoadingCommissions.set(false);
      },
      error: (error) => {
        console.error('Error loading commissions:', error);
        this.isLoadingCommissions.set(false);
      }
    });
  }

  // Functional Methods
  logout(){
    this.authService.logout();
    this.router.navigate(['admin/login']);
  }

  // Paintings Methods
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedImage.set(file);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.uploadError.set('Please select a valid image file');
        return;
      }
      
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
    // Reset messages
    this.uploadError.set(null);
    this.uploadSuccess.set(false);

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
    formData.append('Height', this.paintingForm.height.toString());
    formData.append('Width', this.paintingForm.width.toString());
    formData.append('Details', this.paintingForm.details);

    this.paintingService.uploadPainting(formData).subscribe({
      next: (response) =>{
        console.log("Success:", response);
        this.isUploading.set(false);
        this.uploadSuccess.set(true);

        this.resetForm();
        // Refresh paintings list
        this.loadPaintings();


        // Hide success message after 3 seconds
        setTimeout(() => this.uploadSuccess.set(false), 3000);
      },
      error: (error) =>{
        console.log("Error:", error);

        if (error.status === 401) {
          this.uploadError.set('Sesión expirada. Redirigiendo al login...');
        } else if (error.status === 400) {
          this.uploadError.set(error.error?.message || 'Datos inválidos. Verifica el formulario.');
        } else {
          this.uploadError.set('Error al subir la pintura. Intenta de nuevo.');
        }

        this.isUploading.set(false);
      }
    });
  }

  deletePainting(id: number) {
    if (confirm('¿Estás seguro de eliminar esta pintura?')) {
      this.paintingService.deletePainting(id).subscribe({
        next: () => {
          // Refresh paintings list
          this.loadPaintings();
        },
        error: (error) => {
          console.error('Error deleting painting:', error);
          alert('Error al eliminar la pintura');
        }
      });
    }
  }

  togglePaintingAvailability(id: number) {
    this.paintingService.toggleAvailability(id).subscribe({
      next: (response) => {
        // Refresh paintings list
        this.loadPaintings();
        
        console.log('Availability toggled:', response.available);
      },
      error: (error) => {
        console.error('Error toggling availability:', error);
        alert('Error al cambiar disponibilidad');
      }
    });
  }

  // Contact Inquiries Methods


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
