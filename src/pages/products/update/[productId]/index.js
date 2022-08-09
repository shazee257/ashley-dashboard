import styles from "styles/ProductUpdate.module.css";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem
} from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";

export default function ProductUpdate({ stores, categories, brands, product }) {
    const [title, setTitle] = useState(product.title);
    const [storeId, setStoreId] = useState(product.store_id._id);
    const [categoryId, setCategoryId] = useState(product.category_id._id);
    const [brandId, setBrandId] = useState(product.brand_id._id);
    const [attributes, setAttributes] = useState([product.category_id.attributes]);

    // clear form fields
    const clearForm = () => {
        setTitle("");
        setStoreId("");
        setCategoryId("");
        setBrandId("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !storeId || !categoryId || !brandId) {
            showNotification("", "Please fill all fields", "warn");
            return;
        }

        const productData = {
            title,
            store_id: storeId,
            category_id: categoryId,
            brand_id: brandId,
        }

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/products/${product._id}`, productData)
                .then(({ data }) => {
                    data.success && showNotification("", data.message, "success");
                    // clearForm();
                }).catch(err => showNotification("", err.response.data.message, "warn"));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    const categorySelectHandler = async (e) => {
        setCategoryId(e.target.value);
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/${e.target.value}`);
        setAttributes(data.category.attributes);
    }

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '400px' }}>
                    <Grid align='left'>
                        <h2>Update Product Information</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            fullWidth
                            className={styles.addProductItem}
                            label='Product Title' placeholder='Enter Product Name'
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                        <br /><br />
                        <InputLabel>Select Store</InputLabel>
                        <Select fullWidth
                            value={storeId} onChange={(e) => setStoreId(e.target.value)}>
                            {stores.map((store) => (
                                <MenuItem value={store._id} key={store._id}>
                                    <div className={styles.ImageWithTitle}>
                                        <div className={styles.productListItem}>
                                            <Image height={32} width={32}
                                                className={styles.productListImg}
                                                src={`${process.env.NEXT_PUBLIC_thumbURL}/stores/${store.banner}`} />
                                        </div>
                                        {store.title}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <InputLabel>Select Category</InputLabel>
                        <Select fullWidth
                            value={categoryId} onChange={categorySelectHandler}>
                            {categories.map((category) => (
                                <MenuItem value={category._id} key={category._id}>
                                    <div className={styles.ImageWithTitle}>
                                        <div className={styles.productListItem}>
                                            {category.image &&
                                                <Image height={32} width={32}
                                                    className={styles.productListImg}
                                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />}
                                        </div>
                                        {category.title}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        {attributes.length > 0 &&
                            <div>
                                <InputLabel>Attributes Selected</InputLabel>
                                <TextField
                                    fullWidth aria-disabled="true"
                                    className={styles.addProductItem}
                                    value={attributes}
                                />
                                <br /><br />
                            </div>}
                        <InputLabel>Select Brand</InputLabel>
                        <Select fullWidth
                            value={brandId} onChange={(e) => setBrandId(e.target.value)}>
                            {brands.map((brand) => (
                                <MenuItem value={brand._id} key={brand._id}>
                                    <div className={styles.ImageWithTitle}>
                                        <div className={styles.productListItem}>
                                            {brand.image &&
                                                <Image height={32} width={32}
                                                    className={styles.productListImg}
                                                    src={`${process.env.NEXT_PUBLIC_thumbURL}/brands/${brand.image}`} />}
                                        </div>
                                        {brand.title}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="contained"
                            style={{ margin: '8px 0' }}
                            fullWidth>
                            Update
                        </Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/products">Back to Products</Link>
                    </Typography>
                </Paper>
            </Grid>
        </div >
    );
}

export const getServerSideProps = async (context) => {
    const { productId } = context.query;
    const productData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/products/p/${productId}`);
    const storesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
    const categoriesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories`);
    const brandsData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands`);

    return {
        props: {
            stores: storesData.data.stores,
            categories: categoriesData.data.categories,
            brands: brandsData.data.brands,
            product: productData.data.product,
        }
    }
}

