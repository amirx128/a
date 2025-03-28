// src/app/chat/[chatIds]/page.js
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { sendRequest } from "../../../utils/api";
import { useRouter, useParams } from "next/navigation";
import styles from "./chat.module.css";
import React, { useCallback } from "react";

export default function ChatDetailPage() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState(null);
  const [messageText, setMessageText] = useState(""); // حالت برای تکست‌باکس
  const router = useRouter();
  const { chatIds } = useParams(); // مثلاً "2***1"

  const fetchChat = useCallback(async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      if (!auth.token || !auth.id) {
        router.push("/login");
        return;
      }

      const [senderId, receiverId] = chatIds.split("***");
      const payload = { SenderUserId: senderId, ReceiverUserId: receiverId };
      const response = await sendRequest("/admin/getOneUserChat", {
        method: "POST",
        body: payload,
      }, auth);

      if (response.isSuccess) {
        setMessages(response.model);
      } else {
        setError(response.message || "مشکلی پیش آمده");
      }
    } catch (err) {
      if (err.message === "Token is invalid") {
        router.push("/login");
      } else {
        setError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);
  // تابع برای دکمه اول - ارسال پیام از طرف ادمین

  const handleAdminMessage2 = async (email) => {
    if (messageText == '') {
      alert('متن نمیتواند خالی باشد')
      return;
    }
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");

      const [_, receiverId] = chatIds.split("***");
      const payload = { messageText, ReceiverUserId: receiverId, emailStatus: email };
      const response = await sendRequest("/admin/sendAdminMessage", {
        method: "POST",
        body: payload,
      }, auth);

      if (response.isSuccess) {

        setMessages([...messages, response.model]); // اضافه کردن پیام جدید به لیست
        setMessageText(""); // پاک کردن تکست‌باکس
        fetchChat();
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const handleAdminMessage = async (email) => {
    if (messageText == '') {
      alert('متن نمیتواند خالی باشد')
      return;
    }
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const [senderId, _] = chatIds.split("***");
      const payload = { messageText, ReceiverUserId: senderId, emailStatus: email };
      const response = await sendRequest("/admin/sendAdminMessage", {
        method: "POST",
        body: payload,
      }, auth);

      if (response.isSuccess) {
        setMessages([...messages, response.model]); // اضافه کردن پیام جدید به لیست
        setMessageText(""); // پاک کردن تکست‌باکس
        fetchChat();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // تابع برای دکمه دوم - ارسال پیام از طرف کاربر
  const handleUserMessage = async (email) => {
    if (messageText == '') {
      alert('متن نمیتواند خالی باشد')
      return;
    }
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const [senderId, receiverId] = chatIds.split("***");
      const payload = { messageText, SenderUserId: senderId, ReceiverUserId: receiverId, emailStatus: email };
      const response = await sendRequest("/admin/SendUserMessage", {
        method: "POST",
        body: payload,
      }, auth);

      if (response.isSuccess) {
        setMessages([...messages, response.model]); // اضافه کردن پیام جدید به لیست
        setMessageText(""); // پاک کردن تکست‌باکس
        fetchChat();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserMessage2 = async (email) => {
    if (messageText == '') {
      alert('متن نمیتواند خالی باشد')
      return;
    }
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const [senderId, receiverId] = chatIds.split("***");
      const payload = { messageText, SenderUserId: receiverId, ReceiverUserId: senderId, emailStatus: email };
      const response = await sendRequest("/admin/SendUserMessage", {
        method: "POST",
        body: payload,
      }, auth);

      if (response.isSuccess) {
        setMessages([...messages, response.model]); // اضافه کردن پیام جدید به لیست
        setMessageText(""); // پاک کردن تکست‌باکس
        fetchChat();
      }
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDelete = async (messageId) => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const response = await sendRequest("/connection/deleteMessage", {
        method: "POST",
        body: { StringId: messageId },
      }, auth);

      if (response.isSuccess) {
        setMessages(messages.filter((msg) => msg.id !== messageId)); // حذف پیام از لیست
      } else {
        setError("حذف پیام ناموفق بود");
      }
    } catch (err) {
      setError(err.message);
    }
  };
  if (error) {
    return (
      <div className={styles.container}>
        <h1>خطا</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!messages) {
    return (
      <div className={styles.container}>
        <h1>در حال بارگذاری...</h1>
      </div>
    );
  }

  const senderId = chatIds.split("***")[0];

  return (
    <>
      <div className={styles.container}>
        <h1>گفتگو بین {messages[0]?.senderName} و {messages[0]?.receiverName}</h1>
        <div className={styles.chatBox}>
          {messages
            .filter((message) => message && message.id) // فقط چت‌هایی که id دارن
            .map((message) => {
              // تابع برای تبدیل messageStatusId به متن
              const messageStatusText = (() => {
                switch (message.messageStatusId) {
                  case 1:
                    return 'خوانده نشده است';
                  case 2:
                    return 'خوانده شده';
                  case 3:
                    return 'حذف شده';
                  default:
                    return 'وضعیت نامشخص';
                }
              })();

              return (
                <div
                  key={message.id}
                  className={`${styles.message} ${message.senderUserId === senderId ? styles.sent : styles.received}`}
                >
                  <Link href={`/user/${message.senderUserId}`} legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                      <span className={styles.sender}>
                        {message.senderName} :
                        <br /> {message.message}
                      </span>
                    </a>
                  </Link>
                  <p>
                    <span>{message.sendDateTime}</span> <br /> {/* اینجا برای رفتن به خط جدید */}
                    <span>{messageStatusText}</span>
                  </p>
                  <button
                    onClick={() => handleDelete(message.id)} // فرض می‌کنم id پیام رو می‌فرستی
                    className={styles.deleteButton}
                    title="حذف پیام"
                  >
                    🗑️ {/* آیکن سطل آشغال یونیکد */}
                  </button>
                </div>
              );
            })}
        </div>
        {/* اضافه کردن تکست‌باکس و دکمه‌ها */}
        <div className={styles.inputSection}>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="پیام خود را وارد کنید"
            className={styles.textBox}
            rows="5" // ارتفاع ۵ خط
          />

        </div>
      </div>

      <div
        className="columns-container"
        style={{
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row', // توی موبایل زیر هم، دسکتاپ کنار هم
          gap: '20px',
        }}
      >
        {/* ستون اول */}
        <div
          className="column"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#a5a5a5', // خاکستری روشن
            padding: '10px',
            borderRadius: '8px',
            flex: 1,
            minWidth: window.innerWidth <= 768 ? 'auto' : '200px', // توی موبایل عرض کامل
          }}
        >
          <h3>ارسال پیام ساده - بدون ایمیل اطلاع رسانی</h3>
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleUserMessage(0)}
              className={styles.userButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span><br />
              <span>به</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleAdminMessage(0)}
              className={styles.adminButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف ادمین به</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleUserMessage2(0)}
              className={styles.userButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span><br />
              <span>به</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleAdminMessage2(0)}
              className={styles.adminButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف ادمین به</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span>
            </button>
          </div>
        </div>

        {/* ستون دوم */}
        <div
          className="column"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#a6000A', // آبی خیلی روشن
            padding: '10px',
            borderRadius: '8px',
            flex: 1,
            minWidth: window.innerWidth <= 768 ? 'auto' : '200px',
          }}
        >
          <h3>ارسال پیام به همراه ایمیل اطلاع رسانی</h3>
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleUserMessage(1)}
              className={styles.userButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span><br />
              <span>به</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleAdminMessage(1)}
              className={styles.adminButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف ادمین به</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleUserMessage2(1)}
              className={styles.userButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span><br />
              <span>به</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleAdminMessage2(1)}
              className={styles.adminButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف ادمین به</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span>
            </button>
          </div>
        </div>

        {/* ستون سوم */}
        <div
          className="column"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#aaa3E6', // نارنجی خیلی روشن
            padding: '10px',
            borderRadius: '8px',
            flex: 1,
            minWidth: window.innerWidth <= 768 ? 'auto' : '200px',
          }}
        >
          <h3>ارسال پیام به همراه ایمیل اطلاع رسانی با متن پیام</h3>
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleUserMessage(2)}
              className={styles.userButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span><br />
              <span>به</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleAdminMessage(2)}
              className={styles.adminButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف ادمین به</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleUserMessage2(2)}
              className={styles.userButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span><br />
              <span>به</span><br />
              <span style={{ fontWeight: 'bold', color: '#8B4513' }}>{messages[0]?.receiverName}</span>
            </button>
          </div>
          <br />
          <div style={{ width: '100%' }}>
            <button
              onClick={() => handleAdminMessage2(2)}
              className={styles.adminButton}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span>ارسال پیام از طرف ادمین به</span><br />
              <span style={{ fontWeight: 'bold', color: 'black' }}>{messages[0]?.senderName}</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );


}