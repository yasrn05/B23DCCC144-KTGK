import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, InputNumber, Modal, Table, DatePicker, Select } from 'antd';
import { useEffect, useState } from 'react';
import useModel from '@/models/quanlylichtrinhdulich';
import moment from 'moment';

const QuanLyLichTrinhDuLich = () => {
	const { data, getDataLichTrinhDuLich } = useModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyLichTrinhDuLich.Record>();

	useEffect(() => {
		const mockData = [
			{
				ten: 'Hà Nội',
				ngay_bat_dau: '2025-04-20',
				ngay_ket_thuc: '2025-04-25',
				tong: 5000000,
				diem_den: ['Điểm A', 'Điểm B'],
			},
			{
				ten: 'Đà Nẵng',
				ngay_bat_dau: '2025-05-01',
				ngay_ket_thuc: '2025-05-05',
				tong: 7000000,
				diem_den: ['Điểm C', 'Điểm D'],
			},
			{
				ten: 'Hồ Chí Minh',
				ngay_bat_dau: '2025-06-10',
				ngay_ket_thuc: '2025-06-15',
				tong: 6000000,
				diem_den: ['Điểm E', 'Điểm F'],
			},
		];

		const dataLocal = localStorage.getItem('data_lich_trinh_du_lich');
		if (!dataLocal) {
			localStorage.setItem('data_lich_trinh_du_lich', JSON.stringify(mockData));
		}

		getDataLichTrinhDuLich();
	}, []);

	const columns: IColumn<QuanLyLichTrinhDuLich.Record>[] = [
		{
			title: 'Tên lịch trình',
			dataIndex: 'ten',
			key: 'ten',
			width: 200,
		},
		{
			title: 'Ngày bắt đầu',
			dataIndex: 'ngay_bat_dau',
			key: 'ngay_bat_dau',
			width: 200,
			sorter: (a, b) => new Date(a.ngay_bat_dau || '').getTime() - new Date(b.ngay_bat_dau || '').getTime(),
			render: (value) => moment(value).format('YYYY-MM-DD'),
		},
		{
			title: 'Ngày kết thúc',
			dataIndex: 'ngay_ket_thuc',
			key: 'ngay_ket_thuc',
			width: 200,
			sorter: (a, b) => new Date(a.ngay_ket_thuc || '').getTime() - new Date(b.ngay_ket_thuc || '').getTime(),
			render: (value) => moment(value).format('YYYY-MM-DD'),
		},
		{
			title: 'Thời gian di chuyển (ngày)',
			key: 'thoi_gian_di_chuyen',
			width: 200,
			render: (record) => {
				const ngayBatDau = moment(record.ngay_bat_dau);
				const ngayKetThuc = moment(record.ngay_ket_thuc);
				return ngayKetThuc.diff(ngayBatDau, 'days') + ' ngày';
			},
		},
		{
			title: 'Tổng ngân sách',
			dataIndex: 'tong',
			key: 'tong',
			width: 200,
			render: (value) => `${value.toLocaleString()} VND`,
		},
		{
			title: 'Danh sách điểm đến',
			dataIndex: 'diem_den',
			key: 'diem_den',
			width: 300,
			render: (diemDen) => diemDen.join(', '),
		},
		{
			title: 'Sửa/xóa',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Sửa
						</Button>
						<Button
							style={{ marginLeft: 10 }}
							onClick={() => {
								const dataLocal: any = JSON.parse(localStorage.getItem('data_lich_trinh_du_lich') as any);
								const newData = dataLocal.filter((item: any) => item.ten !== record.ten);
								localStorage.setItem('data_lich_trinh_du_lich', JSON.stringify(newData));
								getDataLichTrinhDuLich();
							}}
							type='primary'
						>
							Xóa
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
				}}
			>
				Thêm
			</Button>
			<Table dataSource={data} columns={columns} />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa' : 'Thêm'}
				visible={visible}
				onOk={() => { }}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onFinish={(values) => {
						const index = data.findIndex((item: any) => item.ten === row?.ten);
						const dataTemp: QuanLyLichTrinhDuLich.Record[] = [...data];
						const newValues = {
							...values,
							ngay_bat_dau: values.ngay_bat_dau ? values.ngay_bat_dau.toDate() : null,
							ngay_ket_thuc: values.ngay_ket_thuc ? values.ngay_ket_thuc.toDate() : null,
						};
						dataTemp.splice(index, 1, newValues);
						const dataLocal = isEdit ? dataTemp : [newValues, ...data];
						localStorage.setItem('data_lich_trinh_du_lich', JSON.stringify(dataLocal));
						setVisible(false);
						getDataLichTrinhDuLich();
					}}
				>
					<Form.Item
						initialValue={row?.ten}
						label='Tên lịch trình'
						name='ten'
						rules={[{ required: true, message: 'Please input your Tên lịch trình!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.ngay_bat_dau ? moment(row.ngay_bat_dau) : null}
						label='Ngày bắt đầu'
						name='ngay_bat_dau'
						rules={[{ required: true, message: 'Please select your Ngày bắt đầu!' }]}
					>
						<DatePicker format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item
						initialValue={row?.ngay_ket_thuc ? moment(row.ngay_ket_thuc) : null}
						label='Ngày kết thúc'
						name='ngay_ket_thuc'
						rules={[{ required: true, message: 'Please select your Ngày kết thúc!' }]}
					>
						<DatePicker format="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item
						initialValue={row?.tong}
						label='Tổng ngân sách'
						name='tong'
						rules={[{ required: true, message: 'Please input your Tổng ngân sách!' }]}
					>
						<InputNumber min={1} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
					</Form.Item>
					<Form.Item
						initialValue={row?.diem_den}
						label='Danh sách điểm đến'
						name='diem_den'
						rules={[{ required: true, message: 'Vui lòng chọn danh sách điểm đến!' }]}
					>
						<Select
							mode="tags"
							placeholder="Nhập hoặc chọn các điểm đến"
							style={{ width: '100%' }}
						>
							<Select.Option value="Điểm A">Điểm A</Select.Option>
							<Select.Option value="Điểm B">Điểm B</Select.Option>
							<Select.Option value="Điểm C">Điểm C</Select.Option>
							<Select.Option value="Điểm D">Điểm D</Select.Option>
							<Select.Option value="Điểm E">Điểm E</Select.Option>
							<Select.Option value="Điểm F">Điểm F</Select.Option>
						</Select>
					</Form.Item>
					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisible(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyLichTrinhDuLich;