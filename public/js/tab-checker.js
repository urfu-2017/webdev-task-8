(() => {
    'use strict';
    window.addEventListener('blur', () => window.Pig.startSleeping(), true);
    window.addEventListener('focus', () => window.Pig.finishSleeping(), true);
})();
