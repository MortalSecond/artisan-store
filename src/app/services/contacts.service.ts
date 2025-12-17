import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  // Currently Used Contact Methods
  private readonly contacts: Record<string, string> = {
    'email': "carmenartisan@gmail.com"
  }

  constructor() { }

  // Extract Contact Information
  getEmail():string{
    return this.contacts['email'];
  }
}
