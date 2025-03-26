import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, Modal, Table, Select } from 'antd';
const { Option } = Select;
import { useEffect, useState } from 'react';
import useModel from '@/models/quanlycauhoi';
import useMonHocModel from '@/models/quanlymonhoc';

const QuanLyCauHoi = () => {
	const { data, getDataQuanLyCauHoi } = useModel();
	const { data: monHocData, getDataMonHoc } = useMonHocModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyCauHoi.Record>();

	useEffect(() => {
		getDataQuanLyCauHoi();
		getDataMonHoc();
	}, []);

	const columns: IColumn<QuanLyCauHoi.Record>[] = [
		{
			title: 'Mã câu hỏi',
			dataIndex: 'ma_cau_hoi',
			key: 'ma_cau_hoi',
			width: 200,
		},
		{
			title: 'Tên môn',
			dataIndex: 'ten_mon',
			key: 'ten_mon',
			width: 200,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noi_dung',
			key: 'noi_dung',
			width: 200,
		},
		{
			title: 'Mức độ khó',
			dataIndex: 'muc_do',
			key: 'muc_do',
			width: 200,
		},
		{
			title: 'Khối kiến thức',
			dataIndex: 'khoi_kien_thuc',
			key: 'khoi_kien_thuc',
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
								const dataLocal: any = JSON.parse(localStorage.getItem('data_quan_ly_cau_hoi') as any);
								const newData = dataLocal.filter((item: any) => item.ma_cau_hoi !== record.ma_cau_hoi);
								localStorage.setItem('data_quan_ly_cau_hoi', JSON.stringify(newData));
								getDataQuanLyCauHoi();
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
				Thêm câu hỏi
			</Button>
			<Table dataSource={data} columns={columns} />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
				visible={visible}
				onOk={() => { }}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onFinish={(values) => {
						const index = data.findIndex((item: any) => item.ma_cau_hoi === row?.ma_cau_hoi);
						const dataTemp: QuanLyCauHoi.Record[] = [...data];
						const newValues = {
							...values,
						};
						dataTemp.splice(index, 1, newValues);
						const dataLocal = isEdit ? dataTemp : [newValues, ...data];
						localStorage.setItem('data_quan_ly_cau_hoi', JSON.stringify(dataLocal));
						setVisible(false);
						getDataQuanLyCauHoi();
					}}
				>
					<Form.Item
						initialValue={row?.ma_cau_hoi}
						label='Mã câu hỏi'
						name='ma_cau_hoi'
						rules={[{ required: true, message: 'Please input your ma_cau_hoi!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.ten_mon}
						label='Tên môn'
						name='ten_mon'
						rules={[{ required: true, message: 'Please select your ten_mon!' }]}
					>
						<Select>
							{monHocData.map((monHoc: { ma_mon: string; ten_mon: string }) => (
								<Option key={monHoc.ma_mon} value={monHoc.ten_mon}>
									{monHoc.ten_mon}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						initialValue={row?.noi_dung}
						label='Nội dung'
						name='noi_dung'
						rules={[{ required: true, message: 'Please input your noi_dung!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.muc_do}
						label='Mức độ khó'
						name='muc_do'
						rules={[{ required: true, message: 'Please select your muc_do!' }]}
					>
						<Select>
							<Option value='0'>Dễ</Option>
							<Option value='1'>Trung bình</Option>
							<Option value='2'>Khó</Option>
							<Option value='3'>Cực khó</Option>
						</Select>
					</Form.Item>
					<Form.Item
						initialValue={row?.khoi_kien_thuc}
						label='Khối kiến thức'
						name='khoi_kien_thuc'
						rules={[{ required: true, message: 'Please input your khoi_kien_thuc!' }]}
					>
						<Input />
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

export default QuanLyCauHoi;