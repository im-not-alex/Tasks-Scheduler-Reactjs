import {
    Calendar3WeekFill,
    ClockFill,
    CollectionFill,
    ExclamationTriangleFill,
    ShieldFillCheck
} from "react-bootstrap-icons";

import * as dayjs from "dayjs";

const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

const filters = {
    All: {path: "/", fn: () => true, icon: CollectionFill, classColor: "violet"},
    Important: {path: "/important", fn: (x) => x.important, icon: ExclamationTriangleFill, classColor: "danger"},
    Today: {
        path: "/today",
        fn: (x) => x.deadline && dayjs().isSame(x.deadline, "day"),
        icon: ClockFill,
        classColor: "warning"
    },
    "Next 7 Days": {
        path: "/next7days",
        fn: (x) => x.deadline && x.deadline.isBetween(dayjs().add(1, "day"), dayjs().add(7, "day"), "day", "[]"),
        icon: Calendar3WeekFill,
        classColor: "blue"
    },
    Private: {path: "/private", fn: (x) => x.private, icon: ShieldFillCheck, classColor: "success"},
};

export default filters;