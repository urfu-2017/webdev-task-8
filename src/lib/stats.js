export default class Stats {
    constructor({ spirit, energy, satiety }) {
        Object.assign(this, { spirit, energy, satiety });
        this.save();
    }

    static createNew() {
        return new Stats({
            spirit: 100,
            energy: 100,
            satiety: 100
        });
    }

    get stats() {
        return {
            spirit: this.spirit,
            energy: this.energy,
            satiety: this.satiety
        };
    }

    setStatsDelta({ spirit, energy, satiety }) {
        const newStats = Object.entries({ spirit, energy, satiety })
            .filter(entry => entry[1] !== undefined)
            .reduce((acc, curr) => {
                const [key, value] = curr;
                const updated = acc[key] + value;
                acc[key] = Math.min(100, Math.max(0, updated));

                return acc;
            }, this.stats);

        return new Stats(newStats);
    }

    save() {
        const jsoned = JSON.stringify(this.stats);
        localStorage.setItem('stats', jsoned);
    }

    static restore() {
        const saved = localStorage.getItem('stats');
        if (!saved) {
            return Stats.createNew();
        }

        return new Stats(JSON.parse(saved));
    }
}
