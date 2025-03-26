// import { getData } from '@/services/QuanLyMonHoc';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);

	const getDataScheduleManagement = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('data_schedule') as any);
		if (!dataLocal?.length) {
			const res = { data: [] };
			localStorage.setItem('data_schedule', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataScheduleManagement,
	};
};
