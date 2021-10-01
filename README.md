# BigLab 2 - Class: 2021 WA1

## Team name: Uzitaro

Team members:

* Onica Alexandru Valentin
* Rametta Francesco
* Riggio Marco
* Alimov Islom

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _
labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same
repository, you can find
the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf)
, covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to
GitHub. This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the
project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

### Login
##### POST /api/sessions/
Authanticate in the application providing email and password for credentials

##### JSON Body
|Field|Type|Description|
|-----|----|-----------|
|username|string| The email of a registered account|
|password|string| The password of the account |

##### Example request
``` js
// requesting /api/sessions
{
  'method':'POST',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'username': 'john.doe@polito.it'
    'password': 'password'
  })
}
```
##### Example response
``` json
{
    "id":1,
    "email":"john.doe@polito.it",
    "name":"John"
}
```
##### Example error
``` json
{
    "message":"Incorrect email/password combination."
}
```
<br/>

### Retrieve current session user
##### GET /api/sessions/current
Check whether the current session has an user logged in or not.

##### Example request
``` js
// requesting /api/sessions
{
  'method':'GET'
}
```
##### Example response
``` json
{
    "id":1,
    "email":"john.doe@polito.it",
    "name":"John"
}
```
##### Example error
``` json
{
    "error":"Unauthenticated user!"
}
```
<br/>

### Logout
#### DELETE /api/sessions/
Logout from the application

##### Example request
``` js
// requesting /api/sessions
{
  'method':'DELETE'
}
```
<br/>

### Insert Task
#### POST /api/inserttask
Insert a new task in the application and receive the db assigned id.

##### JSON Body
|Field|Type|Description|
|-----|----|-----------|
|description|string|The description of the task|
|important|boolean|Whether the task has to be marked as important|
|private|boolean|Whether the task has to be marked as private|
|deadline|string &#124; null|The date when the task is due. It is displayed in the format YYYY-MM-DD HH:MM, or not in case no deadline is set. Transmitted in ISO format if exists or null otherwise.|
|completed|boolean|Wheter the task has been completed, always false|

##### Example request
``` js
// requesting /api/inserttask
{
  'method':'POST',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'description': 'A very important task',
    'important': true,
    'private': false,
    'deadline': '2021-06-10 17:33'
  })
}
```
##### Example response
``` js
    42
```
##### Example error
``` json
{
    "errors": [
        {
            "value":"",
            "msg":"The description must not be EMPTY!",
            "param":"description",
            "location":"body"
        }
    ]
}
```
<br/>

### Get Tasks
#### GET /api/tasks/{filter}/{id?}
Retrieve a list of filtered tasks from application or a specific one.

##### Parameters
|Parameter|Description|
|---------|:-----------:|
|filter|a filter to apply before retrieving tasks. It can be *'all','important','today','next7days','private','getid'*|
|id?|The id of the task in case the filter is *getid*|

##### Example request
``` js
// requesting /api/next7days
{
  'method':'GET
}
```
##### Example response
``` json
[
    {
        "id":8,
        "description":"Prepare the slides for the exam",
        "important":1,
        "private":0,
        "deadline":"2021-06-09 00:00",
        "completed":1,
        "user":1
    },
]
```
<br/>

### Update Task
#### PUT /api/updatetask
Update an existing task in the application,

##### JSON Body
|Field|Type|Description|
|-----|----|-----------|
|id|int|The id of the edited task|
|description|string|The description of the task|
|important|boolean|Whether the task has to be marked as important|
|private|boolean|Whether the task has to be marked as private|
|deadline|string &#124; null|The date when the task is due. It is displayed in the format YYYY-MM-DD HH:MM, or not in case no deadline is set. Transmitted in ISO format if exists or null otherwise.|
|completed|boolean|Wheter the task has been completed|
|user|int|The id of the user, unnecessary, the authenticated one will be used for check|

##### Example request
``` js
// requesting /api/updatetask
{
  'method':'POST',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    'id': 42,
    'description': 'A very very very important and private task',
    'important': true,
    'private': true,
    'completed' : true,
    'deadline': '2021-06-10 17:33',
    'user': 1
  })
}
```
<br/>

### Complete Task
#### PATCH /api/completetask/{id}
Mark an existing task in the application as completed or vice versa. This relies completely on the server answer. <br/>
Ex. If the user is logged in twice, if he marks as completed a task on one front end, and the same on the other, while both showing as unmarked, the result on the database will be unmarked, as on the later updated front end.

##### Parameters
|Parameter|Description|
|---------|-----------|
|id|The id of the task to (un)check as completed|

``` js
// requesting /api/completetask/42
{
  'method':'PATCH'
}
```
``` json
    0 | 1
``` 
<br/>

### Delete Task
#### DELETE /api/removetask/{id}
Remove an existing task from the application

##### Parameters
|Parameter|Description|
|---------|-----------|
|id|The id of the task to delete|

``` js
// requesting /api/removetask/42
{
  'method':'DELETE'
}
```
##### Example error
``` json
    42
```
<br/>