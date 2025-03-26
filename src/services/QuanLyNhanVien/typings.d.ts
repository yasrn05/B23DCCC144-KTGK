declare module QuanLyNhanVien {
	export interface Record {
		ma: string;
		ten: string;
		chuc_vu: "Nhân viên" | "Quản lý" | "Phó phòng" | "Trưởng phòng";
		phong_ban: "Phòng kế hoạch và đầu tư" | "Phòng kế toán" | "Phòng nghiên cứu và phát triển" | "Phòng quản lý";
		luong: number;
		trang_thai: "Đã ký hợp đồng" | "Thử việc";
	}
}