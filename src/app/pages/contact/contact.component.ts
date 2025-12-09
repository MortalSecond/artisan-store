import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactsService } from '../../services/contacts.service';
import { ContactForm, EmailService } from '../../services/email.service';
import { FormsModule } from '@angular/forms';

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
  submitSuccess = signal(false);
  submitError = signal(false);

  submitForm(){
    // Validation
    if (!this.form.name || !this.form.email || !this.form.message){
      alert('Please fill in all required fields.');
      return;
    }

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
    })
  }
}
