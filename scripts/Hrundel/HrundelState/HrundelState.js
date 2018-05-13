const alreadyVisited = 'alreadyVisited';
const satiety = 'satiety';
const mood = 'mood';
const energy = 'energy';
const isDead = 'isDead';

export default class HrundelState {
    constructor() {
        this._initLocalStorage();
        this.isDead = parseInt(localStorage.getItem(isDead));
    }

    _initLocalStorage() {
        if (!localStorage.getItem(alreadyVisited)) {
            this._setDefaultLocalStorage();
        }
    }

    _setDefaultLocalStorage() {
        localStorage.setItem(alreadyVisited, true);
        localStorage.setItem(isDead, 0);
        localStorage.setItem(satiety, 100);
        localStorage.setItem(energy, 100);
        localStorage.setItem(mood, 100);
    }

    set onMoodChange(onMoodChange) {
        this._onMoodChange = onMoodChange;
        this._onMoodChange(localStorage.getItem(mood));
    }

    set onEnergyChange(onEnergyChange) {
        this._onEnergyChange = onEnergyChange;
        this._onEnergyChange(localStorage.getItem(energy));
    }

    set onSatietyChange(onSatietyChange) {
        this._onSatietyChange = onSatietyChange;
        this._onSatietyChange(localStorage.getItem(satiety));
    }

    set onPoorHealth(onPoorHealth) {
        this._onPoorHealth = onPoorHealth;
    }

    set onGoodHealth(onGoodHealth) {
        this._onGoodHealth = onGoodHealth;
    }

    set onDeath(onDeath) {
        this._onDeath = onDeath;
    }

    reset() {
        this._setDefaultLocalStorage();
        this.isDead = parseInt(localStorage.getItem(isDead));
        this._onMoodChange(100);
        this._onSatietyChange(100);
        this._onEnergyChange(100);
    }

    changeSatiety(incrementValue) {
        return this._changeState(this._onSatietyChange, satiety, incrementValue);
    }

    changeMood(incrementValue) {
        return this._changeState(this._onMoodChange, mood, incrementValue);
    }

    changeEnergy(incrementValue) {
        return this._changeState(this._onEnergyChange, energy, incrementValue);
    }

    startChangingSatiety(incrementValue, delay) {
        clearInterval(this.satietyTimerId);
        this.satietyTimerId =
            this._startChanging(this._onSatietyChange, satiety, incrementValue, delay);
    }

    startChangingEnergy(incrementValue, delay) {
        clearInterval(this.energyTimerId);
        this.energyTimerId =
            this._startChanging(this._onEnergyChange, energy, incrementValue, delay);
    }

    startChangingMood(incrementValue, delay) {
        clearInterval(this.moodTimerId);
        this.moodTimerId =
            this._startChanging(this._onMoodChange, mood, incrementValue, delay);
    }

    stopChangingSatiety() {
        clearInterval(this.satietyTimerId);
    }

    stopChangingMood() {
        clearInterval(this.moodTimerId);
    }

    stopChangingEnergy() {
        clearInterval(this.energyTimerId);
    }

    stopAll() {
        clearInterval(this.satietyTimerId);
        clearInterval(this.moodTimerId);
        clearInterval(this.energyTimerId);
    }

    isPoorHealth() {
        const states = this._getStatesAsArray();

        return states.some(stateValue => stateValue < 10);
    }

    _startChanging(onValueChange, storageKey, incrementValue, delay) {
        return setInterval(() =>
            this._changeState(onValueChange, storageKey, incrementValue), delay);
    }

    _changeState(onValueChange, storageKey, incrementValue) {
        if (this.isDead) {
            return;
        }

        const { oldValue, newValue } =
            this._setNewStateValue(onValueChange, storageKey, incrementValue);

        this._checkHealth(oldValue, newValue);
        this._checkGoodhealth(oldValue, newValue);

        return newValue;
    }

    _setNewStateValue(onValueChange, storageKey, incrementValue) {
        const oldValue = parseInt(localStorage.getItem(storageKey));

        let newValue = oldValue + incrementValue;
        newValue = Math.min(100, newValue);
        newValue = Math.max(0, newValue);

        localStorage.setItem(storageKey, newValue);
        onValueChange(newValue);

        return { oldValue, newValue };
    }

    _checkHealth(oldValue, newValue) {
        this._checkPoorHealth(oldValue, newValue);
        if (newValue <= 0) {
            this._checkDeath();
        }
    }

    _checkPoorHealth(oldValue, newValue) {
        if (newValue <= 10 && oldValue > 10) {
            this._onPoorHealth();
        }
    }

    _checkGoodhealth(oldValue, newValue) {
        if (oldValue <= 10 && newValue > 10) {
            const states = this._getStatesAsArray();
            const isGoodHealth = states.filter(stateValue => stateValue > 10).length >= 3;
            if (isGoodHealth) {
                this._onGoodHealth();
            }
        }
    }

    _checkDeath() {
        const states = this._getStatesAsArray();

        const isDead = states.filter(stateValue => stateValue <= 0).length >= 2;
        if (isDead) {
            this.isDead = true;
            localStorage.setItem(isDead, 1);
            this.stopAll();
            this._onDeath();
        }
    }

    _getStatesAsArray() {
        return [localStorage.getItem(mood), localStorage.getItem(energy),
            localStorage.getItem(satiety)];
    }
}
