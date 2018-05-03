export default class GameState {
    constructor(satiety = 100, energy = 100, mood = 100) {
        this.energy = energy;
        this.satiety = satiety;
        this.mood = mood;
    }
}
