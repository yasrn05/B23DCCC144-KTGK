import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, Modal, Table, Select } from 'antd';
const { Option } = Select;
import { useEffect, useState } from 'react';
import useModel from '@/models/quanlyungvien';

const QuanLyUngVien = () => {
	const { data, getDataUngVien } = useModel() as { data: QuanLyUngVien.Record[]; getDataUngVien: () => void };
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyUngVien.Record | null>(null);
	const [searchText, setSearchText] = useState<string>('');
	const [filteredData, setFilteredData] = useState<QuanLyUngVien.Record[]>([]);
	const [actionModalVisible, setActionModalVisible] = useState<boolean>(false);
	const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
	const [selectedRow, setSelectedRow] = useState<QuanLyUngVien.Record | null>(null);
	const [reason, setReason] = useState<string>('');
	const [form] = Form.useForm();

	useEffect(() => {
		getDataUngVien();
	}, []);

	useEffect(() => {
		const filtered = data.filter((item: QuanLyUngVien.Record) =>
			item.ho_ten.toLowerCase().includes(searchText.toLowerCase()) ||
			item.email.toLowerCase().includes(searchText.toLowerCase()) ||
			item.nguyen_vong.toLowerCase().includes(searchText.toLowerCase())
		);
		setFilteredData(filtered);
	}, [searchText, data]);

	const handleAction = () => {
		if (selectedRow) {
			const updatedData = data.map((item) =>
				item.email === selectedRow?.email
					? {
						...(item as QuanLyUngVien.Record),
						trang_thai: actionType === 'approve' ? 'approved' : 'rejected',
						ly_do: actionType === 'reject' ? reason : item.ly_do,
					}
					: item
			);
			localStorage.setItem('data_ung_vien', JSON.stringify(updatedData));

			// Ghi log thao tác
			const logMessage = `Admin đã ${actionType === 'approve' ? 'Duyệt' : 'Từ chối'
				} ứng viên ${selectedRow.ho_ten} vào lúc ${new Date().toLocaleTimeString()} ngày ${new Date().toLocaleDateString()} ${actionType === 'reject' ? `với lý do: ${reason}` : ''
				}.`;
			console.log(logMessage);

			getDataUngVien();
			setActionModalVisible(false);
			setReason('');
		}
	};

	const handleFormSubmit = (values: any) => {
		const newData = [...data];
		if (isEdit && row) {
			const index = newData.findIndex((item) => item.email === row.email);
			if (index > -1) {
				newData[index] = { ...row, ...values };
			}
		} else {
			newData.unshift({ ...values, trang_thai: 'pending' });
		}
		localStorage.setItem('data_ung_vien', JSON.stringify(newData));
		getDataUngVien();
		setVisible(false);
		form.resetFields();
	};

	const columns: IColumn<QuanLyUngVien.Record>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'ho_ten',
			key: 'ho_ten',
			width: 200,
			sorter: (a, b) => a.ho_ten.localeCompare(b.ho_ten),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: 200,
			sorter: (a, b) => a.email.localeCompare(b.email),
		},
		{
			title: 'Nguyện vọng',
			dataIndex: 'nguyen_vong',
			key: 'nguyen_vong',
			width: 200,
			sorter: (a, b) => a.nguyen_vong.localeCompare(b.nguyen_vong),
		},
		{
			title: 'Lý do',
			dataIndex: 'ly_do',
			key: 'ly_do',
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
			width: 300,
			align: 'center',
			render: (record) => (
				<div>
					<Button
						onClick={() => {
							setVisible(true);
							setRow(record);
							setIsEdit(true);
							form.setFieldsValue(record);
						}}
					>
						Sửa
					</Button>
					<Button
						style={{ marginLeft: 10 }}
						onClick={() => {
							const dataLocal: any = JSON.parse(localStorage.getItem('data_ung_vien') as any);
							const newData = dataLocal.filter((item: any) => item.email !== record.email);
							localStorage.setItem('data_ung_vien', JSON.stringify(newData));
							getDataUngVien();
						}}
						type='primary'
					>
						Xóa
					</Button>
					<Button
						style={{ marginLeft: 10 }}
						onClick={() => {
							setSelectedRow(record);
							setActionType('approve');
							setActionModalVisible(true);
						}}
						type='primary'
					>
						Duyệt
					</Button>
					<Button
						style={{ marginLeft: 10 }}
						onClick={() => {
							setSelectedRow(record);
							setActionType('reject');
							setActionModalVisible(true);
						}}
						danger
					>
						Từ chối
					</Button>
				</div>
			),
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16 }}>
				<Input
					placeholder="Tìm kiếm theo tên, email hoặc nguyện vọng"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>
			</div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
					form.resetFields();
				}}
			>
				Thêm
			</Button>
			<Table
				dataSource={filteredData.map((item, index) => ({ ...item, key: index }))}
				columns={columns}
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '20', '50'],
					showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
				}}
			/>
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa' : 'Thêm'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
					form.resetFields();
				}}
			>
				<Form form={form} onFinish={handleFormSubmit}>
					<Form.Item
						label='Họ tên'
						name='ho_ten'
						rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Email'
						name='email'
						rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Nguyện vọng'
						name='nguyen_vong'
						rules={[{ required: true, message: 'Vui lòng nhập nguyện vọng!' }]}
					>
						<Select>
							<Option value='design'>Design</Option>
							<Option value='dev'>Developer</Option>
							<Option value='media'>Media</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label='Lý do'
						name='ly_do'
						rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
					>
						<Input />
					</Form.Item>
					{isEdit && (
						<Form.Item
							label='Trạng thái'
							name='trang_thai'
							rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
						>
							<Select>
								<Option value='pending'>Pending</Option>
								<Option value='approved'>Approved</Option>
								<Option value='rejected'>Rejected</Option>
							</Select>
						</Form.Item>
					)}
					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisible(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
			<Modal
				title={actionType === 'approve' ? 'Xác nhận Duyệt' : 'Xác nhận Từ chối'}
				visible={actionModalVisible}
				onOk={handleAction}
				onCancel={() => {
					setActionModalVisible(false);
					setReason('');
				}}
				okText={actionType === 'approve' ? 'Duyệt' : 'Từ chối'}
				cancelText="Hủy"
			>
				<p>
					Bạn có chắc chắn muốn {actionType === 'approve' ? 'duyệt' : 'từ chối'} ứng viên{' '}
					<strong>{selectedRow?.ho_ten}</strong> không?
				</p>
				{actionType === 'reject' && (
					<Input.TextArea
						placeholder="Nhập lý do từ chối"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						rows={4}
					/>
				)}
			</Modal>
		</div>
	);
};

export default QuanLyUngVien;