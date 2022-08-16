import styles from 'styles/Brands.module.css';
import axios from 'axios';
import { DeleteOutline } from "@mui/icons-material";
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MuiGrid from 'components/MuiGrid/MuiGrid';
const { formatDate } = require("utils/utils");
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Brands({ colors }) {
    const [data, setData] = useState(colors);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/colors/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(colors.filter((item) => item._id !== id));
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "image", headerName: "Color", width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={32} width={32} className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${params.row.image}`} />
                        </div>
                    </>
                );
            },
        },
        { field: "title", headerName: "Color Name", width: 150 },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 100,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={"/colors/update/" + params.row._id}>
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
                <h2 className={styles.productTitle}>Product Colors</h2>
                <Link href="/colors/create">
                    <Button variant="contained" color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <MuiGrid data={data} columns={columns} />
        </div>

    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);
    return {
        props: {
            colors: data.colors,
        },
    };
}