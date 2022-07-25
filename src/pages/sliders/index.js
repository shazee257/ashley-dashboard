import styles from 'styles/Sliders.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Link, Button, Switch } from "@material-ui/core";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState } from 'react';

export default function Customers({ sliders }) {
    const [data, setData] = useState(sliders);
    const [status, setStatus] = useState();

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(sliders.filter((item) => item._id !== id));
    }

    // open image in new tab
    const imageHandler = (image) => {
        window.open(`${process.env.NEXT_PUBLIC_uploadURL}/${image}`, '_blank');
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Title", width: 260,
            renderCell: (params) => {
                return (
                    <div className={styles.productListItem}>
                        <img
                            className={styles.productListImg}
                            src={`${process.env.NEXT_PUBLIC_thumbURL}/${params.row.image}`}
                            onClick={() => imageHandler(params.row.image)}
                        />
                        <Link href={`/sliders/update/${params.row.id}`}>{params.row.title}</Link>
                    </div>
                );
            },
        },
        { field: "sub_title", headerName: "Sub-Title", width: 230 },
        { field: "description", headerName: "Description", width: 230 },
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
                    <>
                        <Link href={"/sliders/update/" + params.row.id}>
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
                <h2 className={styles.productTitle}>Slider Content</h2>
                <Link href="/sliders/create">
                    <Button variant="contained" color="primary" component="label">Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/sliders`);
    return {
        props: {
            sliders: data.sliders,
        },
    };
}