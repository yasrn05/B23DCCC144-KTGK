import { Button, Form, Input, InputNumber, Modal, Table, Select } from 'antd';
const { Option } = Select;
import type { IColumn } from '@/components/Table/typing';
import { useEffect, useState } from 'react';
import useModel from '@/models/staffmanagement';
import useScheduleModel from '@/models/schedulemanagement';
import './StaffManagement.less'; // Import the LESS file

const StaffManagement = () => {
	const { data, getDataStaffManagement } = useModel();
	const { data: scheduleData, getDataScheduleManagement } = useScheduleModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<StaffManagement.Record>();

	useEffect(() => {
		getDataStaffManagement();
		getDataScheduleManagement();
	}, []);

	const columns: IColumn<StaffManagement.Record>[] = [
		{
			title: 'Staff ID',
			dataIndex: 'staff_id',
			key: 'staff_id',
			width: 200,
		},
		{
			title: 'Staff name',
			dataIndex: 'staff_name',
			key: 'staff_name',
			width: 200,
		},
		{
			title: 'Limit customer',
			dataIndex: 'limit_customer',
			key: 'limit_customer',
			width: 200,
		},
		{
			title: 'Current customer',
			dataIndex: 'current_customer',
			key: 'current_customer',
			width: 200,
		},
		{
			title: 'Edit/Delete',
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
							Edit
						</Button>
						<Button
							style={{ marginLeft: 10 }}
							onClick={() => {
								const dataLocal: any = JSON.parse(localStorage.getItem('data_staff') as any);
								const newData = dataLocal.filter((item: any) => item.staff_id !== record.staff_id);
								localStorage.setItem('data_staff', JSON.stringify(newData));
								getDataStaffManagement();
							}}
							type='primary'
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div className="staff-management-container">
			<div className="staff-management-header">
				<Button
					type='primary'
					onClick={() => {
						setVisible(true);
						setIsEdit(false);
					}}
				>
					Add new
				</Button>
			</div>
			<Table className="staff-management-table" dataSource={data} columns={columns} />
			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Edit' : 'New'}
				visible={visible}
				onOk={() => { }}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form
					onFinish={(values) => {
						const index = data.findIndex((item: any) => item.staff_id === row?.staff_id);
						const dataTemp: StaffManagement.Record[] = [...data];
						const newValues = {
							...values,
							schedule: values.schedule, // Handle multiple schedule IDs
						};
						if (isEdit) {
							dataTemp.splice(index, 1, newValues);
						} else {
							dataTemp.push(newValues);
						}
						localStorage.setItem('data_staff', JSON.stringify(dataTemp));
						setVisible(false);
						getDataStaffManagement();
					}}
				>
					<Form.Item
						initialValue={row?.staff_id}
						label='Staff ID'
						name='staff_id'
						rules={[{ required: true, message: 'Please input your staff_id!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.staff_name}
						label='Staff name'
						name='staff_name'
						rules={[{ required: true, message: 'Please input your staff_name!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.limit_customer}
						label='Limit customer'
						name='limit_customer'
						rules={[{ required: true, message: 'Please input your limit_customer!' }]}
					>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item
						initialValue={row?.current_customer}
						label='Current customer'
						name='current_customer'
						rules={[{ required: true, message: 'Please input your current_customer!' }]}
					>
						<InputNumber min={1} />
					</Form.Item>
					<Form.Item
						initialValue={row?.schedule}
						label='Schedule'
						name='schedule'
						rules={[{ required: true, message: 'Please select your schedule!' }]}
					>
						<Select mode='multiple'>
							{scheduleData.map((schedule: { schedule_id: string }) => (
								<Option key={schedule.schedule_id} value={schedule.schedule_id}>
									{schedule.schedule_id}
								</Option>
							))}
						</Select>
					</Form.Item>

					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							{isEdit ? 'Edit' : 'New'}
						</Button>
						<Button onClick={() => setVisible(false)}>Cancel</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default StaffManagement;