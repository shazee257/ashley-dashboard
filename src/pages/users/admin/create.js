import styles from "styles/UserAdminCreate.module.css";
import { useState, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Paper, TextField, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import { showNotification } from "utils/helper";
import Link from "next/link";

export default function NewUser() {
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNoRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

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
        firstNameRef.current.value = "";
        lastNameRef.current.value = "";
        emailRef.current.value = "";
        phoneNoRef.current.value = "";
        passwordRef.current.value = "";
        confirmPasswordRef.current.value = "";
        setImage("");
        setFilename("Choose Image");
        setSelectedFile("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("image", selectedFile);
        fd.append("first_name", firstNameRef.current.value);
        fd.append("last_name", lastNameRef.current.value);
        fd.append("email", emailRef.current.value);
        fd.append("role", "admin");
        fd.append("phone_no", phoneNoRef.current.value);
        fd.append("password", passwordRef.current.value);
        fd.append("confirm_password", confirmPasswordRef.current.value);

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }

        try {
            await axios
                .post(`${process.env.NEXT_PUBLIC_baseURL}/users/register`, fd, config)
                .then(({ data }) => {
                    console.log(data);
                    data.success && toast.success(data.message);
                    clearForm();
                }).catch(err => showNotification(err));
        } catch (error) {
            showNotification(err)
        };
    }

    return (
        <div className={styles.main}>
            <Grid>
                <Paper elevation={0} style={{ padding: '20px', width: '400px' }}>
                    <Grid align='left'>
                        <h2>Create a New Admin User</h2>
                    </Grid>
                    <br />
                    <form encType='multipart/form-data'>
                        <TextField
                            className={styles.addProductItem}
                            label='First Name' placeholder='Enter First Name'
                            inputRef={firstNameRef}
                        />
                        <br />
                        <TextField
                            className={styles.addProductItem}
                            label='Last Name' placeholder='Enter Last Name'
                            inputRef={lastNameRef}
                        />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Email' placeholder='Enter Email'
                            inputRef={emailRef} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Phone #'
                            placeholder='Enter Phone #'
                            inputRef={phoneNoRef} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Password' placeholder='Enter Password'
                            type='password'
                            inputRef={passwordRef} />
                        <br />
                        <TextField className={styles.addProductItem}
                            label='Confirm Password' placeholder='Enter Password again'
                            type='password'
                            inputRef={confirmPasswordRef} />
                        <br />
                        <br /><br />
                        <Button
                            onClick={handleSubmit}
                            type='submit'
                            color='primary'
                            variant="contained"
                            style={{ margin: '8px 0' }}
                            fullWidth>
                            Create
                        </Button>
                    </form>
                    <br />
                    <Typography >
                        <Link href="/users/admin">Back to Admin Users</Link>
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
