import { useEffect, useRef, useState } from 'react';
import '../styles/chat.css';
import { useParams } from 'react-router-dom';
import { useOrder } from './Dashboard';

function Chat() {
  const params = useParams();
  const { order } = useOrder();

  const [userMsg, setUserMsg] = useState("");
  const userInputRef = useRef(null);
  const chatWrapperRef = useRef(null);

  const getDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-GB");
    return formattedDate === new Date().toLocaleDateString("en-GB") ? 'Today' : formattedDate;
  }

  const getTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12; // 12h instead of 24h, with 12 instead of 0
    const minutes = date.getMinutes();
    const amPm = date.getHours() >= 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${amPm}`;
  }

  const isMsgOlderThan24Hrs = (timestamp) => {
    const msgdate = new Date(timestamp);
    const currentDate = new Date();
    return (currentDate - msgdate) >= 864000000 ? true : false;
  }

  const onEnter = (e) => {
    // console.log(e, e.charCode, userMsg)
    if (e.keyCode === 13 && userMsg?.length) {
      sendMessage();
    }
  }

  const sendMessage = () => {
    // console.log(messages);
    const msgObj = {
      "messageId": order?.messageList?.length ? 
        ("msg" + (order.messageList[order.messageList.length]+1) + new Date().getTime()) : 
        ("msg1" + new Date().getTime()),
      "message": userMsg,
      "timestamp": new Date().getTime(),
      "sender": "USER",
      "messageType": "text"
    }

    order.messageList.push(msgObj)

    setUserMsg("");
    setTimeout(() => {
      // lastChildElement?.scrollIntoView({ behavior: "smooth", block: "end" });//works
      chatWrapperRef.current.scroll({ top: chatWrapperRef.current.scrollHeight, behavior: 'smooth' });
    }, 200)
    userInputRef.current.focus();
  }

  const showDate = (msg, index) => {
    if (order?.messageList?.length) {
      if (order.messageList[index - 1]) {
        return new Date(msg.timestamp).toLocaleDateString() !== new Date(order.messageList[index - 1].timestamp).toLocaleDateString();
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  useEffect(() => {
    console.log(params);//ideally order details should be fetched from an API using the order id fetched from the params of this route
  }, [params])

  return (
    <div className="chat-container" style={{ 'width': order ? '50%' : '0%' }}>
      <div className="header">
        <img src={order?.imageURL} alt={order.title} />
        <div className='title'>Flipkart Support</div>
      </div>
      <div className="chat-wrapper" ref={chatWrapperRef}>
        {
          order?.messageList?.length ? order.messageList.map((msg, index) => (
            <div className='chat-list' key={msg.messageId + msg.timestamp} >
              {showDate(msg, index) ? <div className='chat-day-wrapper'>
                <div className='day'>{getDate(msg.timestamp)}</div>
              </div> : <></>
              }
              <div className={'msg-main ' + msg.messageType + ' ' + msg.sender}>
                <div className='msg-wrapper'>
                  <div className='msg-text'>{msg.message}</div>
                  {msg.options?.length ? <div className={isMsgOlderThan24Hrs(msg.timestamp) ? 'options disabled' : 'options'} >
                    {msg.options.map((option, index) => (
                      <div key={index} className="option">
                        <div className="text">{option.optionText}</div>
                        <div className="sub-text">{option.optionSubText}</div>
                      </div>
                    ))}
                  </div> : <></>}
                  <div className='timestamp'><small>{getTime(msg.timestamp)}</small></div>
                </div>
              </div>
            </div>
          ))
            : <div className='start-conv'>
              {'Send a message to start chatting'}
            </div>
        }
      </div>
      <div className="chat-input">
        <input onKeyUp={onEnter} ref={userInputRef} type="text" placeholder="Type a Message..." value={userMsg} onChange={(e) => setUserMsg(e.target.value)} />
        <button style={{ backgroundColor: '#027CD5' }} onClick={() => sendMessage()} disabled={!userMsg.length}>▶</button>
      </div>
    </div>
  );
}

export default Chat;
