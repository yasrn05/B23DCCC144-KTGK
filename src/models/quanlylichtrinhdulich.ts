// import { getData } from '@/services/QuanLyMonHoc';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);

	const getDataLichTrinhDuLich = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('data_lich_trinh_du_lich') as any);
		if (!dataLocal?.length) {
			const res = { data: [] };
			localStorage.setItem('data_lich_trinh_du_lich', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataLichTrinhDuLich,
	};
};
