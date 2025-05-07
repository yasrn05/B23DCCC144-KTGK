declare module QuanLyCongViec {
	export interface Record {
		id: string;
		work: string;
		name: string;
		uu_tien: "Thấp" | "Trung bình" | "Cao";
		trang_thai: "Cần làm" | "Đang làm" | "Đã hoàn thành";
	}
}