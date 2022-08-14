import styles from 'styles/Product.module.css';
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

export default function Products({ products }) {
    const [data, setData] = useState(products);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(products.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "title", headerName: "Product Title", width: 300,
            renderCell: (params) => {
                return (
                    <strong className={styles.productListTitle}>{params.value}</strong>

                );
            }

        },
        {
            field: "category_id.title", headerName: "Category", width: 220,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.category_id.image &&
                                    `${process.env.NEXT_PUBLIC_thumbURL}/categories/${params.row.category_id.image}`} />
                        </div>
                        {params.row.category_id.title}
                    </>
                );
            },
        },
        {
            field: "brand_id.title", headerName: "Brand", width: 190,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.brand_id.image &&
                                    `${process.env.NEXT_PUBLIC_thumbURL}/brands/${params.row.brand_id.image}`} />
                        </div>
                        {params.row.brand_id.title}
                    </>
                );
            },
        },
        {
            field: "store_id.title", headerName: "Store", width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={params.row.store_id.banner &&
                                    `${process.env.NEXT_PUBLIC_thumbURL}/stores/${params.row.store_id.banner}`} />
                        </div>
                        {params.row.store_id.title}
                    </>
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
            width: 240,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/${params.row._id}`}>
                            <button className={styles.productListEdit}>Product Variants</button>
                        </Link>
                        <Link href={"/products/update/" + params.row._id}>
                            <button className={styles.productListEdit}>Edit</button>
                        </Link>
                        <DeleteOutline
                            className={styles.productListDelete}
                            onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Products</h2>
                <Link href="/products/create">
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
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products`);
    return {
        props: {
            products: data.products,
        },
    };
}