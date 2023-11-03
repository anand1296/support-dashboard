import { Outlet, useOutletContext } from "react-router-dom";
import Orders from "./Orders";
import { useEffect, useState } from "react";

// let orders = null;

const Dashboard = () => {

    const [activeOrder, setActiveOrder] = useState(null);
    const [orders, setOrders] = useState(null);

    const selectOrder = (order) => {
        // console.log(order);
        setActiveOrder(order);
    }

    useEffect(() => {
        fetch("https://my-json-server.typicode.com/codebuds-fk/chat/chats").then((res) => res.json()).then((res) => {
            // console.log(res);
            // orders = res;
            setOrders(res);
            // console.log(orders);
        })
    }, [])

    return (
        <div style={{ width: '100%', display: 'flex' }}>
            <Orders orders={orders} activeOrder={activeOrder} selectOrder={selectOrder} />
            {activeOrder && <Outlet context={{ order: activeOrder }} />}
        </div>
    )
}

export default Dashboard;

export function useOrder() {
    return useOutletContext();
}