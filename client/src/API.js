import {Task} from "./components";

const BASEURL = '/api/';

const parseResponse = async (response, callback = undefined) => {
    let resJson;
    try {
        resJson = await response.json();
    } catch (e) {
        resJson = response.statusText;
    }
    if (response.ok)
        return callback ? callback(resJson) : resJson;
    else
        throw resJson;

}

const getTasks = async (location) => {
    let response = await fetch(BASEURL + "tasks" + (location.pathname === "/" ? "/all" : location.pathname));
    return await parseResponse(response, j => j.map(t => Task.from(t)));
}

const checkTask = async (id) => {
    let response = await fetch(BASEURL + "completetask/" + id, {
        method: 'PATCH',
    });
    return await parseResponse(response);

}

const deleteTask = async (id) => {
    let response = await fetch(BASEURL + "removetask/" + id, {
        method: 'DELETE',
    });
    return await parseResponse(response);
}

const updateTask = async (task) => {
    let response = await fetch(BASEURL + "updatetask", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return await parseResponse(response);
}

const addTask = async (task) => {
    let response = await fetch(BASEURL + "inserttask", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    return await parseResponse(response);
}

const logIn = async (credentials) => {
    return await fetch(BASEURL + 'sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: credentials.email, password: credentials.password}),
    });
}

const logOut = async () => {
    await fetch(BASEURL + 'sessions/current', {method: 'DELETE'});
}

const getUserInfo = async () => {
    return await fetch(BASEURL + 'sessions/current');
}
const API = {getTasks, addTask, updateTask, checkTask, deleteTask, logIn, logOut, getUserInfo}
export default API;

