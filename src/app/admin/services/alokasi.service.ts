import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AlokasiService {
  constructor(private supabase: SupabaseService) {}

  async getSetting() {
    const userId = await this.supabase.getUserId();
    const { data, error } = await this.supabase.client
      .from('alokasi_setting')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  }

  async updateSetting(payload: {
    persen_saham: number;
    persen_krom: number;
    persen_kripto: number;
    kebutuhan_bulanan: number;
  }) {
    const userId = await this.supabase.getUserId();
    const { data, error } = await this.supabase.client
      .from('alokasi_setting')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getRealisasi(bulan?: Date) {
    const userId = await this.supabase.getUserId();

    let query = this.supabase.client
      .from('realisasi_investasi')
      .select('*')
      .eq('user_id', userId)
      .order('tanggal', { ascending: false });

    if (bulan) {
      const start = new Date(bulan.getFullYear(), bulan.getMonth(), 1).toISOString().split('T')[0];
      const end = new Date(bulan.getFullYear(), bulan.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
      query = query.gte('tanggal', start).lte('tanggal', end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async createRealisasi(payload: {
    jenis: string;
    nominal: number;
    catatan?: string;
    tanggal: string;
  }) {
    const userId = await this.supabase.getUserId();
    const { data, error } = await this.supabase.client
      .from('realisasi_investasi')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
