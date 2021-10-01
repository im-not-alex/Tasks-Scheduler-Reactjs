import {Button, Collapse, ListGroup} from 'react-bootstrap';
import {Link, useLocation} from 'react-router-dom';
import {ChevronDown, ChevronUp} from "react-bootstrap-icons";

function Drawer(props) {
    const location = useLocation();
    return (
        <>
            <Collapse in={props.open} className="d-sm-block col-sm-4 col-12 bg-white pr-0" id="left-sidebar">
                <ListGroup variant="flush" activeKey={location.pathname}>
                    {
                        Object.entries(props.filters).map(([key, value], idx) =>
                            <Link key={"drawer-" + value.path} to={value.path} style={{textDecoration: 'none'}}
                                  replace={location.pathname === value.path}>
                                <ListGroup.Item as="button" action href={value.path}
                                                className={location.pathname === value.path ? ("bg-" + value.classColor + " border-" + value.classColor) : ""}>
                                    <value.icon/>
                                    {" " + key}</ListGroup.Item>
                            </Link>
                        )
                    }
                </ListGroup>
            </Collapse>
            <Button onClick={props.handleOpen}
                    className="col-sm-4 d-sm-none bg-dark text-light border-dark no-radius fix-height-38">{props.open ?
                <ChevronUp/> : <ChevronDown/>}</Button>
        </>
    )
}

export default Drawer;
 