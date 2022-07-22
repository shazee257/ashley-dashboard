import styles from "styles/CategoryNew.module.css";
import { useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography, Link, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";

export default function NewCategory({ categories }) {
    const titleRef = useRef(null);
    const parentIdRef = useRef(null);
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
        parentIdRef.current.value = "";
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', titleRef.current.value);
        fd.append('parent_id', parentIdRef.current.value);
        fd.append('image', selectedFile);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/categories`, fd, config)
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
                        <h2>New Category</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            className={styles.addProductItem}
                            label='Category Title'
                            placeholder='Enter Category Title'
                            fullWidth name="title"
                            inputRef={titleRef}
                        />
                        <br /><br />
                        <InputLabel>Parent Category</InputLabel>
                        <Select fullWidth displayEmpty
                            label="Parent Category"
                            inputRef={parentIdRef}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {categories.map((category) => (
                                <MenuItem value={category._id} key={category._id}>{category.title}</MenuItem>
                            ))}
                        </Select>
                        <br /><br />
                        <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={{ margin: '8px 0' }} fullWidth>Add Category</Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/categories">Back to Categories</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className="imageWithButton">
                <div className={styles.productImage}>
                    {(selectedFile) && (<img src={image} className={styles.imgObject}></img>)}
                </div>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button className={styles.imageButton} variant="contained" component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/*" />
                    </Button>
                </div>
            </div>
        </div >
    );
}

export const getServerSideProps = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/categories`);
    return {
        props: {
            categories: data.categories
        }
    };
}
