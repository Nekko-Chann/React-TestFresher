import {App, Button, Col, Divider, Form, FormProps, Input, Radio, Row, Space} from "antd";
import {useCurrentApp} from "components/context/app.context";
import {useEffect, useState} from "react";
import {DeleteTwoTone} from "@ant-design/icons";
import 'styles/order.scss';
import {createOrderAPI} from "services/api";

const {TextArea} = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
    fullName: string;
    phone: number;
    address: string;
    method: UserMethod;
}

interface IProps {
    setCurrentStep: (value: number) => void;
}

const Payment = (props: IProps) => {
    const {setCurrentStep} = props;
    const {carts, setCarts, user} = useCurrentApp();
    const {message, notification} = App.useApp();

    const [totalPrice, setTotalPrice] = useState(0);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD"
            })
        }
    }, [user]);

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            //update
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter(item => item._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    }

    const handlePlaceOrder: FormProps<FieldType>['onFinish'] = async (values) => {
        const {address, fullName, phone, method} = values;
        const detail = carts.map(item => ({
            _id: item._id,
            quantity: item.quantity,
            bookName: item.detail.mainText
        }));
        setIsSubmit(true);
        const res = await createOrderAPI(fullName, address, phone, totalPrice, method, detail);
        if (res?.data) {
            localStorage.removeItem("carts");
            setCarts([]);
            message.success("Mua hàng thành công!");
            setCurrentStep(2);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5,
            });
        }
        setIsSubmit(false);
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className="order-book" key={`index-${index}`}>
                            <div className="book-content">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`}
                                    alt={book?.detail?.thumbnail}/>
                                <div className="title">
                                    {book?.detail?.mainText}
                                </div>
                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(currentBookPrice)}
                                </div>
                            </div>
                            <div className="action">
                                <div className="quantity">
                                    Số lượng: {book?.quantity}
                                </div>
                                <div className="sum">
                                    Tổng: {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(currentBookPrice * (book.quantity ?? 0))}
                                </div>
                                <DeleteTwoTone
                                    style={{cursor: "pointer"}}
                                    onClick={() => handleRemoveBook(book._id)}
                                    twoToneColor="#eb2f96"
                                />
                            </div>
                        </div>
                    )
                })}
                <div>
                    <span
                        style={{cursor: "pointer"}}
                        onClick={() => setCurrentStep(0)}
                    >
                        Quay trở lại
                    </span>
                </div>
            </Col>
            <Col md={8} xs={24}>
                <Form
                    form={form}
                    name="payment-form"
                    onFinish={handlePlaceOrder}
                    autoComplete="off"
                    layout="vertical"
                >
                    <div className="order-sum">
                        <Form.Item<FieldType>
                            label="Hình thức thanh toán"
                            name="method"
                        >
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                                    <Radio value={"BANKING"}>Thanh toán ví điện tử</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{span: 24}}
                            label="Họ tên"
                            name="fullName"
                            rules={[
                                {required: true, message: "Họ tên không được để trống!"}
                            ]}
                        >
                            <Input style={{borderRadius: "5px", height: "40px"}} placeholder="Nhập họ tên..."/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{span: 24}} //whole column
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {required: true, message: 'Số điện thoại không được để trống!'},
                                {
                                    pattern: /^[0-9]{10,}$/,
                                    message: 'Số điện thoại chỉ được chứa số và phải có ít nhất 10 ký tự!'
                                },
                            ]}
                        >
                            <Input style={{borderRadius: "5px", height: "40px"}}
                                   placeholder="Nhập số điện thoại..."/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{span: 24}} //whole column
                            label="Địa chỉ nhận hàng"
                            name="address"
                            rules={[
                                {required: true, message: 'Địa chỉ nhận hàng không được để trống!'}
                            ]}
                        >
                            <TextArea rows={4} style={{}}/>
                        </Form.Item>
                        <div className="calculate">
                            <span>Tạm tính:</span>
                            <span>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(totalPrice || 0)}
                                </span>
                        </div>
                        <Divider style={{margin: "10px 0"}}/>
                        <div className="calculate">
                            <span>Tổng tiền:</span>
                            <span className="sum-final">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(totalPrice || 0)}
                                </span>
                        </div>
                        <Divider style={{margin: "10px 0"}}/>
                        <Button
                            color="danger" variant="solid"
                            htmlType="submit"
                            loading={isSubmit}
                        >
                            Thanh toán ({carts?.length ?? 0})
                        </Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}
export default Payment;