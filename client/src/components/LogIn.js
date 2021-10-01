import {Button, Form} from 'react-bootstrap'
import {useState} from 'react'
import {useAuthState} from './AuthContext'
import {ExclamationDiamond} from 'react-bootstrap-icons'

const emailRFC5322 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function LogIn(props) {
    const auth = useAuthState();
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState({email: "", password: ""})

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            auth.logIn(user);
        }
        setValidated(true);
    }
    const setField = (e) => {
        setUser(u => ({...u, [e.target.name]: e.target.value}))
    }

    const handleBlur = (e) => {
        setValidated(v =>
            v ? {...v, [e.target.name]: true} : {[e.target.name]: true})

    }

    const checkEmail = (valid = true) => {
        return (validated === true || validated.email) && (valid === emailRFC5322.test(user.email))
    }

    return (
        <Form onSubmit={handleSubmit} className="m-5">
            <h3>
                Log In
            </h3>
            <br/>
            <Form.Group controlId="formBasicEmail">
                <Form.Label column> Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" value={user.email} name="email"
                              onBlur={handleBlur}
                              required
                              isInvalid={checkEmail(false)}
                              onChange={setField}/>
                <Form.Control.Feedback
                    type="invalid">{user.email ? "Email format Invalid!" : "Missing required email!"}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label column>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={user.password} name="password"
                              onBlur={handleBlur}
                              required
                              isInvalid={(validated === true || validated.password) && !user.password}
                              onChange={setField}/>
                <Form.Control.Feedback type="invalid">{"Missing password!"}</Form.Control.Feedback>

            </Form.Group>
            <hr className="rounded"/>
            <div className={auth.error === "Unauthorized" ? "text-danger visible" : "invisible"}>
                <ExclamationDiamond className="mr-2"/>Wrong email/password combination!
            </div>
            <Button variant="primary" type="submit" className="float-right" size={"lg"}>
                Log In
            </Button>
        </Form>
    )
}

export default LogIn;