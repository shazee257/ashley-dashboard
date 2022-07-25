import styles from "./Sidebar.module.css";
import {
  Home,
  StoreOutlined,
  FeaturedVideoOutlined,
  Category,
  ExitToAppRounded,
  SupervisorAccountOutlined,
  SettingsOutlined,
  HelpOutlineOutlined,
  TrackChangesOutlined,

  BusinessCenterOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,

} from "@material-ui/icons";
import Link from 'next/link'
import { useRouter } from "next/router";
import { useState } from 'react';



export default function Sidebar() {
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [isClicked4, setIsClicked4] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  }

  const handleClickMenu1 = () => setIsClicked1(!isClicked1);
  const handleClickMenu2 = () => setIsClicked2(!isClicked2);
  const handleClickMenu3 = () => setIsClicked3(!isClicked3);
  const handleClickMenu4 = () => setIsClicked4(!isClicked4);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrapper} style={{ width: '220px' }}>
        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu1} >
            <div className={styles.MenuLeftItems}>
              <BusinessCenterOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>e-Commerce</h3>
            </div>
            {isClicked1 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked1}>

            <li className={`${styles.li} ${router.pathname == "/" ? styles.active : ""}`}>
              <Link href='/' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Home</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/stores/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/stores' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Stores</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/brands/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/brands' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Brands</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/categories/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/categories' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Categories</a>
              </Link>
            </li>

          </ul >
        </div>

        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu2} >
            <div className={styles.MenuLeftItems}>
              <SupervisorAccountOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Users Management</h3>
            </div>
            {isClicked2 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked2}>

            <li className={`${styles.li} ${RegExp(/users\/admin/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/users/admin' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Admin</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/users\/store/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/users/store' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Store Users</a>
              </Link>
            </li>

            <li className={`${styles.li} ${RegExp(/users\/cutomers/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/users/customers' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Customers</a>
              </Link>
            </li>


          </ul>
        </div>

        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu3} >
            <div className={styles.MenuLeftItems}>
              <TrackChangesOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Content Mgmt Sys</h3>
            </div>
            {isClicked3 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked3}>

            <li className={`${styles.li} ${RegExp(/sliders/).test(router.pathname) ? styles.active : ""}`}>
              <Link href='/sliders' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>Slider Contents</a>
              </Link>
            </li>



          </ul>
        </div>

        <div className={styles.sidebarMenu}>
          <div className={styles.quickMenu} onClick={handleClickMenu4} >
            <div className={styles.MenuLeftItems}>
              <SettingsOutlined className={styles.MenuTitleIcon} />
              <h3 className={styles.sidebarTitle}>Settings</h3>
            </div>
            {isClicked4 ? <ExpandMoreOutlined /> : <ExpandLessOutlined />}
          </div>
          <ul className={styles.sidebarList} hidden={isClicked4}>

            <li className={`${styles.li} ${router.pathname == "/settings" ? styles.active : ""}`}>
              <Link href='/' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}>
                  Settings</a>
              </Link>
            </li>

            <li className={`${styles.li} ${router.pathname == "/stores" ? styles.active : ""}`}>
              <Link href='/stores' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}><HelpOutlineOutlined className={styles.sidebarIcon} />
                  Help</a>
              </Link>
            </li>

            <li className={`${styles.li} ${router.pathname == "/login" ? styles.active : ""}`} onClick={handleLogout} >
              <Link href='/login' className={`${styles.sidebarListItem} ${styles.link}`}>
                <a className={styles.anchor}><ExitToAppRounded className={styles.sidebarIcon} />Logout</a>
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </div >
  );
}
