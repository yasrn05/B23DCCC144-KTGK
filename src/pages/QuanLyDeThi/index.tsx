import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, InputNumber, Modal, Table, Select } from 'antd';
const { Option } = Select;
import { useEffect, useState } from 'react';
import useModel from '@/models/quanlydethi';
import useCauHoiModel from '@/models/quanlycauhoi';

const QuanLyDeThi = () => {
	const { data, getDataQuanLyDeThi } = useModel();
	const { data: cauHoiData, getDataQuanLyCauHoi } = useCauHoiModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyDeThi.Record>();
	const [filteredCauHoi, setFilteredCauHoi] = useState([]);

	useEffect(() => {
		getDataQuanLyDeThi();
		getDataQuanLyCauHoi();
	}, []);

	const handleFilterChange = (values: { muc_do: any; khoi_kien_thuc: any; }) => {
		const { muc_do, khoi_kien_thuc } = values;
		const filtered = cauHoiData.filter(
			(cauHoi: any) =>
				(!muc_do || cauHoi.muc_do === muc_do) &&
				(!khoi_kien_thuc || cauHoi.khoi_kien_thuc === khoi_kien_thuc)
		);
		setFilteredCauHoi(filtered);
	};

	const columns: IColumn<QuanLyDeThi.Record>[] = [
		{
			title: 'Mã đề thi',
			dataIndex: 'ma_de_thi',
			key: 'ma_de_thi',
			width: 200,
		},
		{
			title: 'Số câu hỏi',
			dataIndex: 'so_cau',
			key: 'so_cau',
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
								const dataLocal: any = JSON.parse(localStorage.getItem('data_quan_ly_de_thi') as any);
								const newData = dataLocal.filter((item: any) => item.ma_de_thi !== record.ma_de_thi);
								localStorage.setItem('data_quan_ly_de_thi', JSON.stringify(newData));
								getDataQuanLyDeThi();
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
				Thêm đề thi
			</Button>
			<Table dataSource={data} columns={columns} />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa đề thi' : 'Thêm đề thi'}
				visible={visible}
				onOk={() => { }}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onValuesChange={handleFilterChange}
					onFinish={(values) => {
						const index = data.findIndex((item: any) => item.ma_de_thi === row?.ma_de_thi);
						const dataTemp: QuanLyDeThi.Record[] = [...data];
						const newValues = {
							...values,
						};
						dataTemp.splice(index, 1, newValues);
						const dataLocal = isEdit ? dataTemp : [newValues, ...data];
						localStorage.setItem('data_quan_ly_de_thi', JSON.stringify(dataLocal));
						setVisible(false);
						getDataQuanLyDeThi();
					}}
				>
					<Form.Item
						initialValue={row?.ma_de_thi}
						label='Mã đề thi'
						name='ma_de_thi'
						rules={[{ required: true, message: 'Please input your ma_de_thi!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.so_cau}
						label='Số câu hỏi'
						name='so_cau'
						rules={[{ required: true, message: 'Please input your so_cau!' }]}
					>
						<InputNumber min={1} />
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
						<Select>
							{cauHoiData.map((cauHoi: { ma_cau_hoi: string; khoi_kien_thuc: string }) => (
								<Option key={cauHoi.ma_cau_hoi} value={cauHoi.khoi_kien_thuc}>
									{cauHoi.khoi_kien_thuc}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Câu hỏi'
						name='cau_hoi'
						rules={[{ required: true, message: 'Please select your cau_hoi!' }]}
					>
						<Select mode='multiple'>
							{filteredCauHoi.map((cauHoi: { ma_cau_hoi: string; noi_dung: string }) => (
								<Option key={cauHoi.ma_cau_hoi} value={cauHoi.ma_cau_hoi}>
									{cauHoi.noi_dung}
								</Option>
							))}
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

export default QuanLyDeThi;