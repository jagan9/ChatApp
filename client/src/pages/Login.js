import { Paper, Container, TextField, Button } from '@material-ui/core'
import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../Media/logo1.jpg';
import { Redirect } from 'react-router-dom';

function Login(props) {

    const [email, setEmail] = React.useState("");
    const [loader, setLoader] = React.useState(false);
    const [emailerror, setEmailerror] = React.useState(null);
    const [passerror, setPasserror] = React.useState(null);
    const [password, setPassword] = React.useState("");

    const submit = () => {
        setLoader(1);
        let validData = true;

        if (email.length === 0) {
            validData = false;
            setEmailerror("email required");
            setLoader(0)
            return;
        } else {
            if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
                validData = true;
                setEmailerror(null);
            } else {
                validData = false;
                setEmailerror("enter valid email")
                setLoader(0)
                return;
            }
        }

        if (password.length < 4) {
            validData = false;

            setPasserror("must be 5 characters");
            setLoader(0)
            return;
        } else {
            validData = true;
            setPasserror(null);
        }

        if (validData) {
            const userDetails = {
                email: email,
                password: password
            };
            props.LoginUser(userDetails, () => { setLoader(0) });
        }

    }

    return (
        <Container data-aos="zoom-in-up" style={{
            marginTop: "50px",
            maxWidth: "500px",
            textAlign: "center",
            zIndex: "1"
        }}
        >
            <Paper style={{
                padding: "10px 20px 40px 20px", backgroundColor: "rgba(255,255,255,0.3)"
            }}
                elevation={3}>
                <img
                    alt="logo"
                    style={{
                        objectFit: "cover",
                        height: "70px",
                        paddingTop: "20px"
                    }}
                    src={logo1} />
                <TextField error={emailerror !== null} onChange={(e) => setEmail(e.target.value)} value={email} helperText={emailerror} style={{ marginBottom: "10px" }} fullWidth label="enter email" margin="normal" />
                <TextField error={passerror !== null} helperText={passerror} onChange={(e) => setPassword(e.target.value)} value={password} fullWidth type="password" label="enter password" /><br /><br />
                <div>{props.data.userError && <p style={{ color: "red" }}>Invalid Credentials</p>}</div>
                <Button onClick={() => submit()} variant="contained" fullWidth color="primary" style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "17px",
                    marginBottom: "10px"
                }}>{loader ? "Loading.." : "Login"}</Button>
                <Link to="/signup">
                    Don't have an Accout
                </Link>
                {props.data.loggedIn && <Redirect to="/" />}
            </Paper>
        </Container>
    )
}

export default Login;
