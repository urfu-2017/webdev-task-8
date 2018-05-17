export const ACTIONS = ['IDLE', 'SLEEP', 'EAT', 'LISTEN', 'DEAD']
    .reduce((acc, curr) => {
        acc[curr] = curr;

        return acc;
    }, {});
