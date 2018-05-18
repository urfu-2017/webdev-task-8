const GAMESTATE_KEY = 'gameState';

export default class StateStorage {
    load() {
        const serializedState = localStorage.getItem(GAMESTATE_KEY);
        if (!serializedState) {
            return null;
        }

        return JSON.parse(serializedState);
    }

    save(state) {
        localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state));
    }

    clear() {
        localStorage.removeItem(GAMESTATE_KEY);
    }
}
