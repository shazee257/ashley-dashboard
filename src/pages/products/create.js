import styles from "styles/ProductNew.module.css";
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

export default function NewProduct({ stores, categories, brands }) {
    const [title, setTitle] = useState("");
    const [storeId, setStoreId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [isSizes, setIsSizes] = useState(false);
    const [isColors, setIsColors] = useState(false);

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

        if (!isColors && !isSizes) {
            showNotification("", "Please select at least one variation", "warn");
            return;
        }

        const productData = {
            title,
            store_id: storeId,
            category_id: categoryId,
            brand_id: brandId,
            isSizes,
            isColors,
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/products`, productData)
                .then(({ data }) => {
                    console.log(data);
                    data.success && showNotification("", data.message, "success");
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '400px' }}>
                    <Grid align='left'>
                        <h2>New Product</h2>
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
                            value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
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
                        <InputLabel>Select Product Variations</InputLabel>
                        <FormGroup className={styles.GroupCheckbox}>
                            <FormControlLabel
                                control={<Checkbox
                                    color="primary"
                                    checked={isSizes}
                                    onChange={(e) => setIsSizes(e.target.checked)} />}
                                label="Sizes" />
                            <FormControlLabel
                                control={<Checkbox
                                    color="primary"
                                    checked={isColors}
                                    onChange={(e) => setIsColors(e.target.checked)} />}
                                label="Colors" />
                        </FormGroup>
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="contained"
                            style={{ margin: '8px 0' }}
                            fullWidth>
                            Create Product
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

export const getServerSideProps = async () => {
    const storesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores`);
    const categoriesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories`);
    const brandsData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands`);

    return {
        props: {
            stores: storesData.data.stores,
            categories: categoriesData.data.categories,
            brands: brandsData.data.brands
        }
    }
}

