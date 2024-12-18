import {useRef, useState} from "react";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {dateRangeValidate} from "services/helper.ts";
import {getOrdersAPI} from "services/api.ts";

interface ISearch {
    name: string;
    createdAt: string;
    createdAtRange: string;
}

const TableOrder = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 0,
        total: 0,
    });

    const columns: ProColumns<IOrderTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render(_dom, entity) {
                return (
                    <a href='#'>{entity._id}</a>
                )
            },
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'totalPrice',
            hideInSearch: true,
            sorter: true,
            render(_dom, entity) {
                return (
                    <>
                        {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(entity.totalPrice)}
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
    ];

    return (
        <ProTable<IOrderTable, ISearch>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort) => {
                let query = "";
                if (params) {
                    query += `current=${params.current}&pageSize=${params.pageSize}`
                    if (params.name) {
                        query += `&name=/${params.name}/i`
                    }
                    const createDateRange = dateRangeValidate(params.createdAtRange);
                    if (createDateRange) {
                        query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                    }
                }
                //default
                if (sort && sort.createdAt) {
                    query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                } else query += `&sort=-createdAt`;
                const res = await getOrdersAPI(query);
                if (res.data) {
                    setMeta(res.data.meta);
                }
                return {
                    data: res.data?.result,
                    page: 1,
                    success: true,
                    total: res.data?.meta.total
                }
            }}
            rowKey="_id"
            pagination={{
                current: meta.current,
                pageSize: meta.pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                total: meta.total,
                showTotal: (total, range) => {
                    return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                }
            }
            }
            headerTitle="Table Orders"
        />
    )
}
export default TableOrder;