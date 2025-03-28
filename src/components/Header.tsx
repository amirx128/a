// src/components/Header.tsx
"use client";

import React, { CSSProperties } from "react";

const headerStyle: CSSProperties = {
  backgroundColor: "#333",
  padding: "10px",
  direction: "rtl", // حالا TypeScript متوجه می‌شه که مقدار `direction` درسته
  minHeight: "50px",
}; 
const navStyle = {
  display: "flex",
  justifyContent: "flex-end",
};

const menuStyle = {
  listStyle: "none",
  display: "flex",
  margin: 0,
  padding: 0,
};

const menuItemStyle = {
  marginLeft: "20px",
  color: "white",
};

const Header = () => {
  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <ul style={menuStyle}>
          <li style={menuItemStyle}><a href="/adminsms">پیام های ادمین</a></li>
          <li style={menuItemStyle}><a href="/allChat">مکالمات</a></li>
          <li style={menuItemStyle}><a href="/lastlogin">آخرین لاگین ها</a></li>
          <li style={menuItemStyle}><a href="/lastusers">آخرین ثبت نام ها</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;