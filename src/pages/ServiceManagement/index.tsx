import { Button, Form, Input, InputNumber, Modal, Table, TimePicker } from 'antd';
import type { IColumn } from '@/components/Table/typing';
import { useEffect, useState } from 'react';
import useModel from '@/models/servicemanagement';
import moment from 'moment';
import './ServiceManagement.less';

const ServiceManagement = () => {
	const { data, getDataServiceManagement } = useModel();
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<ServiceManagement.Record>();

	useEffect(() => {
		getDataServiceManagement();
	}, []);

	const columns: IColumn<ServiceManagement.Record>[] = [
		{
			title: 'Service ID',
			dataIndex: 'service_id',
			key: 'service_id',
			width: 200,
		},
		{
			title: 'Service name',
			dataIndex: 'service_name',
			key: 'service_name',
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
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
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
								const dataLocal: any = JSON.parse(localStorage.getItem('data_service') as any);
								const newData = dataLocal.filter((item: any) => item.service_id !== record.service_id);
								localStorage.setItem('data_service', JSON.stringify(newData));
								getDataServiceManagement();
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
		<div className="service-management-container">
			<div className="service-management-header">
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
			<Table className="service-management-table" dataSource={data} columns={columns} />
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
						const index = data.findIndex((item: any) => item.service_id === row?.service_id);
						const dataTemp: ServiceManagement.Record[] = [...data];
						const newValues = {
							...values,
							start_time: values.start_time.format('HH:mm'),
							end_time: values.end_time.format('HH:mm'),
						};
						dataTemp.splice(index, 1, newValues);
						const dataLocal = isEdit ? dataTemp : [newValues, ...data];
						localStorage.setItem('data_service', JSON.stringify(dataLocal));
						setVisible(false);
						getDataServiceManagement();
					}}
				>
					<Form.Item
						initialValue={row?.service_id}
						label='Service ID'
						name='service_id'
						rules={[{ required: true, message: 'Please input your service_id!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						initialValue={row?.service_name}
						label='Service name'
						name='service_name'
						rules={[{ required: true, message: 'Please input your service_name!' }]}
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
						initialValue={row?.price}
						label='Price'
						name='price'
						rules={[{ required: true, message: 'Please input your price!' }]}
					>
						<InputNumber min={1} />
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

export default ServiceManagement;