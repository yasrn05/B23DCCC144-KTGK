// import { getData } from '@/services/QuanLyMonHoc';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);

	const getDataUngVien = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('data_ung_vien') as any);
		if (!dataLocal?.length) {
			const res = { data: [] };
			localStorage.setItem('data_ung_vien', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataUngVien,
	};
};
