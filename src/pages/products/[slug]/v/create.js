import styles from "styles/UserAdminCreate.module.css";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import { useRouter } from "next/router";


export default function NewVariant({ product }) {
    const sizeRef = useRef(null);
    const salePriceRef = useRef(null);
    const purchasePriceRef = useRef(null);
    const detail1Ref = useRef(null);
    const detail2Ref = useRef(null);

    const router = useRouter();
    const { slug } = router.query;

    // clear form fields
    const clearForm = () => {
        sizeRef.current.value = '';
        salePriceRef.current.value = '';
        purchasePriceRef.current.value = '';
        detail1Ref.current.value = '';
        detail2Ref.current.value = '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const variant = {
            size: sizeRef.current.value,
            sale_price: salePriceRef.current.value,
            purchase_price: purchasePriceRef.current.value,
            detail1: detail1Ref.current.value,
            detail2: detail2Ref.current.value,
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
                <Paper elevation={0} style={{ padding: '20px', width: '400px' }}>
                    <Grid align='left'>
                        <h2>Add New Product Variant</h2>
                    </Grid>
                    <div className={styles.main}>
                        <h4 className={styles.productTitle}>Product Title: <i>{product.title}</i> </h4>
                    </div>
                    <br />
                    <form>
                        <TextField
                            className={styles.addProductItem}
                            label='Product Size' placeholder='Enter Product Size' variant='outlined'
                            inputRef={sizeRef}
                        />
                        <br /><br />
                        <TextField
                            className={styles.addProductItem} variant='outlined'
                            label='Sale Price' placeholder='Enter Sale Price'
                            inputRef={salePriceRef}
                        />
                        <br /><br />
                        <TextField
                            className={styles.addProductItem} variant='outlined'
                            label='Purchase Price' placeholder='Enter Purchase Price'
                            inputRef={purchasePriceRef}
                        />
                        <br /><br />
                        <TextField className={styles.addProductItem} variant='outlined'
                            label='Description' placeholder='Enter Description'
                            inputRef={detail1Ref} />
                        <br /><br />
                        <TextField className={styles.addProductItem} variant='outlined'
                            label='Dimension' placeholder='Dimensions'
                            inputRef={detail2Ref} />
                        <br /><br />
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="contained"
                            style={{ margin: '8px 0' }}
                            fullWidth>
                            Add Variant
                        </Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href={`/products/${slug}`}>Back to Product</Link>
                    </Typography>
                </Paper>
            </Grid>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/${slug}`);

    return {
        props: {
            product: data.product
        },
    };
}