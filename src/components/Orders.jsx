import { useEffect, useState } from 'react';
import '../styles/orders.css';
import { useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js";

function Orders({orders, activeOrder, selectOrder}) {

    const navigate = useNavigate();
    const [filteredOrders, setFilteredOrders] = useState(null);

    const getDate = (timestamp) => {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleDateString("en-GB");
        return formattedDate;
    }

    const filterOrders = (search) => {
        if(search.length) {
            setFilteredOrders(orders?.filter((order) => order.title.toLowerCase().includes(search.toLowerCase()) || order.orderId.toLowerCase().includes(search.toLowerCase())));
        }
        else {
            setFilteredOrders(orders);
        }
        
    }

    const onSelectOrder = (order) => {
        // console.log(order)
        selectOrder(order);
        navigate(`/support/${encodeURIComponent(CryptoJS.AES.encrypt(order.orderId, ""))}`);
    }

    useEffect(() => {
        // console.log(orders);
        // filterOrders("");
        setFilteredOrders(orders)
    }, [orders])

    return (
        <div className="orders-container" style={{'width': activeOrder ? '50%' : '100%'}}>
            <div className='search'>
                <div className='search-title'>Filter by Title/Order Id</div>
                {/* <input value={searchStr} onChange={(e) => setSearchStr(e.target.value)}/> */}
                <input type='search' placeholder='Start typing to search' onChange={(e) => filterOrders(e.target.value)} />
            </div>
            <div className='orders-list'>
                {
                    filteredOrders?.map((order) => (
                        <div className='order-wrapper' key={order.id} onClick={() => onSelectOrder(order)} style={{'backgroundColor': order.id === activeOrder?.id ? '#f1f3f6' : ''}}>
                            <div className='image'>
                                <img src={order.imageURL} alt={order.title}/>
                            </div>
                            <div className='content'>
                                <div>{order.title}</div>
                                <div>{order.orderId}</div>
                                {order.messageList?.length ? <p>{order.messageList[order.messageList.length - 1].message}</p> : <></>}
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
