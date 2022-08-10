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

export default function Features({ product, features }) {
    const [data, setData] = useState(features);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(variants.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "color.title", headerName: "Color", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${params.row.color.image}`} />
                        </div>
                        {params.row.color.title}
                    </>
                )
            }
        },
        { field: "quantity", headerName: "Quantity", width: 150 },
        { field: "sku", headerName: "SKU", width: 150 },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
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
                <h2 className={styles.productTitle}>Product Variants ~ Features</h2>
                <Link href={`/products/${product._id}/create`}>
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <div className={styles.main}>
                <h4 className={styles.productTitle}>{`Product : ${product.title}`}</h4>
            </div>

            <MuiGrid columns={columns} data={data} />
            <br /><br />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { productId, variantId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);

    const features = data.product.variants.find((item) => item._id === variantId).features.map((v) => {
        v.id = v._id;
        return v;
    });

    return {
        props: {
            product: data.product,
            features,
        },
    };
}