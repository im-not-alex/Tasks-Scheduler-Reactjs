import {Button, Table} from "react-bootstrap";
import {
    CheckSquareFill,
    ChevronDown,
    ChevronUp,
    ExclamationTriangleFill,
    PencilSquare,
    ShieldFillCheck,
    Square,
    TrashFill
} from "react-bootstrap-icons";
import {useMemo, useState} from "react";
import AddTask from "./AddTask";
import Skeleton from 'react-loading-skeleton';

const Square22 = (props) => <Square {...props} size={22}/>;
const CheckSquareFill22 = (props) => <CheckSquareFill {...props} size={22}/>;

const sorts = {
    alpha: (a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()),
    alphaInv: (a, b) => sorts.alpha(b, a),
    date: (a, b) => a.deadline && b.deadline ? a.deadline.diff(b.deadline) : (a.deadline ? -1 : 1),
    dateInv: (a, b) => sorts.date(b, a)
}
const initShowAdd = {show: false, task: null};

function TaskList(props) {

    const [showAdd, setShowAdd] = useState(initShowAdd);
    const tasks = useMemo(() =>
            props.loading ? Array(5).fill({}) :
                (props.tasks ? props.tasks.sort(sorts[props.sort]) : [])
        , [props.loading, props.sort])
    return (
        <>
            <h1 className={"text-" + props.color}>{props.title}</h1>
            {
                tasks.length ? (
                        <Table striped hover responsive="sm">
                            <thead>
                            <tr>
                                <th/>
                                <th className="cursor-pointer"
                                    onClick={() => props.setSort(s => s === "alpha" ? "alphaInv" : "alpha")}>Description<span
                                    className="text-r">{(props.sort === "alpha" && <ChevronUp/>) ||
                                <ChevronDown visibility={props.sort === "alphaInv" ? "visible" : "hidden"}/>}</span></th>
                                <th className="cursor-pointer"
                                    onClick={() => props.setSort(s => s === "date" ? "dateInv" : "date")}>Deadline<span
                                    className="text-r">{(props.sort === "date" && <ChevronUp/>) ||
                                <ChevronDown visibility={props.sort === "dateInv" ? "visible" : "hidden"}/>}</span></th>
                                {props.title !== "Important" && <th className="text-center">Important</th>}
                                {props.title !== "Private" && <th className="text-center">Private</th>}
                                <th className="text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.loading ? tasks.map((t, idx) =>
                                <tr key={"skeleton-row-" + idx}>
                                    <td className="text-center">
                                        <Skeleton circle={true} height={32} width={32}/>
                                    </td>
                                    <td><Skeleton/></td>
                                    <td><Skeleton/></td>
                                    {props.title !== "Important" &&
                                    <td className="text-center">
                                        <Skeleton circle={true} height={32} width={32}/>
                                    </td>
                                    }
                                    {props.title !== "Private" &&
                                    <td className="text-center">
                                        <Skeleton circle={true} height={32} width={32}/>
                                    </td>
                                    }
                                    <td>
                                        <Skeleton circle={true} height={32} width={32}/>
                                        {' '}
                                        <Skeleton circle={true} height={32} width={32}/>
                                    </td>
                                </tr>
                            ) : tasks.map((task, idx) => (
                                <tr key={"data-row-" + idx}>
                                    <td className="text-center">
                                        <Button variant={null} className={"p-0 fill-" + props.color}
                                                onClick={() => props.check(task.id)}
                                                as={task.completed ? CheckSquareFill22 : Square22}/>

                                    </td>
                                    <td className="no-double-click">
                                        {task.description}
                                    </td>
                                    <td>
                                        <small className="no-double-click">
                                            {task.deadline && task.deadline.format("LLLL")}
                                        </small>
                                    </td>
                                    {props.title !== "Important" && <td className="text-center">
                                        {
                                            task.important && <ExclamationTriangleFill color="red"/>
                                        }
                                    </td>}
                                    {props.title !== "Private" && <td className="text-center">
                                        {
                                            task.private && <ShieldFillCheck color="green"/>
                                        }
                                    </td>}

                                    <td>
                                        <Button
                                            size="sm"
                                            variant="info"
                                            id={"edit-" + task.id}
                                            onClick={() => setShowAdd({show: true, task: task})}
                                        >
                                            <PencilSquare/>
                                        </Button>
                                        {' '}
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            id={"remove-" + task.id}
                                            className="btn-nofocus"
                                            onClick={() => props.remove(task.id) && false}
                                        >
                                            <TrashFill/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )
                    : (<p className="text-center"><i>No tasks matching the current filter.</i></p>)
            }


            <Button
                className="bg-violet"
                variant="primary"
                onClick={() => setShowAdd({show: true, task: null})}
                block
                disabled={props.loading}>
                &#43;
            </Button>
            <AddTask
                add={props.add}
                edit={props.edit}
                show={showAdd.show}
                task={showAdd.task}
                onHide={() => setShowAdd((s) => ({...s, show: false}))}
            />


        </>
    );
}

export default TaskList;
