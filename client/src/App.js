import "./App.css";
import {useEffect, useReducer, useState} from "react";
import {Link, Redirect, Route, Switch, useLocation} from "react-router-dom";
import {Alert, Col, Row} from "react-bootstrap";
import {Drawer, filters, LogIn, NavBar, PageNotFound, Task, TaskList} from "./components";
import API from "./API";

import {Grow, Snackbar} from "@material-ui/core";
import {useAuthState} from "./components/AuthContext";

const tasksReducer = (state, action) => {
    switch (action.type) {
        case 'check':
            state = state.map(e => {
                if (e.id === action.id) {
                    e = new Task(...Object.values(e));
                    e.completed= action.value
                }
                return e;
            });
            return [...state];
        case 'set':
            return [...action.tasks];
        case 'add':
            state = state.concat(action.newT);
            action.callback(action.newT, state, 'added');
            return state;
        case 'remove':      
            for(let i = 0; i< state.length;i++) {
                if(state[i].id === action.id) {
                    state.splice(i,1);
                    break;
                }
            }
            return [...state];
        case 'edit':
            for (let i in state)
                if (state[i].id === action.editT.id)
                    state[i] = new Task(...Object.values(action.editT));
            action.callback(action.editT, state, 'edited');
            return [...state];
        case 'clean':
            return [];
        default:
            return [...state];
    }
}
const initAlert = {show: false, path: null, title: "", mode: 'add'};

function App() {
    const auth = useAuthState();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [tasks, editTasks] = useReducer(tasksReducer, []);
    const [alertShow, setAlertShow] = useState(initAlert);
    const [loading, setLoading] = useState(true);
    const [currS, setCurrS] = useState("alpha");

    const handleOpen = () => {
        setOpen((open) => !open);
    };
    const handleDismissAlert = () => {
        setAlertShow(a => ({...a, show: false}))
    }
    const handleAlert = (t, state, mode) => {

        if (state.filter((Object.values(filters).filter(f => f.path === location.pathname)[0]).fn).map(t => t.id).includes(t.id))

            setAlertShow({show: true, path: null, title: t.description, mode: mode});
        else
            setAlertShow({show: true, path: filters.All.path, title: t.description, mode: mode});
    }
    const handleAdd = async (t) => {
        try {
            const response = await API.addTask(t);
            t.id = response;
            t.user = auth.user.id;
            editTasks({type: 'add', newT: t, callback: handleAlert});
        } catch (e) {
            console.log(e);
        }
    }

    const handleEdit = async (t) => {
        if (!t.equals(tasks.find(x => x.id === t.id))) {
            try {
                await API.updateTask(t);
                editTasks({type: 'edit', editT: t, callback: handleAlert});
            } catch (e) {
                console.log(e);
            }
        }
    }

    const handleRemove = async (id) => {
        try {
            const response = await API.deleteTask(id);
            editTasks({type: 'remove', id: response});
            setAlertShow({show: true, path: null, title: null, mode: 'removed'});
        } catch (e) {
            console.log(e);
        }
    }

    const handleCheck = async (id) => {
        try {
            const check = await API.checkTask(id);
            editTasks({type: 'check', id: id, value: (check === 1)});
        } catch (e) {
            console.log(e)
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const tasks = await API.getTasks(location);
            editTasks({type: 'set', tasks});
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (Object.values(filters).map(v => v.path).includes(location.pathname))
            fetchData();
        else if (location.pathname === '/login')
            editTasks({type: 'clean'});
    }, [location]);


    const PageContainer = (props) =>
        auth.isAuthenticated ?
            <div className="d-flex flex-column h-100">
                <NavBar/>
                <Row className="bg-light flex-grow-1" noGutters>
                    <Drawer open={open} filters={filters} handleOpen={handleOpen}/>
                    <Col className="below-nav p-4" sm={8}>
                        {props.children}
                    </Col>
                </Row>
            </div>
            : <Redirect to='/login'/>;


    return (
        <>
            <Switch>
                {Object.entries(filters)
                    .map(([key, value]) => (
                        <Route
                            key={"routes-" + key}
                            path={value.path}
                            exact
                            render={() => <PageContainer>
                                <TaskList
                                    title={key}
                                    color={value.classColor}
                                    tasks={tasks}
                                    add={handleAdd}
                                    remove={handleRemove}
                                    edit={handleEdit}
                                    loading={loading}
                                    check={handleCheck}
                                    sort={currS}
                                    setSort={setCurrS}
                                />
                            </PageContainer>
                            }
                        />
                    ))}
                <Route path="/login" render={() =>
                    auth.isAuthenticated ? <Redirect to="/"/> :
                        <div className="d-flex flex-column h-100">
                            <NavBar onLog/>
                            <Row className="bg-light flex-grow-1 justify-content-center" noGutters>
                                <Col xs={10} md={8} lg={5}>
                                    <LogIn/>
                                </Col>
                            </Row>
                        </div>

                }/>
                <Route render={PageNotFound}/>
            </Switch>


            <Snackbar open={alertShow.show} autoHideDuration={3000} onClose={handleDismissAlert}
                      TransitionComponent={Grow}>
                <Alert show={alertShow.show} variant={!alertShow.path ? 'success' : 'info'} onClose={handleDismissAlert}
                       dismissible>
                    Task <i>{alertShow.title && ("“" + alertShow.title + "” ")}</i> successfully {alertShow.mode}!
                    {
                        alertShow.path && (
                            <><br/>The current filter is not showing the task.<br/>
                                <Link to={alertShow.path} onClick={handleDismissAlert}>
                                    Do you wish to browse to All? (Click me)
                                </Link></>
                        )
                    }
                </Alert>
            </Snackbar>
        </>
    );
}

export default App;
