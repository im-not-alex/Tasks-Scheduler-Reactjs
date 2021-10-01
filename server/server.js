'use strict';
const express = require('express');
const morgan = require('morgan'); // logging middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');

const fs = require('fs');
const secret = fs.readFileSync('./secret', 'utf8');

const {check, param, validationResult} = require('express-validator'); // validation middleware
const db = require('./dbAPI');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

//PASSPORT

passport.use(new LocalStrategy(
    function (email, password, done) {
        db.getUser(email, password).then((user) => {
            if (!user)
                return done(null, false, {message: 'Incorrect email/password combination.'});
            return done(null, user);
        })
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
        done(err, null);
    });
});

const app = new express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(express.json());

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({error: 'not authenticated'});
}

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));


const taskValidator = [
    check('description', 'The description must not be EMPTY!').notEmpty(),
    check('important', 'Important must be a boolan').isBoolean(),
    check('private', 'Private must be a boolan').isBoolean(),
    check('completed', 'Completed must be a boolan').isBoolean(),
    check('deadline', 'Deadline format invalid').custom(value => value === null || dayjs(value).isValid()).customSanitizer(x => x === null ? null : dayjs(x).format("YYYY-MM-DD HH:mm")),
];

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/tasks/:filter/:id?', isLoggedIn, async (req, res) => {
    let tasks;
    try {
        tasks = await db.getTasks(req.params.filter, req.user.id, req.params.id);
        if (tasks.error) {
            res.status(404).json(tasks);
        } else
            res.status(200).json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
})

app.post('/api/inserttask', isLoggedIn, taskValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({errors: errors.array()});
    }
    try {
        let id = await db.insertTask(req.body, req.user.id);
        if (id.error) {
            res.status(404).json(id);
        } else
            res.json(id);
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
})

app.put('/api/updatetask', isLoggedIn, taskValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({errors: errors.array()});
    }
    try {
        let id = await db.updateTask(req.body, req.user.id);
        if (id.error) {
            res.status(404).json(id);
        } else
            res.json(id);
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
})

app.delete('/api/removetask/:id', isLoggedIn, [
    param('id').isInt({min: 0})],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({errors: errors.array()});
    }
    try {
        let id = await db.removeTask(req.params.id, req.user.id);
        if (id.error) {
            res.status(404).json(id);
        } else
            res.json(id);
    } catch (err) {
        console.log(err)
        res.status(500).end();
    }
})

app.patch('/api/completetask/:id', isLoggedIn, [
        param('id').isInt({min: 0}),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(422).json({errors: errors.array()});
        }
        try {
            let id = await db.completeTasks(req.params.id, req.user.id);
            if (id.error) {
                res.status(404).json(id);
            } else
                res.json(id);
        } catch (err) {
            console.log(err)
            res.status(500).end();
        }
    })

// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});
// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else
        res.status(401).json({error: 'Unauthenticated user!'});
});

/*
const signUp = async () => {
    try {
        const res = await db.signUp({email:"mario.rossi@polito.it",name: "Mario Rossi",password: "password"});
        console.log(res);
    } catch(e) {
        console.log(e)
    }
} 
*/

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
    //signUp();
});