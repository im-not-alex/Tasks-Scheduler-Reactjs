import {Button, Form, FormControl, Nav, Navbar} from 'react-bootstrap';
import {BoxArrowRight, Check2All, PersonCircle} from 'react-bootstrap-icons';
import {Link} from 'react-router-dom';
import {useAuthState} from "./AuthContext";

function NavBar(props) {
    const auth = useAuthState();
    return (
        <Navbar bg="dark" variant="dark">
            <Link to={"/"} style={{textDecoration: 'none'}}>
                <Navbar.Brand onClick={props.handleOpen}><Check2All/> ToDo Manager</Navbar.Brand>
            </Link>
            <Nav className="m-auto">
                {!props.onLog &&
                <Form className="d-flex justify-content-center align-items-center" inline>
                    <FormControl type="text" placeholder="Search" className="mr-1 sm-2" disabled/>
                    <Button className="bg-violet" disabled>Search</Button>
                </Form>
                }
            </Nav>
            {
                auth.isAuthenticated ?
                    <>
                        <h5 className="text-white pr-2">
                            Welcome {" " + (auth.user.name).toUpperCase()}
                        </h5>
                        <Button variant="danger" onClick={auth.logOut} className="ml-2"><span
                            className="pr-2">LOG OUT</span><BoxArrowRight/></Button>
                    </>

                    : <Link to={"/login"} style={{textDecoration: 'none'}}>
                        <Button variant="light"><PersonCircle/><span className="pl-2">LOG IN</span></Button>
                    </Link>
            }
        </Navbar>
    )
}

export default NavBar;
