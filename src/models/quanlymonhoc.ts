// import { getData } from '@/services/QuanLyMonHoc';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);

	const getDataMonHoc = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('data_mon_hoc') as any);
		if (!dataLocal?.length) {
			const res = { data: [] };
			localStorage.setItem('data_mon_hoc', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataMonHoc,
	};
};
