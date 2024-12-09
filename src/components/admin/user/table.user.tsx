import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {App, Button, Popconfirm} from "antd";
import {useRef, useState} from "react";
import {CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined} from "@ant-design/icons";
import {deleteUserAPI, getUsersAPI} from "services/api";
import {dateRangeValidate} from "services/helper";
import UserDetail from "components/admin/user/detail.user";
import CreateUser from "components/admin/user/create.user";
import ImportUser from "components/admin/user/data/import.user";
import {CSVLink} from "react-csv";
import UpdateUser from "components/admin/user/update.user.tsx";

interface ISearch {
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [dataUser, setDataUser] = useState<IUserTable | null>(null);
    const [dataUpdateUser, setDataUpdateUser] = useState<IUserTable | null>(null);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);

    const {message, notification} = App.useApp();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    });

    const handleDeleteUser = async (_id: string) => {
        setIsDeleteUser(true)
        const res = await deleteUserAPI(_id);
        if (res && res.data) {
            message.success('Xóa user thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsDeleteUser(false)
    }

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            ellipsis: true,
            hideInSearch: true,
            render(_, entity) {
                return (
                    <a
                        onClick={() => {
                            setOpenDrawer(true);
                            setDataUser(entity);
                        }}
                        href='#'
                    >{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            // copyable: true,
            ellipsis: true,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            // copyable: true,
            ellipsis: true,
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <>
                        <EditTwoTone
                            onClick={() => {
                                setOpenModalUpdate(true)
                                setDataUpdateUser(entity);
                            }}
                            twoToneColor="#f57800"
                            style={{cursor: "pointer", marginRight: 15}}
                        />
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => handleDeleteUser(entity._id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{
                                loading: isDeleteUser,
                            }}
                        >
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{cursor: "pointer"}}
                            />
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IUserTable, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        if (params.phone) {
                            query += `&phone=/${params.phone}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                        const updateDateRange = dateRangeValidate(params.updatedAtRange);
                        if (updateDateRange) {
                            query += `&createdAt>=${updateDateRange[0]}&createdAt<=${updateDateRange[1]}`
                        }
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                    } else {
                        query += `&sort=-createdAt`;
                    }
                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === 'ascend' ? 'updatedAt' : '-updatedAt'}`
                    }
                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }
                }}
                rowKey="_id"
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50'],
                    total: meta.total,
                    showTotal: (total, range) => {
                        return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                    }
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename={"data-user.csv"}
                    >
                        <Button
                            key="button"
                            icon={<ExportOutlined/>}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>,
                    <Button
                        key="button"
                        icon={<CloudUploadOutlined/>}
                        onClick={() => {
                            setOpenModalImport(true);
                        }}
                        type="primary"
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <ImportUser
                openModalImport={openModalImport}
                setOpenModalImport={setOpenModalImport}
                refreshTable={refreshTable}
            />
            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                dataUpdateUser={dataUpdateUser}
                setDataUpdateUser={setDataUpdateUser}
                refreshTable={refreshTable}
            />
            <UserDetail
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                dataUser={dataUser}
                setDataUser={setDataUser}
            />
        </>
    );
};

export default TableUser;