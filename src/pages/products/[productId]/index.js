import styles from 'styles/ProductIndex.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState } from 'react';
import Link from 'next/link';

export default function Variations({ product }) {
    const [data, setData] = useState(product.variants);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(variants.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "size", headerName: "Product Sizes", width: 160 },
        {
            field: "sale_price", headerName: "Sale Price", width: 140, type: "number",
            renderCell: (params) => {
                return (
                    <span className={styles.price_value}>{`$${params.value.toFixed(2)}`}</span>
                )
            }
        },
        {
            field: "purchase_price", headerName: "Purchase Price", width: 170, type: "number",
            valueFormatter: (params) => `$${params.value.toFixed(2)}`
        },
        { field: "description", headerName: "Description", width: 220 },
        { field: "dimensions", headerName: "Dimensions", width: 220 },
        {
            field: "createdAt", headerName: "Added on", width: 140, type: 'dateTime', hide: true,
            valueFormatter: (params) => formatDate(params.value),
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 240,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/${product._id}/${params.row._id}?size=${params.row.size}`}>
                            <button className={styles.productListEdit}>Product Features</button>
                        </Link>
                        <Link href={`/products/${product._id}/update/${params.row._id}`}>
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
                <h2 className={styles.productTitle}>Product Variations</h2>
                <Link href={`/products/${product._id}/create`}>
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <div className={styles.main}>
                <h4 className={styles.productTitle}>{product.title}</h4>
            </div>

            <MuiGrid columns={columns} data={data} />
            <br /><br />
            <Typography>
                <Link href={`/products`}>Back to Products</Link>
            </Typography>

        </div>
    );
}

export async function getServerSideProps(context) {
    const { productId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
    if (data.product.is_sizes_with_colors) {
        data.product.variants = data.product.variants.map((v) => {
            v.id = v._id;
            return v;
        })
    }

    return {
        props: {
            product: data.product
        },
    };
}