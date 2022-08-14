import styles from "styles/VariantFeatureNew.module.css";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem, Checkbox, FormGroup, FormControlLabel,
} from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";

export default function ProductFeatureNew({ productId, variantId, productTitle, feature, colors, size }) {
    const [colorId, setColorId] = useState(feature.color_id._id);
    const [quantity, setQuantity] = useState(feature.quantity);
    const [sku, setSku] = useState(feature.sku);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!colorId || !quantity || !sku) {
            showNotification("", "Please fill all fields", "warn");
            return;
        }

        const featureData = {
            color_id: colorId,
            quantity: quantity,
            sku: sku,
        };

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${productId}/${variantId}/${feature._id}`, featureData)
                .then(({ data }) => {
                    data.success && showNotification("", data.message, "success");
                }).catch(err => showNotification("", err.response.data.message, "warn"));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    return (
        <div className={styles.productList}>
            <div className={styles.main}>
                <div style={{ marginLeft: '20px' }}>
                    <Grid align='left'>
                        <h2>Update Variant Feature</h2>
                    </Grid>
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

                </div>
                <br />
                <hr />

                <Grid className={styles.mainGrid}>
                    <Paper elevation={0} style={{ padding: '20px', width: '400px' }}>
                        <form>
                            <InputLabel>Select Color</InputLabel>
                            <Select
                                fullWidth
                                label="Color"
                                value={colorId}
                                onChange={(e) => setColorId(e.target.value)}>
                                {colors.map((c) => (
                                    <MenuItem value={c._id} key={c._id}>
                                        <div className={styles.productListItem}>
                                            <div className={styles.ImageDiv}>
                                                <Image height={32} width={32}
                                                    className={styles.productListImg}
                                                    src={`${process.env.NEXT_PUBLIC_uploadURL}/colors/${c.image}`} />
                                            </div>
                                            {c.title}
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                            <br /><br />
                            <TextField
                                fullWidth
                                inputProps={{ step: '1', min: '1', max: '1000', type: 'number' }}
                                className={styles.addProductItem}
                                label='Quantity' placeholder='Enter Quantity' variant='outlined'
                                value={quantity} onChange={(e) => setQuantity(e.target.value)}
                            />
                            <br /><br />
                            <TextField
                                fullWidth
                                required
                                className={styles.addProductItem} variant='outlined'
                                label='sku' placeholder='Enter SKU'
                                value={sku} onChange={(e) => setSku(e.target.value)}
                            />
                            <br /><br />
                            <Button
                                fullWidth
                                onClick={handleSubmit}
                                type='submit'
                                color='primary'
                                variant="contained">
                                Update Variant Feature
                            </Button>
                        </form>
                        <br /><br />
                        <Typography >
                            <Link href={`/products/${productId}/${variantId}?size=${size}`}>Back to Variant Features</Link>
                        </Typography>
                    </Paper>
                </Grid>
            </div>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const { productId, variantId, featureId, size } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
    const colorData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/colors`);


    const feature = data.product.variants.find(v => v._id.toString() === variantId)
        .features.find(f => f._id.toString() === featureId);

    console.log(feature);

    return {
        props: {
            colors: colorData.data.colors,
            productId,
            variantId,
            feature,
            size,
            productTitle: data.product.title
        }
    }
}

