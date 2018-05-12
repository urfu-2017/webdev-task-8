export const UpdateUIEvent = new Event('ui:update');
export const GameOverEvent = new Event('game:gameover');
export const FeedEvent = new Event('game:getFood');

export const createChangeFeedEvent = feedState => {
    return new CustomEvent('game:feed', { detail: { feedState } });
};

export const createHrunListenEvent = isListening => {
    return new CustomEvent('game:listening', { detail: { isListening } });
};

export const createWarningEvent = warningStates => {
    return new CustomEvent('game:warning', { detail: { warningStates } });
};

export const createChangeWindowStateEvent = state => {
    return new CustomEvent('window:changeState', { detail: { state } });
};
