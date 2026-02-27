import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KategoriService } from '../../services/kategori.service';
import { PendapatanService } from '../../services/pendapatan.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-pendapatan',
  templateUrl: './pendapatan.component.html',
  styleUrls: ['./pendapatan.component.scss'],
  standalone: false,
})
export class PendapatanComponent implements OnInit {
  form!: FormGroup;
  isFormOpen = false;
  isLoading = false;
  riwayat: any[] = [];
  kategoriList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pendapatanService: PendapatanService,
    private kategoriService: KategoriService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      nominal: [null, [Validators.required, Validators.min(1)]],
      sumber: ['', Validators.required],
      kategori_id: ['', Validators.required],
      keterangan: [''],
      tanggal: [new Date().toISOString().split('T')[0], Validators.required],
    });

    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      //await this.supabaseService.waitForUser();
      [this.riwayat, this.kategoriList] = await Promise.all([
        this.pendapatanService.getAll(new Date()),
        this.kategoriService.getKategoriPendapatan(),
      ]);
    } finally {
      this.isLoading = false;
    }
  }

  get totalPendapatan(): number {
    return this.riwayat.reduce((acc, item) => acc + item.nominal, 0);
  }

  get jumlahSumber(): number {
    return new Set(this.riwayat.map((r) => r.sumber)).size;
  }

  get breakdownSumber() {
    const map = new Map<string, any>();
    this.riwayat.forEach((item) => {
      if (map.has(item.sumber)) {
        map.get(item.sumber).nominal += item.nominal;
      } else {
        map.set(item.sumber, {
          nama: item.sumber,
          kategori: item.kategori?.nama ?? '-',
          nominal: item.nominal,
          emoji: item.kategori?.emoji ?? '💼',
          bgColor: 'rgba(34,197,94,0.15)',
        });
      }
    });

    const total = this.totalPendapatan;
    return Array.from(map.values()).map((s) => ({
      ...s,
      persentase: total > 0 ? Math.round((s.nominal / total) * 100) : 0,
    }));
  }

  bukaForm() {
    this.isFormOpen = true;
  }

  tutupForm() {
    this.isFormOpen = false;
    this.form.reset({ tanggal: new Date().toISOString().split('T')[0] });
  }

  async simpan() {
    if (this.form.invalid) return;
    this.isLoading = true;
    try {
      const newItem = await this.pendapatanService.create(this.form.value);
      this.riwayat.unshift(newItem);
      this.tutupForm();
    } finally {
      this.isLoading = false;
    }
  }

  async hapus(id: string) {
    await this.pendapatanService.delete(id);
    this.riwayat = this.riwayat.filter((r) => r.id !== id);
  }
}
