"use client";

import { sendRequest } from "../../utils/api";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LastUsersPage() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        if (!auth.token || !auth.id) {
          router.push("/login");
          return;
        }

        const payload = {
          PageIndex: 1,
          CurrentUserId: "abcd", // این می‌تونه بعداً حذف بشه چون auth.id توی body اضافه می‌شه
        };

        const response = await sendRequest("/admin/getLastUsers", {
          method: "POST",
          body: payload,
        }, auth);

        if (response.isSuccess) {
          setUsers(response.model);
        } else {
          setError(response.message || "مشکلی پیش آمده");
        }
      } catch (err) {
        if (err.message === "Token is invalid") {
          router.push("/login"); // ریدایرکت به لاگین در صورت 401
        } else {
          setError(err.message);
        }
      }
    };
    fetchUsers();
  }, [router]);

  if (error) {
    return (
      <div>
        <h1>Last Users</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!users) {
    return (
      <div>
        <h1>Last Users</h1>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div style={{ maxHeight: "auto", overflowY: "auto", direction: "rtl" }}>
      <h1>Last Users</h1>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", position: "sticky", top: 0, zIndex: 1 }}>
            <th style={{ border: "1px solid black", padding: "8px", width: "100px" }}>نام</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>نام خانوادگی</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "50px" }}>سن</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "80px" }}>جنسیت</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>وضعیت تاهل</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "100px" }}>استان</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>آخرین فعالیت</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>عضویت</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>نوع زندگی</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "150px" }}>توضیحات من</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "150px" }}>توضیحات طرف</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>ایمیل</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>تایید ایمیل</th>
            <th style={{ border: "1px solid black", padding: "8px", width: "120px" }}>موبایل</th>


          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#118800" : "#f08f8f", // خاکستری و قرمز کم‌رنگ
              }}
            >
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "10.5em",
                  textOverflow: "ellipsis",
                }}
              >  <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.firstName}
                  </a>
                </Link>     
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
               <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.lastName}
                  </a>
                </Link>     
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.age}
                  </a>
                </Link>      
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
               <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.gender}
                  </a>
                </Link>     
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                 <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.marriageStatus}
                  </a>
                </Link>      
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.province}
                  </a>
                </Link>   
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                 <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.lastActivityDate}
                  </a>
                </Link>    
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.memberDate}
                  </a>
                </Link>    
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.liveType}
                  </a>
                </Link>     
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                  <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.myDescription}
                  </a>
                </Link>    
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.rDescription}
                  </a>
                </Link>  
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.emailAddress}
                  </a>
                </Link>
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.emailStatus}
                  </a>
                </Link>   
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  maxHeight: "4.5em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                  <Link href={`/user/${user.id}`} legacyBehavior>
                  <a target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                    {user.mobileNumber}
                  </a>
                </Link>   
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}