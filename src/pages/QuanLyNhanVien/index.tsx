import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, InputNumber, Modal, Table, Select, Row, Col, Space } from 'antd';
const { Option } = Select;
import { useEffect, useState } from 'react';
import useModel from '@/models/quanlynhanvien';
import './QuanLyNhanVien.css';

const QuanLyNhanVien = () => {
	const { data, getDataQuanLyNhanVien } = useModel() as {
		data: QuanLyNhanVien.Record[]; getDataQuanLyNhanVien: () => void
	};
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyNhanVien.Record>();
	const [searchText, setSearchText] = useState<string>('');

	useEffect(() => {
		getDataQuanLyNhanVien();
	}, []);

	const handleSearch = (value: string) => {
		setSearchText(value.toLowerCase());
	};

	const filteredData = data.filter(
		(item) =>
			item.ma.toLowerCase().includes(searchText) ||
			item.ten.toLowerCase().includes(searchText)
	);

	const columns: IColumn<QuanLyNhanVien.Record>[] = [
		{
			title: 'Mã nhân viên',
			dataIndex: 'ma',
			key: 'ma',
			width: 200,
			align: 'center',
		},
		{
			title: 'Tên nhân viên',
			dataIndex: 'ten',
			key: 'ten',
			width: 200,
			align: 'center',
		},
		{
			title: 'Chức vụ',
			dataIndex: 'chuc_vu',
			key: 'chuc_vu',
			width: 200,
			align: 'center',
			filters: [
				{ text: 'Nhân viên', value: 'Nhân viên' },
				{ text: 'Quản lý', value: 'Quản lý' },
				{ text: 'Phó phòng', value: 'Phó phòng' },
				{ text: 'Trưởng phòng', value: 'Trưởng phòng' },
			],
			onFilter: (value, record) => record.chuc_vu === value,
		},
		{
			title: 'Phòng ban',
			dataIndex: 'phong_ban',
			key: 'phong_ban',
			width: 200,
			align: 'center',
			filters: [
				{ text: 'Phòng kế hoạch và đầu tư', value: 'Phòng kế hoạch và đầu tư' },
				{ text: 'Phòng kế toán', value: 'Phòng kế toán' },
				{ text: 'Phòng nghiên cứu và phát triển', value: 'Phòng nghiên cứu và phát triển' },
				{ text: 'Phòng quản lý', value: 'Phòng quản lý' },
			],
			onFilter: (value, record) => record.phong_ban === value,
		},
		{
			title: 'Lương',
			dataIndex: 'luong',
			key: 'luong',
			width: 200,
			align: 'center',
			sorter: (a, b) => b.luong - a.luong,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trang_thai',
			key: 'trang_thai',
			width: 200,
			align: 'center',
			render: (value) => (value === 'Thử việc' ? 'Thử việc' : 'Đã ký hợp đồng'),
		},
		{
			title: 'Sửa/xóa',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<Space>
						<Button
							className="edit-btn"
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Sửa
						</Button>
						<Button
							className="delete-btn"
							onClick={() => {
								if (record.trang_thai !== 'Thử việc') {
									Modal.warning({
										title: 'Không thể xóa',
										content: 'Không thể xóa nhân viên đã ký hợp đồng!',
									});
									return;
								}

								Modal.confirm({
									title: 'Xác nhận xóa',
									content: 'Bạn có chắc chắn muốn xóa nhân viên này không?',
									okText: 'Xóa',
									cancelText: 'Hủy',
									onOk: () => {
										const dataLocal: any = JSON.parse(localStorage.getItem('data_quan_ly_nhan_vien') as any);
										const newData = dataLocal.filter((item: any) => item.ma !== record.ma);
										localStorage.setItem('data_quan_ly_nhan_vien', JSON.stringify(newData));
										getDataQuanLyNhanVien();
									},
								});
							}}
						>
							Xóa
						</Button>
					</Space>
				);
			},
		},
	];

	return (
		<div>
			<Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
				<Col>
					<Input.Search
						placeholder="Tìm kiếm theo mã hoặc tên nhân viên"
						allowClear
						onSearch={handleSearch}
						style={{ width: 300 }}
					/>
				</Col>
				<Col>
					<Button
						className="add-employee-btn"
						onClick={() => {
							setVisible(true);
							setIsEdit(false);
						}}
					>
						Thêm nhân viên
					</Button>
				</Col>
			</Row>
			<Table
				dataSource={filteredData}
				columns={columns}
				pagination={{ pageSize: 5 }}
				scroll={{ x: 1000 }}
				bordered
				size="middle"
			/>
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa nhân viên' : 'Thêm nhân viên'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onFinish={(values) => {
						const newMa = data.length > 0 ? Math.max(...data.map((item: any) => parseInt(item.ma, 10))) + 1 : 1; // Tự động tăng mã
						const newValues = {
							...values,
							ma: isEdit ? row?.ma : newMa.toString(),
						};

						const index = data.findIndex((item: any) => item.ma === row?.ma);
						const dataTemp: QuanLyNhanVien.Record[] = [...data];
						if (isEdit) {
							dataTemp.splice(index, 1, newValues);
						} else {
							dataTemp.unshift(newValues);
						}

						localStorage.setItem('data_quan_ly_nhan_vien', JSON.stringify(dataTemp));
						setVisible(false);
						getDataQuanLyNhanVien();
					}}
				>
					<Form.Item
						initialValue={row?.ten}
						label='Tên nhân viên'
						name='ten'
						rules={[
							{ required: true, message: 'Please select your ten!' },
							{ max: 50, message: 'Tên nhân viên không được vượt quá 50 ký tự!' },
							{
								pattern: /^[0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸỳỵỷỹ\s]+$/u,
								message: 'Tên nhân viên không được chứa ký tự đặc biệt!',
							},
						]}
					>
						<Input maxLength={50} />
					</Form.Item>
					<Form.Item
						initialValue={row?.chuc_vu}
						label='Chức vụ'
						name='chuc_vu'
						rules={[{ required: true, message: 'Please input your chuc_vu!' }]}
					>
						<Select>
							<Option value='Nhân viên'>Nhân viên</Option>
							<Option value='Quản lý'>Quản lý</Option>
							<Option value='Phó phòng'>Phó phòng</Option>
							<Option value='Trưởng phòng'>Trưởng phòng</Option>
						</Select>
					</Form.Item>
					<Form.Item
						initialValue={row?.phong_ban}
						label='Phòng ban'
						name='phong_ban'
						rules={[{ required: true, message: 'Please select your phong_ban!' }]}
					>
						<Select>
							<Option value='Phòng kế hoạch và đầu tư'>Phòng kế hoạch và đầu tư</Option>
							<Option value='Phòng kế toán'>Phòng kế toán</Option>
							<Option value='Phòng nghiên cứu và phát triển'>Phòng nghiên cứu và phát triển</Option>
							<Option value='Phòng quản lý'>Phòng quản lý</Option>
						</Select>
					</Form.Item>
					<Form.Item
						initialValue={row?.luong}
						label='Lương'
						name='luong'
						rules={[{ required: true, message: 'Please input your luong!' }]}
					>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item
						initialValue={row?.trang_thai}
						label='Trạng thái'
						name='trang_thai'
						rules={[{ required: true, message: 'Please select your trang_thai!' }]}
					>
						<Select>
							<Option value='Đã ký hợp đồng'>Đã ký hợp đồng</Option>
							<Option value='Thử việc'>Thử việc</Option>
						</Select>
					</Form.Item>

					<div style={{ textAlign: 'right' }}>
						<Button htmlType="submit" type="primary" style={{ marginRight: 8 }}>
							{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisible(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyNhanVien;