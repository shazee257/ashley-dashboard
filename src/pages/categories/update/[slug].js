import styles from "styles/CategoryUpdate.module.css";
import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from "utils/helper";
import Image from 'next/image';
import Link from 'next/link';

export default function UpdateCategory({ category, categories }) {
    const router = useRouter();

    const [title, setTitle] = useState(category.title)
    const [parentId, setParentId] = useState(category.parent_id);
    const [image, setImage] = useState(category.image);
    const [img_address, setImg_address] = useState("");
    const [filename, setFilename] = useState("Choose Image");

    const fileSelectedHandler = async (e) => {
        if (e.target.value) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImg_address(reader.result);
                };
            }
            reader.readAsDataURL(e.target.files[0]);
            setFilename(e.target.files[0].name);

            const fd = new FormData();
            fd.append('image', e.target.files[0]);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/categories/upload-image/${category.slug}`, fd, config)
                .then(({ data }) => toast.success(data.message))
                .catch((err) => {
                    let message = err.response ? err.response.data.message : "Only image files are allowed!";
                    toast.error(message)
                });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateCategory = {
            title,
            parent_id: parentId
        };

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/categories/${category.slug}`, updateCategory)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    router.push("/categories");
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = err.response ? err.response.data.message : "Something went wrong!";
            toast.error(message);
        }
    };

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '400px' }}>
                    <Grid align='left'>
                        <h2>Update Category</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            className={styles.addProductItem}
                            label='Category Title'
                            placeholder='Enter Category Title'
                            fullWidth
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                        <br /><br />
                        <InputLabel>Parent Category</InputLabel>
                        <Select fullWidth displayEmpty
                            label="Parent Category"
                            value={parentId} onChange={(e) => setParentId(e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem value={category._id} key={category._id}>
                                    <div className={styles.productListItem}>
                                        <div className={styles.productListItem}>
                                            <Image height={32} width={32}
                                                className={styles.productListImg}
                                                src={`${process.env.NEXT_PUBLIC_thumbURL}/categories/${category.image}`} />
                                        </div>
                                        {category.title}
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <Button onClick={handleSubmit} type='submit'
                            color='primary' variant="contained"
                            style={{ margin: '8px 0' }} fullWidth>Update Category</Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/categories">Back to Categories</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className="imageWithButton">
                <div className={styles.productImage}>
                    <Image height={400} width={400}
                        src={img_address ? img_address : `${process.env.NEXT_PUBLIC_uploadURL}/categories/${category.image}`}
                    />
                </div>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button className={styles.imageButton} variant="contained" component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.query;
    const categoryData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories/c/${slug}`);
    const categoriesData = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories`);

    console.log("categoryData", categoryData.data.category);
    // console.log("categoriesData", categoriesData.data.categories);

    return {
        props: {
            category: categoryData.data.category,
            categories: categoriesData.data.categories
        }
    };
}