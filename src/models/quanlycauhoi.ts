// import { getData } from '@/services/QuanLyMonHoc';
import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);

	const getDataQuanLyCauHoi = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('data_quan_ly_cau_hoi') as any);
		if (!dataLocal?.length) {
			const res = { data: [] };
			localStorage.setItem('data_quan_ly_cau_hoi', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataQuanLyCauHoi,
	};
};
