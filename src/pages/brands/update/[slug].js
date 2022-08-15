import styles from "styles/BrandUpdate.module.css";
import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router';
import axios from 'axios';
import { showNotification } from "utils/helper";
import Image from 'next/image';
import Link from 'next/link';

export default function UpdateBrand({ brand }) {
    const router = useRouter();
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [image, setImage] = useState("");
    const [img_address, setImg_address] = useState("");
    const [filename, setFilename] = useState("Choose Image");

    useEffect(() => {
        titleRef.current.value = brand.title;
        descriptionRef.current.value = brand.description;
        setImage(brand.image);
    }, []);

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
                .post(`${process.env.NEXT_PUBLIC_baseURL}/brands/upload-image/${brand.slug}`, fd, config)
                .then(({ data }) => toast.success(data.message))
                .catch((err) => {
                    let message = err.response ? err.response.data.message : "Only image files are allowed!";
                    toast.error(message)
                });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateBrand = {
            title: titleRef.current.value,
            description: descriptionRef.current.value,
        };

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/brands/${brand.slug}`, updateBrand)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    router.push('/brands');
                }).catch(err => showNotification(err));
        } catch (error) {
            toast.error("brand is not updated, please try again", error);
        }
    };

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ width: '400px', padding: '20px' }} >
                    <Grid align='left'>
                        <h2>Update Brand</h2>
                    </Grid>
                    <br />
                    <TextField
                        className={styles.addProductItem}
                        label='Brand Title'
                        placeholder='Enter Brand Title'
                        fullWidth
                        inputRef={titleRef}
                    />
                    <br />
                    <TextField
                        className={styles.addProductItem}
                        label='Description'
                        placeholder="Description"
                        fullWidth multiline maxRows={5}
                        inputRef={descriptionRef}
                    />
                    <br />
                    <div>
                        <Button variant="contained" component="label">Choose Image
                            <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                        </Button>
                        <div><small>Only jpg, png, gif, svg images are allowed</small></div>
                    </div>
                    <br />
                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        type='submit'
                        color='primary'
                        variant="contained"
                        className={styles.btnstyle}>Update Brand</Button>
                    <br /><br />
                    <Typography >
                        <Link href="/brands">Back to Brands</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className={styles.productImage}>
                <Image height={400} width={400}
                    src={img_address ? img_address : `${process.env.NEXT_PUBLIC_uploadURL}/brands/${image}`}
                />
            </div>
            <br />
        </div>
    );

}

export async function getServerSideProps(context) {
    const { slug } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/brands/${slug}`);
    return {
        props: {
            brand: data.brand
        }
    };
}