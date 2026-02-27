import { Component, OnInit } from '@angular/core';
import { AlokasiService } from '../../services/alokasi.service';
import { PendapatanService } from '../../services/pendapatan.service';
import { PengeluaranService } from '../../services/pengeluaran.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  isLoading = false;

  totalPendapatan = 0;
  totalPengeluaran = 0;
  kebutuhanBulanan = 6000000;

  persen = { saham: 50, krom: 30, kripto: 20 };

  recentTransactions: any[] = [];

  constructor(
    private pendapatanService: PendapatanService,
    private pengeluaranService: PengeluaranService,
    private alokasiService: AlokasiService,
    private supabaseService: SupabaseService,
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      //await this.supabaseService.waitForUser();
      const [totalPendapatan, totalPengeluaran, recentPengeluaran, setting] = await Promise.all([
        this.pendapatanService.getTotalBulanIni(),
        this.pengeluaranService.getTotalBulanIni(),
        this.pengeluaranService.getAll(new Date()),
        this.alokasiService.getSetting(),
      ]);

      this.totalPendapatan = totalPendapatan;
      this.totalPengeluaran = totalPengeluaran;
      this.kebutuhanBulanan = setting.kebutuhan_bulanan;
      this.persen = {
        saham: setting.persen_saham,
        krom: setting.persen_krom,
        kripto: setting.persen_kripto,
      };

      // Ambil 5 transaksi pengeluaran terakhir
      this.recentTransactions = (recentPengeluaran ?? []).slice(0, 5).map((t) => ({
        ...t,
        type: 'keluar',
        kategori: t.kategori?.nama ?? 'Lainnya',
        tanggal: new Date(t.tanggal),
      }));
    } finally {
      this.isLoading = false;
    }
  }

  get sisaBersih(): number {
    return this.totalPendapatan - this.totalPengeluaran;
  }

  get danaInvestasi(): number {
    const sisa = this.totalPendapatan - this.kebutuhanBulanan;
    return sisa > 0 ? sisa : 0;
  }

  get saham(): number {
    return (this.danaInvestasi * this.persen.saham) / 100;
  }
  get krom(): number {
    return (this.danaInvestasi * this.persen.krom) / 100;
  }
  get kripto(): number {
    return (this.danaInvestasi * this.persen.kripto) / 100;
  }
}
