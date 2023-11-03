import { useEffect, useRef, useState } from 'react';
import '../styles/chat.css';
import { useParams } from 'react-router-dom';
import { useOrder } from './Dashboard';

function Chat() {
  const params = useParams();
  const { order } = useOrder();

  const [messages, setMessages] = useState({});
  const [userMsg, setUserMsg] = useState("");
  const userInputRef = useRef(null);
  const chatWrapperRef = useRef(null);

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
    const msgDate = new Date().toLocaleDateString("en-GB");
    const msgObj = {
      "messageId": order?.messageList?.length ? "msg" + parseInt(order.messageList[order.messageList.length - 1].messageId.split("msg")[1]) + 1 : "msg1",
      "message": userMsg,
      "timestamp": new Date().getTime(),
      "sender": "USER",
      "messageType": "text"
    }
    const tempMessages = { ...messages };
    if (Object.keys(tempMessages).length) {
      if (tempMessages[msgDate]) {
        tempMessages[msgDate].push(msgObj);
      }
      else {
        tempMessages[msgDate] = [msgObj];
      }
    }
    // console.log(tempMessages);
    order.messageList.push(msgObj);
    // console.log(order);
    setMessages(tempMessages);
    setUserMsg("");
    setTimeout(() => {
      // lastChildElement?.scrollIntoView({ behavior: "smooth", block: "end" });//works
      chatWrapperRef.current.scroll({ top: chatWrapperRef.current.scrollHeight, behavior: 'smooth' });
    }, 200)
    userInputRef.current.focus();
  }

  useEffect(() => {
    const tempMessages = {};
    order?.messageList?.forEach((messageItem) => {
      const msgDate = new Date(messageItem.timestamp).toLocaleDateString("en-GB");
      if (tempMessages[msgDate]) {
        tempMessages[msgDate].push(messageItem);
      }
      else {
        tempMessages[msgDate] = [messageItem];
      }
    });
    // console.log(tempMessages);
    setMessages(tempMessages);
  }, [order]);

  useEffect(() => {
    console.log(params);
    // setId(params.id);
  }, [params]);

  return (
    <div className="chat-container" style={{ 'width': order ? '50%' : '0%' }}>
      <div className="header">
        <img src={order?.imageURL} alt={order.title}/>
        <h2>Flipkart Support</h2>
      </div>
      <div className="chat-wrapper" ref={chatWrapperRef}>
        {
          Object.keys(messages).length ? Object.keys(messages).map((msgKey) => (
            messages[msgKey]?.length ? <div className='chat-session' key={msgKey}>
              <div className='chat-day-wrapper'>
                <div className='day'>{msgKey}</div>
              </div>
              {
                messages[msgKey].map((msg) => (
                  <div key={msg.messageId} className={'msg-main ' + msg.messageType + ' ' + msg.sender}>
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
                ))
              }
            </div> : <></>
          ))
            : <div className='start-conv'>
              {'Send a message to start chatting'}
            </div>
        }
      </div>
      <div className="chat-input">
        <input onKeyUp={onEnter} ref={userInputRef} type="text" placeholder="Type a Message..." value={userMsg} onChange={(e) => setUserMsg(e.target.value)} />
        <button style={{backgroundColor: '#027CD5'}} onClick={() => sendMessage()} disabled={!userMsg.length}>▶</button>
      </div>
    </div>
  );
}

export default Chat;
