import styles from 'styles/ProductFeatures.module.css';
import axios from 'axios';
import {
    DeleteOutline,
    CloudUploadOutlined,
} from "@material-ui/icons";
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { formatDate } = require("utils/utils");
import MuiGrid from "components/MuiGrid/MuiGrid";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showNotification } from 'utils/helper';

export default function Features({ productId, variantId, productTitle, features, size }) {
    const [data, setData] = useState(features);
    const [image, setImage] = useState();
    const [filesToUpload, setFilesToUpload] = useState([]);

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variantId}/${id}`)
            .then(({ data }) => toast.success(data.message));
        setData(features.filter((item) => item._id !== id));
    }

    const imageSelectHandler = (image) => {
        setImage(image);
    }

    const uploadHandler = async (id) => {
        // if files not selected
        if (filesToUpload.length === 0) {
            showNotification("", "Please select files to upload", "warn");
            return;
        }

        const fd = new FormData();
        for (let i = 0; i < filesToUpload.length; i++) {
            fd.append("files", filesToUpload[i]);
        }

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/upload/${productId}/${variantId}/${id}`, fd, config)
                .then(({ data }) => {
                    if (data.success) {
                        showNotification("", data.message, "success");
                        setFilesToUpload([]);
                    }
                }).catch(err => showNotification("", err.response.data.message, "warn"));

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
            const features = data.product.variants.find((item) => item._id === variantId).features.map((v) => {
                v.id = v._id;
                return v;
            });
            setData(features);
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    }


    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        {
            field: "color_id.title", headerName: "Color", width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={styles.productListItem}>
                            <Image height={26} width={26}
                                className={styles.productListImg}
                                src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${params.row.color_id.image}`} />
                        </div>
                        {params.row.color_id.title}
                    </>
                )
            }
        },
        {
            field: "images", headerName: "Feature Images", width: 300,
            renderCell: (params) => {
                return (
                    <>
                        {params.row.images.map((item, index) => {
                            return (
                                <div key={index} className={styles.productListItem}>
                                    <Image height={26} width={26}
                                        className={styles.productListImg}
                                        src={`${process.env.NEXT_PUBLIC_thumbURL}/products/${item}`}
                                        onClick={() => imageSelectHandler(item)} />
                                </div>
                            )
                        })}
                    </>
                )
            }


        },
        { field: "quantity", headerName: "Quantity", width: 130 },
        { field: "sku", headerName: "SKU", width: 150 },
        {
            field: "upload", headerName: "Upload Images", width: 300,
            renderCell: (params) => {
                return (
                    <>
                        <Button variant="text" component="label" >
                            <input
                                style={{ background: '#00aaff' }}
                                type="file"
                                multiple
                                name="image"
                                className={styles.productListEdit}
                                onChange={(e) => setFilesToUpload(e.target.files)}
                                accept="image/webp, image/*"
                            />
                        </Button>
                        <CloudUploadOutlined className={styles.UploadIcon}
                            onClick={() => uploadHandler(params.row._id)}
                        />
                    </>
                )
            }
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link href={`/products/${productId}/${variantId}/update/${params.row._id}?size=${size}`}>
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
                <h2 className={styles.productTitle}>Variant ~ Features</h2>
                <Link href={`/products/${productId}/${variantId}/create?size=${size}`}>
                    <Button variant="contained"
                        color="primary" component="label"
                        className={styles.createNewLink}>Create New</Button>
                </Link>
            </div>
            <div className={styles.TitleProductAndSize}>
                <div>Product {`: `}<strong className={styles.productTitle}>
                    <Link href={`/products/${productId}`}>
                        {productTitle}
                    </Link>
                </strong>
                </div>
                <br />
                <div>Size<strong>{`: ${size}`}</strong></div>
            </div>

            <MuiGrid columns={columns} data={data} />
            <br /><br />
            {
                image &&
                <div style={{ width: '100%', height: '450px', border: '1px solid gray', justifyContent: 'center', display: 'flex' }}>
                    <Image height={400} width={700} src={`${process.env.NEXT_PUBLIC_uploadURL}/products/${image}`} />
                </div>
            }
            <br /><br />
        </div >
    );
}

export async function getServerSideProps(context) {
    const { productId, variantId, size } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);

    const features = data.product.variants.find((item) => item._id === variantId).features.map((v) => {
        v.id = v._id;
        return v;
    });

    return {
        props: {
            productId: data.product._id,
            variantId,
            productTitle: data.product.title,
            features,
            size
        },
    };
}