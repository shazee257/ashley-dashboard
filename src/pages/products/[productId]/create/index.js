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


export default function NewVariant({ product }) {
    const sizeRef = useRef(null);
    const salePriceRef = useRef(null);
    const purchasePriceRef = useRef(null);
    const [description, setDescription] = useState('');
    const [dimensions, setDimensions] = useState('');


    // clear form fields
    const clearForm = () => {
        sizeRef.current.value = '';
        salePriceRef.current.value = '';
        purchasePriceRef.current.value = '';
        setDescription('');
        setDimensions('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const variant = {
            size: sizeRef.current.value,
            sale_price: salePriceRef.current.value,
            purchase_price: purchasePriceRef.current.value,
            description,
            dimensions,
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}`, variant)
                .then(({ data }) => {
                    console.log(data);
                    data.success && showNotification("", data.message, 'success');
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            showNotification(err)
        };
    }

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '1400px' }}>
                    <Grid align='left'>
                        <h2>Add New Product Variant</h2>
                    </Grid>
                    <div className={styles.main}>
                        <h4 className={styles.productTitle}>Product Title: <i>{product.title}</i> </h4>
                    </div>
                    <br />
                    <form className={styles.MainForm}>
                        <div className={styles.FormTopFields}>
                            <TextField
                                className={styles.addProductItem}
                                label='Product Size' placeholder='Enter Product Size' variant='outlined'
                                inputRef={sizeRef}
                            />
                            <br /><br />
                            <TextField
                                inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                className={styles.addProductItem} variant='outlined'
                                label='Sale Price' placeholder='Enter Sale Price'
                                inputRef={salePriceRef}
                            />
                            <br /><br />
                            <TextField
                                inputProps={{ step: '0.01', min: '0', max: '100', type: 'number' }}
                                className={styles.addProductItem} variant='outlined' type='number'
                                label='Purchase Price' placeholder='Enter Purchase Price'
                                inputRef={purchasePriceRef}
                            />
                        </div>
                        <div className={styles.Editors}>
                            <div className={styles.Editor}>
                                <InputLabel htmlFor="description">Product Description</InputLabel>
                                <ReactQuill value={description} onChange={setDescription} />
                            </div>
                            <div className={styles.DimensionsEditor}>
                                <InputLabel htmlFor="dimensions">Product Dimensions</InputLabel>
                                <ReactQuill value={dimensions} onChange={setDimensions} />
                            </div>
                        </div>
                    </form>
                    <Button
                        onClick={handleSubmit}
                        type='submit'
                        color='primary'
                        variant="contained"
                        style={{ marginTop: '20px', width: '300px' }}
                    >
                        Add Variant
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
    const { productId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);

    return {
        props: {
            product: data.product
        },
    };
}