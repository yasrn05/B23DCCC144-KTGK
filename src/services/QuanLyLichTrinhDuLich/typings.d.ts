declare module QuanLyLichTrinhDuLich {
	export interface Record {
		ten: string;
		ngay_bat_dau: Date | null;
		ngay_ket_thuc: Date | null;
		diem_den: string[];
		thoi_gian_di_chuyen: number;
		tong: number;
	}
}