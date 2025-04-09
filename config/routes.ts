export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	// {
	// 	path: '/random-user',
	// 	name: 'RandomUser',
	// 	component: './RandomUser',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/todo-list',
	// 	name: 'Todo List',
	// 	component: './TodoList',
	// 	icon: 'UnorderedListOutlined',
	// },
	// {
	// 	path: '/quan-ly-mon-hoc',
	// 	name: 'Quản lý môn học',
	// 	component: './QuanLyMonHoc',
	// 	icon: 'BookOutlined',
	// },
	// {
	// 	path: '/quan-ly-cau-hoi',
	// 	name: 'Quản lý câu hỏi',
	// 	component: './QuanLyCauHoi',
	// 	icon: 'QuestionOutlined',
	// },
	// {
	// 	path: '/quan-ly-de-thi',
	// 	name: 'Quản lý đề thi',
	// 	component: './QuanLyDeThi',
	// 	icon: 'FileTextOutlined',
	// },
	// {
	// 	path: '/staff-management',
	// 	name: 'Staff Management',
	// 	component: './StaffManagement',
	// 	icon: 'UserOutlined',
	// },
	// {
	// 	path: '/service-management',
	// 	name: 'Service Management',
	// 	component: './ServiceManagement',
	// 	icon: 'ToolOutlined',
	// },
	// {
	// 	path: '/schedule-management',
	// 	name: 'Schedule Management',
	// 	component: './ScheduleManagement',
	// 	icon: 'CalendarOutlined',
	// },
	// {
	// 	path: '/quanlynhanvien',
	// 	name: 'Quản lý nhân viên',
	// 	component: './QuanLyNhanVien',
	// 	icon: 'UserOutlined',
	// },
	{
		path: '/quanlyungvien',
		name: 'Quản lý ứng viên',
		component: './QuanLyUngVien',
		icon: 'UserAddOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
