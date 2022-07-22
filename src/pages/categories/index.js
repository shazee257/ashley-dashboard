import styles from "styles/Categories.module.css";
import axios from 'axios';
import { DeleteOutline } from "@material-ui/icons";
import { Button, Link } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
import MuiGrid from 'components/MuiGrid/MuiGrid';
import { useState, useEffect } from 'react';

export default function Categories({ categories }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(categories);
        console.log(categories);
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
                    <div className={styles.productListItem}>
                        <img className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/${params.row.image}`} />
                        {params.row.title}
                    </div>
                );
            },
        },
        {
            field: "parent_title", headerName: "Parent Category", width: 300,
            renderCell: (params) => {
                // { params.row.parent_title ? params.row.parent_title : "None" }
                return (
                    <div className={styles.productListItem}>
                        {params.row.parent_image ?
                            (<img className={styles.productListImg} src={`${process.env.NEXT_PUBLIC_thumbURL}/${params.row.parent_image}`} />) : "None"}
                        {params.row.parent_title}
                    </div>
                );
            }


        },
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
                    <Button variant="contained" color="primary" component="label" >Create New</Button>
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