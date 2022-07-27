import styles from 'styles/Stores.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.banner ?
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/${params.row.banner}` :
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/store.png`} />

                        </div>
                        {params.row.title}
                    </>
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
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export async function getServerSideProps() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
    return {
        props: {
            stores: data.stores,
        },
    };
}