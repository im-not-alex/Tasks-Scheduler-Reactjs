'use strict';

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('tasks.db', (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

const filteringQuery = (filter, userId, id) => {
    let query = `SELECT * FROM tasks WHERE tasks.user = '${userId}'`;
    switch (filter) {
        case 'important' :
            query += " AND important=1;"
            break;
        case 'private' :
            query += " AND private=1;"
            break;
        case 'completed' :
            query += " AND completed=1;"
            break;
        case 'today' :
            query += " AND date(deadline) = date('now');"
            break;
        case 'next7days' :
            query += " AND date(deadline) > date('now') AND date(deadline) <= date('now','+7 days');"
            break;
        case 'getid' :
            query += ` AND tasks.id = '${id}';`
            break;
        case 'all':
            query += ";";
            break;
        default :
            query = null;
            break;
    }
    console.log(query);
    return query;
}

const getTasks = (filter, userId, id) => {
    return new Promise((resolve, reject) => {
        let query = filteringQuery(filter, userId, id);
        if (query)
            db.all(query, (err, rows) => {
                if (err) reject(err);
                else {
                    console.log("filter: " + filter + "\tlength: " + rows.length)
                    resolve(rows);
                }
            });
        else
            reject("Wrong filter");
    });
};

const insertTask = (task, userId) => {
    const query = "INSERT INTO tasks(description,important,private,deadline,completed,user) VALUES (?,?,?,?,?,?);";
    console.log([...Object.values(task), userId])
    return new Promise((resolver, reject) => {
        db.run(query, [...Object.values(task), userId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolver(this.lastID);
            }
        })
    })
}

const updateTask = (task, userId) => {
    const query = "UPDATE tasks SET " + Object.entries(task).filter(([k, v]) => k !== "id" && k !== "user").map(([k, v]) => typeof v === "boolean" || v === null ? `${k} = ${v}` : `${k} = '${v}'`).join(",") + ` WHERE id = '${task.id}' AND user = '${userId}';`;
    console.log(query);
    return new Promise((resolver, reject) => {
        db.run(query, function (err) {
            if (err) {
                reject(err);
            } else {
                resolver(true);
            }
        })
    })
}

const removeTask = (id, userId) => {
    const query = `DELETE FROM tasks WHERE id = '${id}' AND user = '${userId}';`
    console.log(query);
    return new Promise((resolve, reject) => {
        db.run(query, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(parseInt(id));
            }
        })
    })
}

const completeTasks = (id, userId) => {
    let query = `UPDATE tasks SET completed = not completed WHERE id = '${id}' AND user = '${userId}';`
    console.log(query);
    return new Promise((resolve, reject) => {
        db.run(query, function (err) {
            if (err) {
                reject(err);
            } else {
                query = `SELECT completed FROM tasks WHERE id = '${id}';`;
                db.get(query, (err, row) => {
                    if (err) reject(err);
                    else {
                        resolve(row.completed);
                    }
                })
            }
        })
    })
}

const getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?;';
        db.get(query, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve(false);
            else {
                bcrypt.compare(password, row.password).then(result => {
                    if (result)
                        resolve({id: row.id, email: row.email, name: row.name});
                    else
                        resolve(false);
                })
            }
        })
    })
}

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?;';
        db.get(query, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else
                resolve({id: row.id, email: row.email, name: row.name});
        })
    })
}

const signUp = (user) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users(email,name,password) VALUES(?,?,?)';
        bcrypt.hash(user.password, 10, function (err, hash) {
            db.run(query, [user.email, user.name, hash], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            })

        })
    })

}

module.exports = {getTasks, insertTask, updateTask, removeTask, completeTasks, getUser, getUserById, signUp};

//TODO Check if run is the right function for everything, maybe other will give better response!