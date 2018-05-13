class StateProperty {
    constructor(propertyName, initial) {
        this.propertyName = propertyName;
        this.initial = initial;
    }

    get name() {
        return this.propertyName;
    }

    get value() {
        const fromLocalStorage = localStorage.getItem(this.propertyName);

        return fromLocalStorage ? parseInt(fromLocalStorage, 10) : this.initial;
    }

    set value(val) {
        if (val >= 0 && val <= this.initial) {
            localStorage.setItem(this.propertyName, val);
        }
    }

    get isWarning() {
        const value = this.value;

        return value <= this.initial * 0.1;
    }

    reset() {
        this.value = this.initial;
    }
}

export default class States {
    constructor() {
        this.satiety = new StateProperty('satiety', 100);
        this.energy = new StateProperty('energy', 100);
        this.happy = new StateProperty('happy', 100);
    }

    get warningStates() {
        return [this.satiety, this.energy, this.happy].filter(s => s.isWarning);
    }

    get isDeath() {
        return [this.satiety.value, this.energy.value, this.happy.value]
            .filter(v => v === 0).length > 1;
    }

    reset() {
        this.satiety.reset();
        this.energy.reset();
        this.happy.reset();
    }
}
