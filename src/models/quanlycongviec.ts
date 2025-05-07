import { useState } from 'react';

export default () => {
	const [data, setData] = useState([]);

	const getDataQuanLyCongViec = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
		if (!dataLocal?.length) {
			const res = { data: [] };
			localStorage.setItem('data', JSON.stringify(res?.data ?? []));
			setData(res?.data ?? []);
			return;
		}
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataQuanLyCongViec,
	};
};
