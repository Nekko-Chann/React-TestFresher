import {useCurrentApp} from "components/context/app.context";
import {useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router';
import {FaReact} from "react-icons/fa";
import {VscSearchFuzzy} from "react-icons/vsc";
import {Avatar, Badge, Divider, Drawer, Dropdown, Popover, Space} from "antd";
import {FiShoppingCart} from "react-icons/fi";
import 'styles/app.header.scss'
import {logoutAPI} from "services/api";

const AppHeader = () => {
    const {user, setUser, isAuthenticated, setIsAuthenticated} = useCurrentApp();
    const [openDrawer, setOpenDrawer] = useState(false)
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
        }
    }

    let items = [
        {
            label: <label
                style={{cursor: 'pointer'}}
                onClick={() => alert("me")}
            >Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: 'history',
        },
        {
            label: <label
                style={{cursor: 'pointer'}}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];
    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }
    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`;

    const contentPopover = () => {
        return (
            <div className='pop-cart-body'>
                {/* <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                    :
                    <Empty
                        description="Không có sản phẩm trong giỏ hàng"
                    />
                } */}
            </div>
        )
    }

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰
                        </div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span onClick={() => navigate('/')}> <FaReact
                                    className='rotate icon-react'/>Edan Shop</span>

                                <VscSearchFuzzy className='icon-search'/>
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                // value={props.searchTerm}
                                // onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className="popover-carts"
                                    placement="topRight"
                                    rootClassName="popover-carts"
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                    arrow={true}>
                                    <Badge
                                        // count={carts?.length ?? 0}
                                        count={10}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart'/>
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical'/></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{items}} trigger={['click']}>
                                        <Space>
                                            <Avatar src={urlAvatar}/>
                                            {user?.fullName}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider/>

                <p onClick={()=>handleLogout()}>Đăng xuất</p>
                <Divider/>
            </Drawer>

        </>
    )
}
export default AppHeader;