import { useEffect, useState } from 'react';
import '../styles/orders.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useEncryption from '../hooks/useEncryption';
import useDebounce from '../hooks/useDebounce';

function Orders({ orders, activeOrder, selectOrder }) {

    const params = useParams();
    const location = useLocation();

    const navigate = useNavigate();
    const [searchStr, setSearchStr] = useState("");
    const [filteredOrders, setFilteredOrders] = useState(null);
    const [activeOrderId, setActiveOrderId] = useState("");

    const { encrypt, decrypt } = useEncryption();

    const debouncedValue = useDebounce(searchStr, 300);

    const getDate = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString("en-GB");
        return formattedDate;
    }

    const onSelectOrder = (order) => {
        // console.log(order)
        setActiveOrderId(order.orderId);
        selectOrder(order);
        const encryptedId = encrypt(order.orderId);
        navigate(`/support/${encryptedId}`);
    }

    useEffect(() => {
        // console.log(orders, params, activeOrderId);
        setFilteredOrders(orders);

        //to selected prev selected order on page load
        if (orders?.length && params?.orderId) {
            const orderId = decrypt(params.orderId);
            // console.log(orderId);
            const selectedOrderIndex = orders?.findIndex((order) => order.orderId === orderId);
            if (selectedOrderIndex > -1) {
                setActiveOrderId(orderId);
                selectOrder(orders[selectedOrderIndex]);
            }
            else {
                setActiveOrderId("");
                window.history.replaceState(null, null, "/support");
            }
        }
    }, [orders]);

    useEffect(() => {
        console.log(debouncedValue);
        if (debouncedValue.length) {
            const filteredOrders = orders?.filter((order) => order.title.toLowerCase().includes(debouncedValue.toLowerCase()) || order.orderId.toLowerCase().includes(debouncedValue.toLowerCase()));
            //to handle if current selected order is not in the filtered order list
            if (activeOrderId?.length && (filteredOrders.findIndex((order) => order.orderId === activeOrderId) === -1)) {
                selectOrder(null);
                setActiveOrderId("");
                window.history.replaceState(null, null, "/support");
            }
            setFilteredOrders(filteredOrders);
        }
        else {
            setFilteredOrders(orders);
        }
    }, [debouncedValue])

    return (
        <div className="orders-container" style={{ 'width': activeOrder ? '50%' : '100%' }}>
            <div className='search'>
                <div className='search-title'>Filter by Title/Order Id</div>
                {/* <input value={searchStr} onChange={(e) => setSearchStr(e.target.value)}/> */}
                <input type='search' placeholder='Start typing to search' onChange={(e) => setSearchStr(e.target.value)} />
            </div>
            <div className='orders-list'>
                {
                    filteredOrders?.map((order) => (
                        <div className={`order-wrapper ${order.id === activeOrder?.id ? "active" : ""}`}
                            key={order.id} onClick={() => onSelectOrder(order)} >
                            <div className='image'>
                                <img src={order.imageURL} alt={order.title} />
                            </div>
                            <div className='content'>
                                <div>{order.title}</div>
                                <div>{order.orderId}</div>
                                {
                                    order.messageList?.length ?
                                        <p className='last-msg'>{order.messageList[order.messageList.length - 1].message}</p> : <></>
                                }
                            </div>
                            <div className='timestamp'>{getDate(order.latestMessageTimestamp)}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Orders;
