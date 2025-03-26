// import type { IColumn } from '@/components/Table/typing';
// import { Button, Form, Input, Modal, Table } from 'antd';
// import { useEffect, useState } from 'react';
// import { useModel } from 'umi';

// const TodoList = () => {
//     const { data, getDataUser } = useModel('randomuser');
//     const [visible, setVisible] = useState<boolean>(false);
//     const [isEdit, setIsEdit] = useState<boolean>(false);
//     const [row, setRow] = useState<RandomUser.Record>();
//     useEffect(() => {
//         getDataUser();
//     }, []);

//     const columns: IColumn<RandomUser.Record>[] = [
//         {
//             title: 'Address',
//             dataIndex: 'address',
//             key: 'name',
//             width: 200,
//         },
//         {
//             title: 'Balance',
//             dataIndex: 'balance',
//             key: 'age',
//             width: 100,
//         },
//         {
//             title: 'Sửa/xóa',
//             width: 200,
//             align: 'center',
//             render: (record) => {
//                 return (
//                     <div>
//                         <Button
//                             onClick={() => {
//                                 setVisible(true);
//                                 setRow(record);
//                                 setIsEdit(true);
//                             }}
//                         >
//                             Sửa
//                         </Button>
//                         <Button
//                             style={{ marginLeft: 10 }}
//                             onClick={() => {
//                                 const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
//                                 const newData = dataLocal.filter((item: any) => item.address !== record.address);
//                                 localStorage.setItem('data', JSON.stringify(newData));
//                                 getDataUser();
//                             }}
//                             type='primary'
//                         >
//                             Xóa
//                         </Button>
//                     </div>
//                 );
//             },
//         },
//     ];

//     return (
//         <div>
//             <Button
//                 type='primary'
//                 onClick={() => {
//                     setVisible(true);
//                     setIsEdit(false);
//                 }}
//             >
//                 Add User
//             </Button>
//             <Table dataSource={data} columns={columns} />
//             <Modal
//                 destroyOnClose
//                 footer={false}
//                 title={isEdit ? 'Edit User' : 'Add User'}
//                 visible={visible}
//                 onOk={() => { }}
//                 onCancel={() => {
//                     setVisible(false);
//                 }}
//             >
//                 <Form
//                     onFinish={(values) => {
//                         const index = data.findIndex((item: any) => item.address === row?.address);
//                         const dataTemp: RandomUser.Record[] = [...data];
//                         dataTemp.splice(index, 1, values);
//                         const dataLocal = isEdit ? dataTemp : [values, ...data];
//                         localStorage.setItem('data', JSON.stringify(dataLocal));
//                         setVisible(false);
//                         getDataUser();
//                     }}
//                 >
//                     <Form.Item
//                         initialValue={row?.address}
//                         label='address'
//                         name='address'
//                         rules={[{ required: true, message: 'Please input your address!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <Form.Item
//                         initialValue={row?.balance}
//                         label='balance'
//                         name='balance'
//                         rules={[{ required: true, message: 'Please input your balance!' }]}
//                     >
//                         <Input />
//                     </Form.Item>
//                     <div className='form-footer'>
//                         <Button htmlType='submit' type='primary'>
//                             {isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
//                         </Button>
//                         <Button onClick={() => setVisible(false)}>Hủy</Button>
//                     </div>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default TodoList;
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Modal, Row, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { Option } = Select;

const TodoList = () => {
    const { data, getDataUser } = useModel('randomuser');
    const [visible, setVisible] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [currentTask, setCurrentTask] = useState<TodoList.Record | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        getDataUser();
    }, []);

    // Mở Modal với dữ liệu task
    const openModal = (task?: TodoList.Record) => {
        setIsEdit(!!task);
        setCurrentTask(task || null);
        setVisible(true);
        form.setFieldsValue(task || { title: '', description: '', color: '#000' });
    };

    // Xóa task khỏi localStorage
    const handleDelete = (address: string) => {
        const newData = data.filter((item: any) => item.address !== address);
        localStorage.setItem('data', JSON.stringify(newData));
        getDataUser();
    };

    // Xử lý khi submit form
    const handleFinish = (values: any) => {
        const newData = isEdit
            ? data.map((item: any) => (item.address === currentTask?.address ? values : item))
            : [values, ...data];

        localStorage.setItem('data', JSON.stringify(newData));
        getDataUser();
        setVisible(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1 style={{ textAlign: 'center' }}>Todo List</h1>
            <Button type='primary' onClick={() => openModal()}>Create Task</Button>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {data.map((task: TodoList.Record) => (
                    <Col key={task.address} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            title={task.title}
                            bordered={false}
                            style={{ borderTop: `4px solid ${task.color}` }}
                            actions={[
                                <EditOutlined key='edit' onClick={() => openModal(task)} />,
                                <DeleteOutlined key='delete' onClick={() => handleDelete(task.address)} />
                            ]}
                        >
                            <p>{task.description}</p>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title={isEdit ? 'Edit Task' : 'Create Task'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout='vertical' onFinish={handleFinish}>
                    <Form.Item name='title' label='Title' rules={[{ required: true, message: 'Please enter title' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name='description' label='Description'>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name='color' label='Color'>
                        <Select>
                            <Option value='#007bff'>Blue</Option>
                            <Option value='#ffc107'>Yellow</Option>
                            <Option value='#28a745'>Green</Option>
                            <Option value='#dc3545'>Red</Option>
                            <Option value='#6f42c1'>Purple</Option>
                        </Select>
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={() => setVisible(false)} style={{ marginRight: 10 }}>Cancel</Button>
                        <Button type='primary' htmlType='submit'>{isEdit ? 'Update' : 'Add'}</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default TodoList;
