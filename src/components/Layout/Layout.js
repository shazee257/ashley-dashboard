import styles from './Layout.module.css';
import Sidebar from "components/Sidebar/Sidebar";
import Topbar from "components/Topbar/Topbar";
import { ToastContainer } from 'react-toastify';

const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Topbar />
            <div className={styles.main}>
                <Sidebar />
                {children}
            </div>
            <ToastContainer position="top-right" />
        </div>
    )
}

export default Layout