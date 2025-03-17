// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const Header = () => {
  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <ul style={menuStyle}>
          <li style={menuItemStyle}><a href="/adminsms">adminsms</a></li>
          <li style={menuItemStyle}><a href="/allChat">allChat</a></li>
          <li style={menuItemStyle}><a href="/lastlogin">lastlogin</a></li>
          <li style={menuItemStyle}><a href="/contact">  lastusers </a></li>
          <li style={menuItemStyle}><a href="/profile">پروفایل</a></li>
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  backgroundColor: "#333",
  padding: "10px",
  direction: "rtl",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa"><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}><Header />{children}</body></html>
  );
}