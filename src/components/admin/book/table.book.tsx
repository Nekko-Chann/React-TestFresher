import {useRef, useState} from "react";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined} from "@ant-design/icons";
import {App, Button, Popconfirm} from "antd";
import {dateRangeValidate} from "services/helper";
import {deleteBookAPI, getBooksAPI} from "services/api";
import {CSVLink} from "react-csv";
import CreateBook from "components/admin/book/create.book";
import BookDetail from "components/admin/book/detail.book";
import UpdateBook from "components/admin/book/update.book";

interface ISearch {
    mainText: string;
    category: string;
    author: string;
    quantity: number;
    price: number;
    createdAt: string;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [dataBook, setDataBook] = useState<IBookTable | null>(null);
    const [dataUpdateBook, setDataUpdateBook] = useState<IBookTable | null>(null);
    const [deleteBook, setDeleteBook] = useState<boolean>(false);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

    const {message, notification} = App.useApp();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    });

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const handleDeleteBook = async (_id: string) => {
        setDeleteBook(true);
        const res = await deleteBookAPI(_id);
        if (res && res.data) {
            message.success('Xóa book thành công');
            refreshTable();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
    }

    const columns: ProColumns<IBookTable>[] = [
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
                            setDataBook(entity);
                        }}
                        href='#'
                    >{entity._id}</a>
                )
            },
        },
        {
            title: 'Tên Sách',
            dataIndex: 'mainText',
            copyable: true,
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Tác Giả',
            dataIndex: 'author',
            copyable: true,
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Thể Loại',
            dataIndex: 'category',
            ellipsis: true,
            sorter: true,
        },
        {
            title: 'Số Lượng',
            dataIndex: 'quantity',
            ellipsis: true,
            hideInSearch: true,
            sorter: true,
        },
        {
            title: 'Giá Tiền',
            dataIndex: 'price',
            ellipsis: true,
            hideInSearch: true,
            sorter: true,
            render(_, entity) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(entity.price)}
                    </>
                )
            }
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
                                setDataUpdateBook(entity);
                            }}
                            twoToneColor="#f57800"
                            style={{cursor: "pointer", marginRight: 15}}
                        />
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{
                                loading: deleteBook,
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

    return (
        <>
            <ProTable<IBookTable, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.mainText) {
                            query += `&mainText=/${params.mainText}/i`
                        }
                        if (params.category) {
                            query += `&category=/${params.category}/i`
                        }
                        if (params.author) {
                            query += `&author=/${params.author}/i`
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
                    if (sort && sort.mainText) {
                        query += `&sort=${sort.mainText === 'ascend' ? 'mainText' : '-mainText'}`;
                    }
                    if (sort && sort.category) {
                        query += `&sort=${sort.category === 'ascend' ? 'category' : '-category'}`;
                    }
                    if (sort && sort.author) {
                        query += `&sort=${sort.author === 'ascend' ? 'author' : '-author'}`;
                    }
                    if (sort && sort.quantity) {
                        query += `&sort=${sort.quantity === 'ascend' ? 'quantity' : '-quantity'}`;
                    }
                    if (sort && sort.number) {
                        query += `&sort=${sort.number === 'ascend' ? 'number' : '-number'}`;
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === 'ascend' ? 'createdAt' : '-createdAt'}`;
                    } else {
                        query += `&sort=-createdAt`;
                    }
                    if (sort && sort.updatedAt) {
                        query += `&sort=${sort.updatedAt === 'ascend' ? 'updatedAt' : '-updatedAt'}`
                    }
                    const res = await getBooksAPI(query);
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
                headerTitle="Table book"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename={"data-book.csv"}
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
            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <UpdateBook
                dataUpdateBook={dataUpdateBook}
                setDataUpdateBook={setDataUpdateBook}
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
            />
            <BookDetail
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
                dataBook={dataBook}
                setDataBook={setDataBook}
            />
        </>
    )
}
export default TableBook;