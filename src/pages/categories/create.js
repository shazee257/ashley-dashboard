import styles from "styles/CategoryNew.module.css";
import { useRef, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid, Paper, TextField, Button,
    Typography, Select, InputLabel,
    MenuItem, Checkbox,
    ListItemIcon, ListItemText,
} from '@mui/material';
import axios from 'axios';
import { showNotification } from "utils/helper";
import { MenuProps, useStyles, options } from "components/FilterOptions/FilterOptions";
import Link from "next/link";
import Image from "next/image";

export default function NewCategory({ categories }) {
    const [title, setTitle] = useState("");
    const [parentId, setParentId] = useState("");
    const [image, setImage] = useState("");
    const [filename, setFilename] = useState("Choose Image");
    const [selectedFile, setSelectedFile] = useState("");

    const classes = useStyles();
    const [selected, setSelected] = useState([]);
    const isAllSelected =
        options.length > 0 && selected.length === options.length;

    const handleChange = (event) => {
        const value = event.target.value;
        if (value[value.length - 1] === "all") {
            setSelected(selected.length === options.length ? [] : options);
            return;
        }
        setSelected(value);
    };

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
        setTitle("");
        setParentId("");
        setImage("");
        setSelected([]);
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', title);
        fd.append('parent_id', parentId);
        fd.append('attributes', selected);
        fd.append('image', selectedFile);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/categories`, fd, config)
                .then(({ data }) => {
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
                        <h2>New Category</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            className={styles.addProductItem}
                            label='Category Title'
                            placeholder='Enter Category Title'
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <br />
                        <InputLabel>Parent Category</InputLabel>
                        <Select fullWidth displayEmpty
                            label="Parent Category"
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}>
                            <MenuItem style={{ display: 'flex', justifyContent: 'left' }} value=""><em>None</em></MenuItem>
                            {categories.map((category) => (
                                <MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={category._id} key={category._id}>
                                    <div className={styles.productListItem}>
                                        <div style={{ marginRight: '10px' }}>
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
                        <InputLabel id="mutiple-select-label">Filter Attributes for Category's Products</InputLabel>
                        <Select
                            fullWidth
                            label="Filter Attributes for Category's Product"
                            labelId="mutiple-select-label"
                            multiple
                            maxRows={4}
                            value={selected}
                            onChange={handleChange}
                            renderValue={(selected) => selected.join(", ")}
                            MenuProps={MenuProps}
                        >
                            <MenuItem style={{ display: 'flex', justifyContent: 'left' }}
                                value="all"
                                classes={{ root: isAllSelected ? classes.selectedAll : "" }}>
                                <ListItemIcon>
                                    <Checkbox
                                        classes={{ indeterminate: classes.indeterminateColor }}
                                        checked={isAllSelected}
                                        indeterminate={selected.length > 0 && selected.length < options.length}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.selectAllText }}
                                    primary="Select All" />
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem style={{ display: 'flex', justifyContent: 'left' }} key={option} value={option}>
                                    <ListItemIcon>
                                        <Checkbox checked={selected.indexOf(option) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={option} />
                                </MenuItem>
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
                    {image &&
                        <Image src={image} height={400} width={400} className={styles.imgObject} />}
                </div>
                <div className={styles.imageButtonContainer}>
                    <div><small>Only jpg, png, gif, svg, webp images are allowed</small></div>
                    <Button className={styles.imageButton} variant="contained" component="label" >Choose Image
                        <input type="file" name="image" hidden onChange={fileSelectedHandler} accept="image/webp, image/*" />
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
