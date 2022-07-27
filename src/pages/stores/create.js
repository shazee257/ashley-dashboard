import styles from "styles/StoreNew.module.css";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";

export default function NewStore() {
    const storeObj = {
        title: '',
        email: '',
        phone_no: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    }

    const [store, setStore] = useState(storeObj);
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

    // clear form fields
    const clearForm = () => {
        setStore(storeObj);
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', store.title);
        fd.append('email', store.email);
        fd.append('phone_no', store.phone_no);
        fd.append('address', store.address);
        fd.append('city', store.city);
        fd.append('state', store.state);
        fd.append('zip', Number(store.zip));
        fd.append('country', store.country);
        fd.append('banner', selectedFile);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/stores`, fd, config)
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
                        <h2>New Store / Franchise</h2>
                    </Grid>
                    <br />
                    <form encType='multipart/form-data'>
                        <TextField className={styles.addProductItem}
                            label='Store Name'
                            placeholder='Enter Store Name'
                            value={store.title}
                            onChange={(e) => setStore({ ...store, title: e.target.value })} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Email'
                            placeholder='Enter Email'
                            value={store.email}
                            onChange={(e) => setStore({ ...store, email: e.target.value })} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Phone No'
                            placeholder='Enter Phone #'
                            value={store.phone_no}
                            onChange={(e) => setStore({ ...store, phone_no: e.target.value })} />
                        <br />
                        <TextField
                            className={styles.addProductItem}
                            label='Address'
                            placeholder="Store Address"
                            fullWidth multiline maxRows={5}
                            value={store.address}
                            onChange={(e) => setStore({ ...store, address: e.target.value })} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='City'
                            placeholder='Enter City'
                            value={store.city}
                            onChange={(e) => setStore({ ...store, city: e.target.value })} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='State'
                            placeholder='Enter State'
                            value={store.state}
                            onChange={(e) => setStore({ ...store, state: e.target.value })} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Zip Code'
                            placeholder='Enter Zip Code'
                            value={store.zip}
                            onChange={(e) => setStore({ ...store, zip: e.target.value })} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Country'
                            placeholder='Enter Country'
                            value={store.country}
                            onChange={(e) => setStore({ ...store, country: e.target.value })} />
                        <br /><br />
                        <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={{ margin: '8px 0' }} fullWidth>Add New Store</Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/stores">Back to Stores</Link>
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
        </div>
    );
}
