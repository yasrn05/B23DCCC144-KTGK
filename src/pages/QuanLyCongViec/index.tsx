import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, Modal, Table, Select } from 'antd';
import { useEffect, useState } from 'react';
import useModel from '@/models/quanlycongviec';
// import moment from 'moment';

const QuanLyCongViec = () => {
	const { data, getDataQuanLyCongViec } = useModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyCongViec.Record>();
	const [userNames, setUserNames] = useState<string[]>([]); // State để lưu danh sách tên người dùng

	useEffect(() => {
		const mockData = [
			{
				name: 'Trần Đăng Sang',
				user: 'sang',
				pass: '1',
			},
			{
				name: 'Nguyễn Minh Hiếu',
				user: 'hieu',
				pass: '1'
			},
			{
				name: 'Trương Minh Danh',
				user: 'danh',
				pass: '1'
			},
		];

		const dataLocal = localStorage.getItem('data_user');
		if (!dataLocal) {
			localStorage.setItem('data_user', JSON.stringify(mockData));
		}

		// Lấy danh sách tên từ mockData hoặc localStorage
		const users = JSON.parse(localStorage.getItem('data_user') || '[]');
		setUserNames(users.map((user: any) => user.name)); // Lưu danh sách tên vào state

		getDataQuanLyCongViec();
	}, []);

	const columns: IColumn<QuanLyCongViec.Record>[] = [
		{
			title: 'ID công việc',
			dataIndex: 'id',
			key: 'id',
			width: 200,
		},
		{
			title: 'Tên công việc',
			dataIndex: 'work',
			key: 'work',
			width: 200,
		},
		{
			title: 'Người được giao',
			dataIndex: 'name',
			key: 'name',
			width: 200,
		},
		{
			title: 'Độ ưu tiên',
			dataIndex: 'uu_tien',
			key: 'uu_tien',
			width: 200,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			width: 200,
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
								const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
								const newData = dataLocal.filter((item: any) => item.id !== record.id);
								localStorage.setItem('data', JSON.stringify(newData));
								getDataQuanLyCongViec();
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
						const newId = data.length ? Math.max(...data.map((item: any) => item.id)) + 1 : 1;
						const newValues = {
							...values,
							id: isEdit ? row?.id : newId,
							ngay_bat_dau: values.ngay_bat_dau ? values.ngay_bat_dau.toDate() : null,
							ngay_ket_thuc: values.ngay_ket_thuc ? values.ngay_ket_thuc.toDate() : null,
						};

						const dataTemp: QuanLyCongViec.Record[] = isEdit
							? data.map((item: any) => (item.id === row?.id ? newValues : item))
							: [newValues, ...data];

						localStorage.setItem('data', JSON.stringify(dataTemp));
						setVisible(false);
						getDataQuanLyCongViec();
					}}
				>
					{ }
					<Form.Item
						initialValue={row?.work}
						label='Tên công việc'
						name='work'
						rules={[{ required: true, message: 'Please input your work' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.name}
						label='Người được giao'
						name='name'
						rules={[{ required: true, message: 'Please select a name' }]}
					>
						<Select placeholder="Chọn người được giao">
							{userNames.map((name) => (
								<Select.Option key={name} value={name}>
									{name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						initialValue={row?.uu_tien}
						label='Danh sách độ ưu tiên'
						name='uu_tien'
						rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
					>
						<Select
							mode="tags"
							placeholder="Nhập hoặc chọn độ ưu tiên"
							style={{ width: '100%' }}
						>
							<Select.Option value="Thấp">Thấp</Select.Option>
							<Select.Option value="Trung bình">Trung Bình</Select.Option>
							<Select.Option value="Cao">Cao</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						initialValue={row?.trang_thai}
						label='Danh sách trạng thái'
						name='trang_thai'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
					>
						<Select
							mode="tags"
							placeholder="Nhập hoặc chọn trạng thái"
							style={{ width: '100%' }}
						>
							<Select.Option value="Cần làm">Cần làm</Select.Option>
							<Select.Option value="Đang làm">Đang làm</Select.Option>
							<Select.Option value="Đã hoàn thành">Đã hoàn thành</Select.Option>
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

export default QuanLyCongViec;