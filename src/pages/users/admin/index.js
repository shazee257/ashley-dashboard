import styles from 'styles/AdminUsers.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Link, Button } from "@material-ui/core";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState } from 'react';

export default function AdminUsers({ users }) {
    const [data, setData] = useState(users);

    // useEffect(() => setData(users), []);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/users/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(users.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "first_name", headerName: "User", width: 240,
            renderCell: (params) => {
                return (
                    <div className={styles.productListItem}>
                        {params.row.image ? <img className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/${params.row.image}`} />
                            : <img className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_uploadURL}/avatar.png`} />
                        }
                        {`${params.row.first_name} ${params.row.last_name}`}
                    </div>
                );
            },
        },
        { field: "email", headerName: "email", width: 200 },
        { field: "phone_no", headerName: "Phone #", width: 140 },
        { field: "alternet_phone_no", headerName: "Alternet Phone #", width: 180 },

        {
            field: "createdAt", headerName: "Created on", width: 150,
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/users/admin/update/" + params.row.id}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Admin Users</h2>
                <Link href="/users/admin/create">
                    <Button variant="contained" color="primary" component="label">Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/users/admin/users`);
    return {
        props: {
            users: data.users,
        },
    };
}