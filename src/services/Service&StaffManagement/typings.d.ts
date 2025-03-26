declare module StaffManagement {
	export interface Record {
		staff_id: string;
		staff_name: string;
		limit_customer: number;
		current_customer: number;
		schedule: string[];
	}
}
declare module ServiceManagement {
	export interface Record {
		service_id: string;
		service_name: string;
		start_time: string;
		end_time: string;
		price: number;
	}
}
declare module ScheduleManagement {
	export interface Record {
		schedule_id: string;
		start_time: string;
		end_time: string;
		day: "0" | "1" | "2" | "3" | "4" | "5" | "6";
	}
}