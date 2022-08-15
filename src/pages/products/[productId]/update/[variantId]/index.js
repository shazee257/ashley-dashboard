import styles from "styles/VariantCreate.module.css";
import { useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, InputLabel } from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';


export default function NewVariant({ product, variant }) {
    const [size, setSize] = useState(variant.size);
    const [salePrice, setSalePrice] = useState(variant.sale_price);
    const [purchasePrice, setPurchasePrice] = useState(variant.purchase_price);
    const [description, setDescription] = useState(variant.description);
    const [dimensions, setDimensions] = useState(variant.dimensions);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const variantData = {
            size,
            sale_price: salePrice,
            purchase_price: purchasePrice,
            description,
            dimensions,
        }

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}/${variant._id}`, variantData)
                .then(({ data }) => {
                    data.success && showNotification("", data.message, 'success');
                }).catch(err => showNotification("", err.response.data.message, "error"));
        } catch (error) {
            showNotification(err)
        };
    }

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '1400px' }}>
                    <Grid align='left'>
                        <h2>Update Product Variant</h2>
                    </Grid>
                    <div className={styles.main}>
                        <h4 className={styles.productTitle}>Product Title: <i>{product.title}</i> </h4>
                    </div>
                    <br />
                    <form className={styles.MainForm}>
                        <div className={styles.FormTopFields}>
                            <TextField
                                className={styles.addProductItem}
                                label='Product Size'
                                placeholder='Enter Product Size'
                                variant='outlined'
                                value={size} onChange={(e) => setSize(e.target.value)} />
                            <br /><br />
                            <TextField
                                inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                className={styles.addProductItem} variant='outlined'
                                label='Sale Price' placeholder='Enter Sale Price'
                                value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                            <br /><br />
                            <TextField
                                inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                className={styles.addProductItem} variant='outlined' type='number'
                                label='Purchase Price' placeholder='Enter Purchase Price'
                                value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
                        </div>
                        <div className={styles.Editors}>
                            <div className={styles.Editor}>
                                <InputLabel htmlFor="detail1">Description</InputLabel>
                                <ReactQuill value={description} onChange={setDescription} />
                            </div>
                            <div className={styles.DimensionsEditor}>
                                <InputLabel htmlFor="detail1">Dimensions</InputLabel>
                                <ReactQuill value={dimensions} onChange={setDimensions} />
                            </div>
                        </div>
                    </form>
                    <Button
                        onClick={handleSubmit}
                        type='submit'
                        color='primary'
                        variant="contained"
                        style={{ marginTop: '20px', width: '300px' }}>
                        Update
                    </Button>
                    <br /><br />
                    <Typography >
                        <Link href={`/products/${product._id}`}>Back to Product Variants</Link>
                    </Typography>
                </Paper>
            </Grid>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { productId, variantId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
    const variant = data.product.variants.find(variant => variant._id === variantId);

    return {
        props: {
            product: data.product,
            variant
        },
    };
}