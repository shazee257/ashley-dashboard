import styles from 'styles/Stores.module.css';
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
// import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DataGrid } from "@material-ui/data-grid";

export default function Stores({ products }) {
    const [pageSize, setPageSize] = useState(10);
    const [variants, setVariants] = useState([]);
    const [data, setData] = useState(products);

    const handleDelete = async (slug) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${slug}`)
            .then(({ data }) => toast.success(data.message));
        setData(products.filter((item) => item.slug !== slug));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "title", headerName: "Product Title", width: 270 },
        {
            field: "category_id.title", headerName: "Category", width: 240,
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
            field: "brand_id.title", headerName: "Brand", width: 210,
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
            field: "store_id.title", headerName: "Store", width: 210,
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
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/products/update/" + params.row.slug}>
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

    const variationColumns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "title", headerName: "Product Title", width: 270 },

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
                        <Link href={"/products/update/" + params.row.slug}>
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

    const productSelectHandler = (e) => {
        // add id to array from _id
        let variants = e.row.variants.map((item) => {
            item.id = item._id;
            return item;
        })
        setVariants(variants);
    }


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

            <DataGrid
                rows={data}
                // disableSelectionOnClick
                columns={columns}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowHeight={40}
                checkboxSelection
                autoHeight={true}
                onRowClick={productSelectHandler}
                disableSelectionOnClick={true}
            />


            <div className={styles.main}>
                <h2 className={styles.productTitle}>Variations</h2>
            </div>

            <DataGrid
                rows={variants}
                // disableSelectionOnClick
                columns={variationColumns}
                rowsPerPageOptions={[10, 20, 50, 100]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowHeight={40}
                checkboxSelection
                autoHeight={true}
                onRowClick={(e) => console.log(e.row)}
                disableSelectionOnClick={true}
            />
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