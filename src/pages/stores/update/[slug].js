import styles from "styles/StoreUpdate.module.css";
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import { useRouter } from "next/router";
import { showNotification } from "utils/helper";
import Image from 'next/image';
import Link from "next/link";

export default function UpdateStore({ store }) {
    const router = useRouter();

    const [title, setTitle] = useState(store.title);
    const [email, setEmail] = useState(store.email);
    const [phone_no, setPhone_no] = useState(store.phone_no);
    const [address, setAddress] = useState(store.address);
    const [city, setCity] = useState(store.city);
    const [state, setState] = useState(store.state);
    const [country, setCountry] = useState(store.country);
    const [zip, setZip] = useState(store.zip);
    const [image, setImage] = useState(store.banner);

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
            fd.append('banner', e.target.files[0]);

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/stores/upload-image/${store.slug}`, fd, config)
                .then(({ data }) => toast.success(data.message))
                .catch(err => showNotification(err));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storeData = { title, email, phone_no, address, city, state, country, zip };

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/stores/${store.slug}`, storeData)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    router.push("/stores");
                }).catch((err) => {
                    let message = err.response ? err.response.data.message : "Something went wrong!";
                    toast.error(message)
                });
        } catch (error) {
            toast.error("brand is not updated, please try again", error);
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Phone No'
                            placeholder='Enter Phone #'
                            value={phone_no}
                            onChange={(e) => setPhone_no(e.target.value)} />
                        <br />
                        <TextField
                            className={styles.addProductItem}
                            label='Address'
                            placeholder="Store Address"
                            fullWidth multiline maxRows={5}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='City'
                            placeholder='Enter City'
                            value={city}
                            onChange={(e) => setCity(e.target.value)} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='State'
                            placeholder='Enter State'
                            value={state}
                            onChange={(e) => setState(e.target.value)} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Zip Code'
                            placeholder='Enter Zip Code'
                            value={zip}
                            onChange={(e) => setZip(e.target.value)} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Country'
                            placeholder='Enter Country'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)} />
                        <br /><br />
                        <Button onClick={handleSubmit} type='submit' color='primary' variant="contained" style={{ margin: '8px 0' }} fullWidth>Update Store</Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/stores">Back to Stores</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className={styles.imageWithButton}>
                <div className={styles.productImage}>
                    {(!image && !img_address) ?
                        (<Image height={400} width={400} className={styles.imgObject}
                            src={`${process.env.NEXT_PUBLIC_uploadURL}/stores/store.png`} />) :
                        (<Image height={400} width={400} className={styles.imgObject}
                            src={(image != '' && !img_address) ? `${process.env.NEXT_PUBLIC_uploadURL}/stores/${store.banner}` : (img_address)}
                        />)
                    }
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
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/stores/${slug}`);
    return {
        props: {
            store: data.store
        }
    };
}

