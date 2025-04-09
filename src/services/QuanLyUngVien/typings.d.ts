declare module QuanLyUngVien {
	export interface Record {
		ho_ten: string;
		email: string;
		nguyen_vong: "design" | "dev" | "media";
		ly_do: string;
		trang_thai: "pending" | "approved" | "rejected";
	}
}