import styles from "./Topbar.module.css"
import React, { useState, useEffect } from "react";
// import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Typography, Button, Menu, MenuItem } from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";

export default function Topbar() {
  const [user, setUser] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      verifyToken(token);
      //   router.push("/");
    }
  }, [])

  const verifyToken = (userToken) => {
    axios.get(`${process.env.NEXT_PUBLIC_baseURL}/users/verify-token`, {
      headers: { "Authorization": userToken }
    }).then(({ data }) => {
      if (data.success) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    }).catch(err => {
      console.log(err);
    })
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarWrapper}>
        <div className={styles.topLeft}>
          <Typography component="h1" variant="h4" align="center" gutterBottom style={{ marginBottom: '0' }}>
            Ashley Furniture
          </Typography>
        </div>
        <div className={styles.topCenter}>
          <Typography component="h1" variant="h3" gutterBottom style={{ marginBottom: '0' }} >
            Admin Dashboard
          </Typography>
        </div>
        <div className={styles.topRight}>
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <div className={styles.userRole}>
              {`${user.first_name} ${user.last_name}`}
            </div>

            <div className={styles.topAvatarContainer}>
              {user.image ? <img src={`${process.env.NEXT_PUBLIC_thumbURL}/users/${user.image}`} className={styles.topAvatar} />
                : <img src={`${process.env.NEXT_PUBLIC_uploadURL}/users/avatar.png`} className={styles.topAvatar} />
              }
            </div>
          </Button>
        </div>
      </div>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>{user.email}</MenuItem>
        <MenuItem onClick={handleClose} style={{ textTransform: "capitalize" }}>{user.role}</MenuItem>
        <MenuItem onClick={handleLogout} style={{ color: 'red' }}>Logout</MenuItem>
      </Menu>
    </div >
  );
}
