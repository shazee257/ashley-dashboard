import { useRef, useEffect } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Grid, Paper, Avatar, TextField, Typography, Link } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useRouter } from 'next/router'
import { showNotification } from "utils/helper";


const Login = () => {
    const router = useRouter();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        await axios.post(`${process.env.NEXT_PUBLIC_baseURL}/users/login`, user)
            .then(({ data }) => {
                if (data.success) {
                    localStorage.setItem("user", JSON.stringify({
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        email: data.user.email,
                        image: data.user.image,
                        role: data.user.role,
                    }));
                    localStorage.setItem("token", data.session.token);
                    router.push("/categories");
                }
            }).catch(err => showNotification(err));
    };

    const paperStyle = { padding: 20, width: 280, margin: "200px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }

    return (
        <>
            <Grid>
                <Paper elevation={10} style={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                        <h2>Sign In</h2>
                    </Grid>
                    <TextField
                        label='Email'
                        placeholder='Enter Email'
                        fullWidth
                        inputRef={emailRef}
                    />
                    <TextField
                        label='Password'
                        placeholder='Enter password'
                        type='password'
                        fullWidth
                        inputRef={passwordRef}
                    />
                    {/* <FormControlLabel control={<Checkbox name="checkedB" color="primary" />} label="Remember me" /> */}
                    <Button onClick={handleSubmit} color='primary' variant="contained" style={btnstyle} fullWidth >Sign in</Button>

                    <Typography >
                        <Link href="/forgotpassword" >
                            Forgot password ?
                        </Link>
                    </Typography>
                    {/* <Typography > Do you have an account ?
                        <Link href="/signup" >
                            Sign Up
                        </Link>
                    </Typography> */}
                </Paper>
            </Grid>
        </>
    )
}

export default Login
