import styles from "styles/Categories.module.css";
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
import MuiGrid from 'components/MuiGrid/MuiGrid';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Categories({ categories }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(categories);
    }, []);

    const handleDelete = async (slug) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/categories/${slug}`)
            .then(({ data }) => toast.success(data.message));
        setData(categories.filter((item) => item.slug !== slug));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Category", width: 320,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${params.row.image}`} />
                        </div>
                        {params.row.title}
                    </>
                );
            },
        },
        {
            field: "parent_title", headerName: "Parent Category", width: 300,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            {params.row.parent_image ?
                                (<Image height={32} width={32} className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${params.row.parent_image}`} />) : "None"}
                        </div>
                        {params.row.parent_title}
                    </>
                );
            }


        },
        {
            field: "createdAt", headerName: "Created on", width: 150, type: "dateTime",
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/categories/update/" + params.row.slug}>
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
                <h2 className={styles.productTitle}>Product Categories</h2>
                <Link href="/categories/create">
                    <Button variant="contained" color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories`);
    return {
        props: {
            categories: data.categories
        }
    };
}