import styles from "styles/BrandNew.module.css";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@mui/material'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";
import Image from "next/image";

export default function NewColor() {
    const titleRef = useRef(null);
    const [image, setImage] = useState("");
    const [filename, setFilename] = useState("Choose Image");
    const [selectedFile, setSelectedFile] = useState("");

    const fileSelectedHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) setImage(reader.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const clearForm = () => {
        titleRef.current.value = "";
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', titleRef.current.value);
        fd.append('image', image);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/colors`, fd, config)
                .then(({ data }) => {
                    data.success && toast.success(data.message);
                    // clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            let message = error.response ? error.response.data.message : "Only image files are allowed!";
            toast.error(message);
        }
    };

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '600px', display: 'flex' }}>
                    <Grid align='left' style={{ width: '300px' }}>
                        <h2>New Color for Product</h2>

                        <br />
                        <form encType='multipart/form-data'>
                            <TextField
                                className={styles.addProductItem}
                                label='Color Title'
                                placeholder='Enter Color Title'
                                inputRef={titleRef} />
                            <br /><br />
                            <div>
                                <Button
                                    variant="outlined" component="label" >
                                    <input type="file" name="image" onChange={fileSelectedHandler} accept="image/*" />
                                </Button>
                                <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                            </div>
                            <br />
                            <Button
                                onClick={handleSubmit}
                                type='submit'
                                color='primary'
                                variant="outlined"
                                fullWidth>
                                Add Color
                            </Button>
                        </form>
                        <br />
                        <Typography >
                            <Link href="/colors">Back to Product Colors</Link>
                        </Typography>
                    </Grid>
                    <Grid align='right' style={{ width: '300px', marginTop: '120px', }}>
                        {(image) && <Image height={200} width={200} src={image} style={{ borderRadius: '50%', }} />}
                    </Grid>
                </Paper>
            </Grid>


        </div>

    );
}
