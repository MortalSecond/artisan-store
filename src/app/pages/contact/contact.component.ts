import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactsService } from '../../services/contacts.service';
import { ContactForm, EmailService } from '../../services/email.service';
import { FormsModule } from '@angular/forms';
import { CommissionStateService } from '../../services/commission-state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [TranslateModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  // Services
  contactService = inject(ContactsService);
  private emailService = inject(EmailService);
  private commissionState = inject(CommissionStateService);
  private route = inject(ActivatedRoute);

  // Form Model
  form: ContactForm = {
    name: '',
    email: '',
    phone: '',
    inquiryType: 'commission',
    message: ''
  }

  // UI State
  isSubmitting = signal(false);
  isCommissionRequest = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);
  commissionConfig = signal<any>(null);
  estimatedPrice = signal(0);
  selectedImage = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  ngOnInit(){
    // Check if the user is coming from the commission page
    this.route.queryParams.subscribe(params=>{
      if(params['commission']==='true'){
        const config = this.commissionState.getCommissionConfig();
        if(config){
          this.isCommissionRequest.set(true);
          this.commissionConfig.set(config);
          this.estimatedPrice.set(this.commissionState.getEstimatedPrice());
          this.form.inquiryType = 'commission';
        }
      }
    });
  }

  // Image Handling
  onImageSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files[0]){
      const file = input.files[0];
      this.selectedImage.set(file);

      // Create Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  
  RemoveImage(){
    this.selectedImage.set(null);
    this.imagePreview.set(null);
  }

  submitForm(){
    // Validation
    if (!this.form.name || !this.form.email || !this.form.message){
      alert('Please fill in all required fields.');
      return;
    }

    if(this.isCommissionRequest())
      this.SubmitCommissionRequest();
    else
      this.SubmitRegularContact();
  }

  private SubmitRegularContact(){
    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);
    
    this.emailService.submitContactForm(this.form).subscribe({
      next: (response) => {
        console.log('Form submitted successfully', response);
        this.submitSuccess.set(true);
        this.isSubmitting.set(false);

        // Reset Form
        this.form = {
          name: '',
          email: '',
          phone: '',
          inquiryType: 'commission',
          message: ''
        };
      },
      error: (error) => {
        console.log('Error submitting form:', error);
        this.submitError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  private SubmitCommissionRequest(){
    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    const config = this.commissionConfig();
    if(!config){
      this.submitError.set(true);
      this.isSubmitting.set(false);
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append('name', this.form.name);
    formData.append('email', this.form.email);
    formData.append('phone', this.form.phone || '');
    formData.append('message', this.form.message || '');

    // Commission Config
    formData.append('size', config.size);
    formData.append('stoneCoverage', config.stoneCoverage);
    formData.append('frame', config.frame);
    formData.append('features', config.features.join(','));
    formData.append('treatments', config.treatments.join(','));
    formData.append('shipping', config.shipping);
    formData.append('estimatedPrice', this.estimatedPrice().toString());

    // Optional Image
    if(this.selectedImage())
      formData.append('paintingImage',this.selectedImage()!);
    
    this.emailService.submitCommissionRequest(formData).subscribe({
      next: (response) => {
        console.log('Commission request submitted successfully', response);
        this.submitSuccess.set(true);
        this.isSubmitting.set(false);

        // Clear Commission State
        this.commissionState.clearCommissionConfig();
        this.isCommissionRequest.set(false);
        this.commissionConfig.set(null);
        this.estimatedPrice.set(0);
        this.selectedImage.set(null);
        this.imagePreview.set(null);

        // Reset Form
        this.form = {
          name: '',
          email: '',
          phone: '',
          inquiryType: 'commission',
          message: ''
        };
      },
      error: (error) => {
        console.log('Error submitting form:', error);
        this.submitError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }
}
