import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environments';
import { BehaviorSubject, Observable, filter, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  client: SupabaseClient;
  private currentUser$ = new BehaviorSubject<User | null | undefined>(undefined);

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    // Restore session saat app pertama kali load
    this.client.auth.getSession().then(({ data }) => {
      this.currentUser$.next(data.session?.user ?? null);
    });

    // Listen perubahan auth state (login/logout)
    this.client.auth.onAuthStateChange((_, session) => {
      this.currentUser$.next(session?.user ?? null);
    });
  }

  // Observable untuk subscribe di component
  get user(): Observable<User | null | undefined> {
    return this.currentUser$.asObservable();
  }

  // Synchronous getter — bisa null kalau auth belum resolve
  get userId(): string | null {
    return this.currentUser$.getValue()?.id ?? null;
  }

  // Async getter — TUNGGU sampai auth selesai resolve
  // Ini yang harus dipakai di semua service sebelum query ke Supabase
  async getUserId(): Promise<string> {
    const user = await firstValueFrom(
      this.currentUser$.pipe(
        filter((u) => u !== undefined), // tunggu sampai bukan undefined
      ),
    );
    if (!user) throw new Error('USER_NOT_AUTHENTICATED');
    return user.id;
  }

  // Login dengan Google OAuth
  async signInWithGoogle() {
    return this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboards/dashboard',
      },
    });
  }

  // Logout
  async signOut() {
    return this.client.auth.signOut();
  }

  // Cek apakah user sudah login (untuk auth guard)
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getUserId();
      return true;
    } catch {
      return false;
    }
  }
}
