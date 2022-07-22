import styles from 'styles/Stores.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button, Link } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState, useEffect } from 'react';

export default function Stores({ stores }) {
    const [data, setData] = useState([]);

    useEffect(() => setData(stores), []);

    const handleDelete = async (slug) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/stores/${slug}`)
            .then(({ data }) => toast.success(data.message));
        setData(stores.filter((item) => item.slug !== slug));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Store", width: 220,
            renderCell: (params) => {
                return (
                    <div className={styles.productListItem}>
                        {(params.row.banner) ? (
                            <img className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/${params.row.banner}`} />) :
                            (<img className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_uploadURL}/default.png`} />)}
                        {params.row.title}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 150 },
        { field: "phone_no", headerName: "Phone #", width: 130 },
        { field: "address", headerName: "Location", width: 230 },
        { field: "city", headerName: "City", width: 120 },
        { field: "state", headerName: "State", width: 120 },
        { field: "zip", headerName: "Zip Code", width: 130 },
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
                        <Link href={"/stores/update/" + params.row.slug}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row.slug)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Stores</h2>
                <Link href="/stores/create">
                    <Button variant="contained" color="primary" component="label" >Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
    return {
        props: {
            stores: data.stores,
        },
    };
}