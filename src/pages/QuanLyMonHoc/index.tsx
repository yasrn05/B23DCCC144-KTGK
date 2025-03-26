import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, InputNumber, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
// import { useModel } from 'umi';
import useModel from '@/models/quanlymonhoc';

const QuanLyMonHoc = () => {
	const { data, getDataMonHoc } = useModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<QuanLyMonHoc.Record>();
	useEffect(() => {
		getDataMonHoc();
	}, []);

	const columns: IColumn<QuanLyMonHoc.Record>[] = [
		{
			title: 'Mã môn',
			dataIndex: 'ma_mon',
			key: 'ma_mon',
			width: 200,
		},
		{
			title: 'Tên môn',
			dataIndex: 'ten_mon',
			key: 'ten_mon',
			width: 200,
		},
		{
			title: 'Tin chỉ',
			dataIndex: 'so_tin_chi',
			key: 'so_tin_chi',
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
								const dataLocal: any = JSON.parse(localStorage.getItem('data_mon_hoc') as any);
								const newData = dataLocal.filter((item: any) => item.ten_mon !== record.ten_mon);
								localStorage.setItem('data_mon_hoc', JSON.stringify(newData));
								getDataMonHoc();
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
				Thêm môn học
			</Button>
			<Table dataSource={data} columns={columns} />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Sửa môn học' : 'Thêm môn học'}
				visible={visible}
				onOk={() => { }}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onFinish={(values) => {
						const index = data.findIndex((item: any) => item.ten_mon === row?.ten_mon);
						const dataTemp: QuanLyMonHoc.Record[] = [...data];
						const newValues = {
							...values,
							ngay_bat_dau: values.ngay_bat_dau ? values.ngay_bat_dau.toDate() : null,
							ngay_ket_thuc: values.ngay_ket_thuc ? values.ngay_ket_thuc.toDate() : null,
						};
						dataTemp.splice(index, 1, newValues);
						const dataLocal = isEdit ? dataTemp : [newValues, ...data];
						localStorage.setItem('data_mon_hoc', JSON.stringify(dataLocal));
						setVisible(false);
						getDataMonHoc();
					}}
				>
					<Form.Item
						initialValue={row?.ma_mon}
						label='Mã môn'
						name='ma_mon'
						rules={[{ required: true, message: 'Please input your ma_mon!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.ten_mon}
						label='Tên môn'
						name='ten_mon'
						rules={[{ required: true, message: 'Please input your ten_mon!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.so_tin_chi}
						label='Số tín chỉ'
						name='so_tin_chi'
						rules={[{ required: true, message: 'Please input your so_tin_chi!' }]}
					>
						<InputNumber min={1} />
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

export default QuanLyMonHoc;