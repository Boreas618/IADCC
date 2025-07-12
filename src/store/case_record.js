export class Event {
    constructor(timestamp, module, description, metric, value) {
        this.timestamp = timestamp;
        this.module = module;
        this.description = description;
        this.metric = metric;
        this.value = value;
    }
}

export default class CaseRecord {
    constructor() {
        this.events = [];
    }

    newEvent(timestamp, module, description, metric, value) {
        //let indexToInset = this.events.indexOf((e) => e.timestamp > timestamp);
        this.events.push(new Event(timestamp, module, description, metric, value));
    }

    removeEvent(id) {
        let indexToRemove = this.events.indexOf((e) => e.id == id)
        this.events.splice(indexToRemove, 1);
    }

    moveEvent(id, timestamp, direction) {
        let startingIndex = this.events.indexOf((e) => e.timestamp == timestamp);
        let currentIndex = this.events.indexOf((e) => e.id == id);
        if (currentIndex > startingIndex) {
            let tmp = this.events[currentIndex + (direction) * 1];
            this.events[currentIndex + (direction) * 1] = this.events[currentIndex];
            this.events[currentIndex] = tmp;
        }
    }
}