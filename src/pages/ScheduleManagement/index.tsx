import { Button, Form, Input, Modal, Table, Select, TimePicker } from 'antd';
import type { IColumn } from '@/components/Table/typing';
import { useEffect, useState } from 'react';
import useModel from '@/models/schedulemanagement';
import moment from 'moment';
import './ScheduleManagement.less'; // Import the LESS file

const { Option } = Select;

const ScheduleManagement = () => {
	const { data, getDataScheduleManagement } = useModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<ScheduleManagement.Record>();

	useEffect(() => {
		getDataScheduleManagement();
	}, []);

	const columns: IColumn<ScheduleManagement.Record>[] = [
		{
			title: 'Schedule ID',
			dataIndex: 'schedule_id',
			key: 'schedule_id',
			width: 200,
		},
		{
			title: 'Start time',
			dataIndex: 'start_time',
			key: 'start_time',
			width: 200,
		},
		{
			title: 'End time',
			dataIndex: 'end_time',
			key: 'end_time',
			width: 200,
		},
		{
			title: 'Day of week',
			dataIndex: 'day',
			key: 'day',
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
								const dataLocal: any = JSON.parse(localStorage.getItem('data_schedule') as any);
								const newData = dataLocal.filter((item: any) => item.schedule_id !== record.schedule_id);
								localStorage.setItem('data_schedule', JSON.stringify(newData));
								getDataScheduleManagement();
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
		<div className="schedule-management-container">
			<div className="schedule-management-header">
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
			<Table className="schedule-management-table" dataSource={data} columns={columns} />
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
						const index = data.findIndex((item: any) => item.schedule_id === row?.schedule_id);
						const dataTemp: ScheduleManagement.Record[] = [...data];
						const newValues = {
							...values,
							start_time: values.start_time.format('HH:mm'),
							end_time: values.end_time.format('HH:mm'),
						};
						dataTemp.splice(index, 1, newValues);
						const dataLocal = isEdit ? dataTemp : [newValues, ...data];
						localStorage.setItem('data_schedule', JSON.stringify(dataLocal));
						setVisible(false);
						getDataScheduleManagement();
					}}
				>
					<Form.Item
						initialValue={row?.schedule_id}
						label='Schedule ID'
						name='schedule_id'
						rules={[{ required: true, message: 'Please input your schedule_id!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.start_time ? moment(row.start_time, 'HH:mm') : null}
						label='Start time'
						name='start_time'
						rules={[{ required: true, message: 'Please input your start_time!' }]}
					>
						<TimePicker format='HH:mm' />
					</Form.Item>
					<Form.Item
						initialValue={row?.end_time ? moment(row.end_time, 'HH:mm') : null}
						label='End time'
						name='end_time'
						rules={[{ required: true, message: 'Please input your end_time!' }]}
					>
						<TimePicker format='HH:mm' />
					</Form.Item>
					<Form.Item
						initialValue={row?.day}
						label='Day of week'
						name='day'
						rules={[{ required: true, message: 'Please select your day!' }]}
					>
						<Select>
							<Option value='0'>Mon</Option>
							<Option value='1'>Tue</Option>
							<Option value='2'>Wed</Option>
							<Option value='3'>Thu</Option>
							<Option value='4'>Fri</Option>
							<Option value='5'>Sat</Option>
							<Option value='6'>Sun</Option>
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

export default ScheduleManagement;