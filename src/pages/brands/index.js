import styles from 'styles/Brands.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Brands({ brands }) {
    const [data, setData] = useState([]);

    useEffect(() => setData(brands), []);

    const handleDelete = async (slug) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/brands/${slug}`)
            .then(({ data }) => toast.success(data.message));
        setData(brands.filter((item) => item.slug !== slug));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Brand", width: 320,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/brands/${params.row.image}`} />
                        </div>
                        {params.row.title}
                    </>
                );
            },
        },
        { field: "description", headerName: "Description", width: 500 },
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
                        <Link href={"/brands/update/" + params.row.slug}>
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
                <h2 className={styles.productTitle}>Brands</h2>
                <Link href="/brands/create">
                    <Button variant="contained" color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>

    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands`);
    return {
        props: {
            brands: data.brands,
        },
    };
}