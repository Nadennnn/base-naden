import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlokasiService } from '../../services/alokasi.service';
import { PendapatanService } from '../../services/pendapatan.service';
import { PengeluaranService } from '../../services/pengeluaran.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-alokasi',
  templateUrl: './alokasi.component.html',
  styleUrls: ['./alokasi.component.scss'],
  standalone: false,
})
export class AlokasiComponent implements OnInit {
  form!: FormGroup;
  isFormOpen = false;
  isEditing = false;
  isLoading = false;

  danaInvestasi = 0;
  realisasi: any[] = [];

  persen = {
    saham: 50,
    krom: 30,
    kripto: 20,
  };

  kebutuhanBulanan = 6000000;

  jenisMap: Record<string, { label: string; emoji: string; bgColor: string }> = {
    saham: { label: 'Pasar Saham', emoji: '📈', bgColor: 'rgba(34,197,94,0.15)' },
    krom: { label: 'KROM Dana Darurat', emoji: '🛡️', bgColor: 'rgba(234,179,8,0.15)' },
    kripto: { label: 'Kripto', emoji: '₿', bgColor: 'rgba(99,102,241,0.15)' },
  };

  constructor(
    private fb: FormBuilder,
    private alokasiService: AlokasiService,
    private pendapatanService: PendapatanService,
    private pengeluaranService: PengeluaranService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      jenis: ['', Validators.required],
      nominal: [null, [Validators.required, Validators.min(1)]],
      catatan: [''],
      tanggal: [new Date().toISOString().split('T')[0], Validators.required],
    });

    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      //await this.supabaseService.waitForUser();
      const [setting, realisasiData, totalPendapatan, totalPengeluaran] = await Promise.all([
        this.alokasiService.getSetting(),
        this.alokasiService.getRealisasi(new Date()),
        this.pendapatanService.getTotalBulanIni(),
        this.pengeluaranService.getTotalBulanIni(),
      ]);

      // Load setting alokasi
      this.persen.saham = setting.persen_saham;
      this.persen.krom = setting.persen_krom;
      this.persen.kripto = setting.persen_kripto;
      this.kebutuhanBulanan = setting.kebutuhan_bulanan;

      // Hitung dana investasi
      this.danaInvestasi = totalPendapatan - this.kebutuhanBulanan;
      if (this.danaInvestasi < 0) this.danaInvestasi = 0;

      // Map realisasi dengan label & emoji
      this.realisasi = realisasiData.map((r) => ({
        ...r,
        jenis: this.jenisMap[r.jenis]?.label ?? r.jenis,
        emoji: this.jenisMap[r.jenis]?.emoji ?? '💰',
        bgColor: this.jenisMap[r.jenis]?.bgColor ?? 'rgba(99,102,241,0.15)',
        tanggal: new Date(r.tanggal),
      }));
    } finally {
      this.isLoading = false;
    }
  }

  get nominalSaham(): number {
    return (this.danaInvestasi * this.persen.saham) / 100;
  }
  get nominalKrom(): number {
    return (this.danaInvestasi * this.persen.krom) / 100;
  }
  get nominalKripto(): number {
    return (this.danaInvestasi * this.persen.kripto) / 100;
  }
  get totalPersen(): number {
    return this.persen.saham + this.persen.krom + this.persen.kripto;
  }

  async toggleEdit() {
    if (this.isEditing) {
      if (this.totalPersen !== 100) return;
      await this.alokasiService.updateSetting({
        persen_saham: this.persen.saham,
        persen_krom: this.persen.krom,
        persen_kripto: this.persen.kripto,
        kebutuhan_bulanan: this.kebutuhanBulanan,
      });
    }
    this.isEditing = !this.isEditing;
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
      const { jenis, nominal, catatan, tanggal } = this.form.value;
      const newItem = await this.alokasiService.createRealisasi({
        jenis,
        nominal,
        catatan,
        tanggal,
      });
      const meta = this.jenisMap[jenis];
      this.realisasi.unshift({
        ...newItem,
        jenis: meta.label,
        emoji: meta.emoji,
        bgColor: meta.bgColor,
        tanggal: new Date(newItem.tanggal),
      });
      this.tutupForm();
    } finally {
      this.isLoading = false;
    }
  }
}
