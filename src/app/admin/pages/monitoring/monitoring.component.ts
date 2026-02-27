import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
  standalone: false,
})
export class MonitoringComponent implements OnInit {
  targetPengeluaran = 6000000;

  // Dummy — nanti dari Supabase
  totalPemasukan = 13000000;
  totalPengeluaran = 4500000;

  get sisaBersih(): number {
    return this.totalPemasukan - this.totalPengeluaran;
  }

  get persenPengeluaran(): number {
    return Math.round((this.totalPengeluaran / this.targetPengeluaran) * 100);
  }

  get sisaTarget(): number {
    return this.targetPengeluaran - this.totalPengeluaran;
  }

  breakdownKategori = [
    { label: '🏠 Kebutuhan Pokok', total: 2000000, persen: 0 },
    { label: '🚗 Transportasi', total: 800000, persen: 0 },
    { label: '👔 Gaya Hidup', total: 1200000, persen: 0 },
    { label: '📱 Langganan', total: 500000, persen: 0 },
  ];

  riwayatBulanan = [
    { label: 'Februari 2026', pemasukan: 13000000, pengeluaran: 4500000, saldo: 8500000 },
    { label: 'Januari 2026', pemasukan: 20000000, pengeluaran: 6200000, saldo: 13800000 },
  ];

  ngOnInit() {
    this.hitungPersenKategori();
  }

  hitungPersenKategori() {
    const total = this.breakdownKategori.reduce((acc, k) => acc + k.total, 0);
    this.breakdownKategori = this.breakdownKategori.map((k) => ({
      ...k,
      persen: total > 0 ? Math.round((k.total / total) * 100) : 0,
    }));
  }
}
