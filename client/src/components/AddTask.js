import {Button, Col, Form, Modal, Row} from 'react-bootstrap';

import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import dayjs from '@date-io/dayjs'

import {useEffect, useState} from 'react';
import Task from "./Task";

const initValue = new Task(undefined, "", false, true, null, false, undefined);

function AddTask(props) {
    const [validated, setValidated] = useState(true);
    const [task, setTask] = useState(props.task || initValue);

    useEffect(() => {
            setTask(props.task || initValue)
        },
        [props.show, props.task]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            props.onHide();
            const t = Task.from(task);
            if (props.task) {
                props.edit(t);
            } else {
                props.add(t);
            }
        }
        setValidated(true);
    };


    const handleBlur = (e) => {
        setValidated(v =>
            v ? {...v, [e.target.name]: true} : {[e.target.name]: true}
        )
    }

    return (
        <Modal
            restoreFocus={false}
            show={props.show}
            onHide={props.onHide}
            onShow={() => setValidated(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Form noValidate onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.task ? (<span>Edit <i>{props.task.description}</i></span>) : "Insert a new task"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} controlId="formDescription">
                        <Form.Label column sm={2}>Description<span className="text-danger">*</span></Form.Label>
                        <Col sm={10}>
                            <Form.Control
                                onBlur={handleBlur}
                                required
                                isValid={(validated === true || validated.description) && task.description}
                                isInvalid={(validated === true || validated.description) && !task.description}
                                type="text"
                                name="description"
                                placeholder="Type your description here..."
                                value={task.description || ""}
                                onChange={(e) => setTask(t => ({...t, description: e.target.value}))}
                            />
                            <Form.Control.Feedback type="invalid">Missing required description!</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label as="legend" column xs={2}>
                            Options
                        </Form.Label>
                        <Col xs={10}>
                            <Form.Switch
                                isValid={false}
                                id="important-switch"
                                label="Important"
                                checked={task.important || false}
                                onChange={(e) => setTask(t => ({...t, important: !t.important}))}
                            />
                            <Form.Switch
                                id="private-switch"
                                label="Private"
                                checked={task.private || false}
                                onChange={(e) => setTask(t => ({...t, private: !t.private}))}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-0">
                        <Form.Label column xs={2}>Deadline</Form.Label>
                        <Col xs={10}>
                            <MuiPickersUtilsProvider utils={dayjs}>
                                <DateTimePicker
                                    inputVariant="outlined"
                                    autoOk
                                    clearable
                                    emptyLabel="No deadline selected."
                                    variant="standard"
                                    ampm={true}
                                    value={task.deadline}
                                    onError={console.log}
                                    onChange={(date) =>
                                        setTask(t => ({...t, deadline: date}))
                                    }
                                    format="YYYY-MM-DD HH:mm"
                                />
                            </MuiPickersUtilsProvider>
                        </Col>
                    </Form.Group>
                    <Row><Col className="text-right" sm={12}><small className="text-danger">* this field is
                        compulsory.</small></Col></Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={props.onHide} type='button'>Cancel</Button>
                    <Button type='submit' className="bg-violet">{props.task ? "Confirm" : "Add"}</Button>
                </Modal.Footer>
            </Form>

        </Modal>
    );
}

export default AddTask;
