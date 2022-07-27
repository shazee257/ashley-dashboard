import styles from 'styles/UsersCustomers.module.css';
import axios from 'axios';
import { DeleteOutline, Phone } from "@material-ui/icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState } from 'react';
import Image from 'next/image';

export default function Customers({ users }) {
    const [data, setData] = useState(users);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/users/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(users.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "first_name", headerName: "Customer", width: 230,
            renderCell: (params) => {
                console.log(params.row.image);
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32}
                                src={params.row.image ?
                                    `${process.env.NEXT_PUBLIC_thumbURL}/users/${params.row.image}` :
                                    `${process.env.NEXT_PUBLIC_thumbURL}/users/avatar.png`} />
                        </div>
                        {`${params.row.first_name} ${params.row.last_name}`}
                    </>
                );
            },
        },
        { field: "email", headerName: "email", width: 220 },
        {
            field: "phone_no", headerName: "Phone #", width: 180,
            renderCell: (params) => {
                return (
                    <>
                        {(params.row.phone_no) && (
                            <div className={styles.productListItem}>
                                <Phone className={styles.phoneIcon} />
                                <button className={styles.phoneNoButton}>{params.row.phone_no}</button>
                            </div>)}
                    </>
                );
            }
        },
        {
            field: "alternet_phone_no", headerName: "Alternet Phone #", width: 180,
            renderCell: (params) => {
                return (
                    <>
                        {(params.row.alternet_phone_no) && (
                            <div className={styles.productListItem}>
                                <Phone className={styles.phoneIcon} />
                                <button className={styles.phoneNoButton}>{params.row.alternet_phone_no}</button>
                            </div>)}
                    </>
                );
            }
        },
        {
            field: "email_subscription", headerName: "email Subscription", width: 190,
            renderCell: (params) => {
                return (
                    <div className={styles.subscriptionDiv}>
                        {params.row.email_subscription ?
                            <button className={styles.subscribedButton}>Subscribed</button>
                            : <button className={styles.noSubscribedButton}>No</button>}
                    </div>
                );
            },
        },

        {
            field: "createdAt", headerName: "Created on", width: 150, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <DeleteOutline
                        className={styles.productListDelete}
                        onClick={() => handleDelete(params.row.id)}
                    />
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Customers</h2>

                {/* <Link href="/users/store/create"> */}
                {/* <Button variant="contained" color="primary" component="label">Create New</Button> */}
                {/* </Link> */}
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/users`);
    const users = data.users.filter((item) => item.role === "customer");
    return {
        props: {
            users
        },
    };
}