import styles from "styles/BrandUpdate.module.css";
import { useEffect, useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import { useRouter } from 'next/router';
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from 'next/link';
import Image from "next/image";

export default function UpdateBrand({ slider }) {
    const router = useRouter();
    const titleRef = useRef(null);
    const subTitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [image, setImage] = useState(slider.image);
    const [img_address, setImg_address] = useState("");
    const [filename, setFilename] = useState("Choose Image");

    useEffect(() => {
        titleRef.current.value = slider.title;
        subTitleRef.current.value = slider.sub_title;
        descriptionRef.current.value = slider.description;
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
                .post(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${slider._id}/upload`, fd, config)
                .then(({ data }) => toast.success(data.message))
                .catch((err) => {
                    let message = err.response ? err.response.data.message : "Only image files are allowed!";
                    toast.error(message)
                });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateSlider = {
            title: titleRef.current.value,
            sub_title: subTitleRef.current.value,
            description: descriptionRef.current.value,
        };

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${slider._id}`, updateSlider)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    router.push('/sliders');
                }).catch(err => showNotification(err));
        } catch (error) {
            toast.error("Slider Content is not updated, please try again", error);
        }
    };

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ width: '400px', padding: '20px' }} >
                    <Grid align='left'>
                        <h2>Update Slider Content</h2>
                    </Grid>
                    <br />
                    <TextField
                        className={styles.addProductItem}
                        label='Title'
                        placeholder='Enter Title'
                        fullWidth
                        inputRef={titleRef} />
                    <br />
                    <TextField
                        className={styles.addProductItem}
                        label='Sub-Title'
                        placeholder='Enter Sub-Title'
                        fullWidth
                        inputRef={subTitleRef} />
                    <br />
                    <TextField
                        className={styles.addProductItem}
                        label='Description'
                        placeholder="Slider Description"
                        fullWidth multiline maxRows={5}
                        inputRef={descriptionRef} />
                    <br /><br />

                    <div className={styles.addProductItem}>
                        <Button variant="contained" component="label" >Choose Image
                            <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                        </Button>
                        <div><small>Only jpg, png, gif, svg images are allowed</small></div>
                    </div>
                    <br />
                    <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" className={styles.btnstyle} fullWidth>Update Slider Content</Button>
                    <br /><br />
                    <Typography >
                        <Link href="/sliders">Back to Slider Contents</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className={styles.productImage}>
                <Image height={400} width={400} className={styles.imgObject}
                    src={img_address ? img_address : `${process.env.NEXT_PUBLIC_uploadURL}/slider/${image}`}
                />
            </div>
            <br />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { sliderId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/sliders/${sliderId}`);
    return {
        props: {
            slider: data.slider
        }
    };
}