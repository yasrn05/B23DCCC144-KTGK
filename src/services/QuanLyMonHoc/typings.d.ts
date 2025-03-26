declare module QuanLyMonHoc {
	export interface Record {
		ma_mon: string;
		ten_mon: string;
		so_tin_chi: number;
	}
}
declare module QuanLyCauHoi {
	export interface Record {
		ma_cau_hoi: string;
		ten_mon: string;
		noi_dung: string;
		muc_do: "0" | "1" | "2" | "3";
		khoi_kien_thuc: string;
	}
}
declare module QuanLyDeThi {
	export interface Record {
		ma_de_thi: string;
		so_cau: number;
		muc_do: "0" | "1" | "2" | "3";
		khoi_kien_thuc: string;
	}
}