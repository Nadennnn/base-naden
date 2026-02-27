import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class PendapatanService {
  private table = 'transaksi_pendapatan';

  constructor(private supabase: SupabaseService) {}

  async getAll(bulan?: Date) {
    const userId = await this.supabase.getUserId();

    let query = this.supabase.client
      .from(this.table)
      .select(`*, kategori:kategori_pendapatan(nama, emoji)`)
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

  async create(payload: {
    nominal: number;
    sumber: string;
    kategori_id: string;
    keterangan?: string;
    tanggal: string;
  }) {
    const userId = await this.supabase.getUserId();
    const { data, error } = await this.supabase.client
      .from(this.table)
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string) {
    const userId = await this.supabase.getUserId();
    const { error } = await this.supabase.client
      .from(this.table)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  }

  async getTotalBulanIni(): Promise<number> {
    const data = await this.getAll(new Date());
    return data.reduce((acc, item) => acc + item.nominal, 0);
  }
}
