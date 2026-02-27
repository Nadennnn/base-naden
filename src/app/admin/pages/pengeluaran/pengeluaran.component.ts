import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KategoriService } from '../../services/kategori.service';
import { PengeluaranService } from '../../services/pengeluaran.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-pengeluaran',
  templateUrl: './pengeluaran.component.html',
  styleUrls: ['./pengeluaran.component.scss'],
  standalone: false,
})
export class PengeluaranComponent implements OnInit {
  form!: FormGroup;
  isFormOpen = false;
  isLoading = false;
  selectedFilter = 'semua';
  transaksi: any[] = [];
  kategoriList: any[] = [];
  filterKategori: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pengeluaranService: PengeluaranService,
    private kategoriService: KategoriService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      nominal: [null, [Validators.required, Validators.min(1)]],
      kategori_id: ['', Validators.required],
      keterangan: ['', Validators.required],
      tanggal: [new Date().toISOString().split('T')[0], Validators.required],
    });

    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      //await this.supabaseService.waitForUser();
      [this.transaksi, this.kategoriList] = await Promise.all([
        this.pengeluaranService.getAll(new Date()),
        this.kategoriService.getKategoriPengeluaran(),
      ]);

      this.filterKategori = [
        { value: 'semua', label: 'Semua' },
        ...this.kategoriList.map((k) => ({
          value: k.id,
          label: `${k.emoji} ${k.nama}`,
        })),
      ];
    } finally {
      this.isLoading = false;
    }
  }

  get totalPengeluaran(): number {
    return this.transaksi.reduce((acc, t) => acc + t.nominal, 0);
  }

  get jumlahTransaksi(): number {
    return this.transaksi.length;
  }

  get filteredTransaksi(): any[] {
    if (this.selectedFilter === 'semua') return this.transaksi;
    return this.transaksi.filter((t) => t.kategori_id === this.selectedFilter);
  }

  setFilter(value: string) {
    this.selectedFilter = value;
  }

  bukaForm() {
    this.isFormOpen = true;
  }

  tutupForm() {
    this.isFormOpen = false;
    this.form.reset({
      tanggal: new Date().toISOString().split('T')[0],
    });
  }

  async simpan() {
    if (this.form.invalid) return;
    this.isLoading = true;
    try {
      const newItem = await this.pengeluaranService.create(this.form.value);
      this.transaksi.unshift({
        ...newItem,
        kategori: this.kategoriList.find((k) => k.id === newItem.kategori_id),
        tanggal: new Date(newItem.tanggal),
      });
      this.tutupForm();
    } finally {
      this.isLoading = false;
    }
  }

  async hapusTransaksi(id: string) {
    await this.pengeluaranService.delete(id);
    this.transaksi = this.transaksi.filter((t) => t.id !== id);
  }
}
