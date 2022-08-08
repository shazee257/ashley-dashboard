import styles from 'styles/ProductIndex.module.css';
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

export default function Variations({ product, variants }) {
    const [data, setData] = useState(variants);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(variants.filter((item) => item.id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "size", headerName: "Product Sizes", width: 160 },
        {
            field: "sale_price", headerName: "Sale Price", width: 200, type: "number",
            renderCell: (params) => {
                return (
                    <span className={styles.price_value}>{`$${params.value.toFixed(2)}`}</span>
                )
            }
        },
        {
            field: "purchase_price", headerName: "Purchase Price", width: 200, type: "number",
            valueFormatter: (params) => `$${params.value.toFixed(2)}`
        },
        {
            field: "createdAt", headerName: "Created on", width: 200, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/update/${product._id}/${params.row.id}`}>
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

    const featureColumns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "size", headerName: "Product Sizes", width: 160 },
        {
            field: "sale_price", headerName: "Sale Price", width: 200, type: "number",
            renderCell: (params) => {
                return (
                    <span className={styles.price_value}>{`$${params.value.toFixed(2)}`}</span>
                )
            }
        },
        {
            field: "purchase_price", headerName: "Purchase Price", width: 200, type: "number",
            valueFormatter: (params) => `$${params.value.toFixed(2)}`
        },
        {
            field: "createdAt", headerName: "Created on", width: 200, type: 'dateTime',
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/update/${product._id}/${params.row.id}`}>
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

    const variantSelectHandler = (e) => {
        const variant = e.row;
        console.log(e.row);
    }

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <h2 className={styles.productTitle}>Product Variations</h2>
                <Link href={`/products/${product.slug}/v/create`}>
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <div className={styles.main}>
                <h4 className={styles.productTitle}>{product.title}</h4>
            </div>

            <MuiGrid columns={columns} data={data} clickHanlder={variantSelectHandler} />
            <br /><br />


            <div className={styles.main}>
                <h2 className={styles.productTitle}>Product Features</h2>
                <Link href={`/products/${product.slug}/v/create`}>
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>            </div>
            <MuiGrid columns={columns} data={data} />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/${slug}`);
    let variants;
    if (data.product.is_sizes_with_colors) {
        variants = data.product.variants.map((v) => {
            v.id = v._id;
            return v;
        })
    }

    console.log("variants", data.product.variants);

    return {
        props: {
            product: data.product,
            variants: variants,
        },
    };
}