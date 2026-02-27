import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { SupabaseService } from '../../../admin/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
})
export class LoginComponent {
  pin = '';
  isLoading = false;
  errorMsg = '';

  constructor(
    private supabase: SupabaseService,
    private router: Router,
  ) {}

  inputPin(angka: string) {
    if (this.pin.length >= 4 || this.isLoading) return; // ← 6 jadi 4
    this.pin += angka;
    this.errorMsg = '';

    if (this.pin.length === 4) {
      // ← 6 jadi 4
      this.login();
    }
  }

  hapusPin() {
    this.pin = this.pin.slice(0, -1);
    this.errorMsg = '';
  }

  async login() {
    this.isLoading = true;
    try {
      const { error } = await this.supabase.client.auth.signInWithPassword({
        email: environment.ownerEmail, // email kamu, tersimpan di environment
        password: this.pin, // PIN sebagai password
      });

      if (error) throw error;
      this.router.navigate(['/dashboards/dashboard']);
    } catch {
      this.errorMsg = 'PIN salah, coba lagi';
      this.pin = '';
    } finally {
      this.isLoading = false;
    }
  }
}
