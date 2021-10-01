import * as dayjs from 'dayjs'
import '../App.css';

var localizedFormat = require('dayjs/plugin/localizedFormat')
var isBetween = require('dayjs/plugin/isBetween')
var customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(isBetween)

class Task {
    constructor(id, description, important = false, mPrivate = true, deadline = undefined, completed = false, user = undefined) {
        this.id = id;
        this.description = description;
        this.important = !!+important;
        this.private = !!+mPrivate;
        this.deadline = (deadline && dayjs(deadline).isValid()) ? dayjs(deadline) : null;
        this.completed = !!+completed;
        this.user = user;
    }

    static from(json) {
        return new Task(...Object.values(json))
    }

    equals(other) {
        return JSON.stringify(this) === JSON.stringify(other)
    }
}

export default Task;