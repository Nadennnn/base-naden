import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class KategoriService {
  constructor(private supabase: SupabaseService) {}

  async getKategoriPengeluaran() {
    const userId = await this.supabase.getUserId();
    const { data, error } = await this.supabase.client
      .from('kategori_pengeluaran')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async getKategoriPendapatan() {
    const userId = await this.supabase.getUserId();
    const { data, error } = await this.supabase.client
      .from('kategori_pendapatan')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
}
