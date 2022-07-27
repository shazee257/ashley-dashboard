import styles from "styles/UserAdminUpdate.module.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import { useRouter } from 'next/router';
import axios from 'axios';
import { showNotification } from "utils/helper";
import Image from 'next/image';
import Link from "next/link";

export default function UpdateBrand(props) {
    const router = useRouter();

    const initialProps = {
        first_name: props.user.first_name,
        last_name: props.user.last_name,
        email: props.user.email,
        phone_no: props.user.phone_no,
        password: "",
        confirm_password: "",
    }

    const [user, setUser] = useState(initialProps);

    const [image, setImage] = useState(props.user.image || "");
    const [filename, setFilename] = useState("Choose Image");
    const [img_address, setImg_address] = useState("");

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
                .post(`${process.env.NEXT_PUBLIC_baseURL}/users/${props.user._id}/upload-image`, fd, config)
                .then(({ data }) => data.success && toast.success(data.message))
                .catch(err => showNotification(err));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userObj = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_no: user.phone_no,
            password: user.password,
            confirm_password: user.confirm_password,
        }

        const config = {
            headers: { 'Content-Type': 'application/json' }
        }

        try {
            await axios
                .put(`${process.env.NEXT_PUBLIC_baseURL}/users/${props.user._id}`, userObj, config)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    router.push("/users/admin");
                }).catch(err => showNotification(err));
        } catch (err) {
            showNotification(err)
        };
    };


    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ width: '400px', padding: '20px' }} >
                    <Grid align='left'>
                        <h2>Update Admin User</h2>
                    </Grid>
                    <br />
                    <form>
                        <TextField
                            className={styles.addProductItem}
                            label='First Name' placeholder='Enter First Name'
                            value={user.first_name} onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                        />
                        <br />
                        <TextField
                            className={styles.addProductItem}
                            label='Last Name' placeholder='Enter Last Name'
                            value={user.last_name} onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                        />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Email' placeholder='Enter Email'
                            value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Phone #'
                            placeholder='Enter Phone #'
                            value={user.phone_no} onChange={(e) => setUser({ ...user, phone_no: e.target.value })}
                        />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Password' placeholder='Enter Password'
                            type="password"
                            value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Confirm Password' placeholder='Enter Password again'
                            type="password"
                            value={user.confirm_password} onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
                        />
                        <br />
                        <br /><br />
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="contained"
                            style={{ margin: '8px 0' }}
                            fullWidth>
                            Update
                        </Button>
                    </form>
                    <br /><br />
                    <Typography >
                        <Link href="/users/admin">Back to Admin Users</Link>
                    </Typography>
                </Paper>
            </Grid>
            <div className="imageWithButton">
                <div className={styles.productImage}>
                    <Image height={400} width={400}
                        className={styles.imgObject}
                        src={(img_address ? img_address : `${process.env.NEXT_PUBLIC_uploadURL}/users/${props.user.image}`)} />
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
    const { userId } = context.query;
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/users/${userId}`);

    return {
        props: {
            user: data.user
        }
    };
}