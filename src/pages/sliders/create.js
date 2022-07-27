import styles from "styles/SliderNew.module.css";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";

export default function NewSlider() {
    const titleRef = useRef(null);
    const subTitleRef = useRef(null);
    const descriptionRef = useRef(null);

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
        subTitleRef.current.value = "";
        descriptionRef.current.value = "";
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', titleRef.current.value);
        fd.append('sub_title', subTitleRef.current.value);
        fd.append('description', descriptionRef.current.value);
        fd.append('image', selectedFile);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/sliders`, fd, config)
                .then(({ data }) => {
                    data.success && toast.success(data.message);
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
                        <h2>New Slider Content</h2>
                    </Grid>
                    <br />
                    <form encType='multipart/form-data'>
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
                            <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                        </div>
                        <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={{ margin: '8px 0' }} fullWidth>Add Slider Content</Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/sliders">Back to Slider</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className={styles.productImage}>
                {(selectedFile) && (<img src={image} className={styles.imgObject}></img>)}
            </div>
        </div>
    );
}
