'use strict';

/* eslint-disable max-statements */
(function () {
    const noseColor = '#FFAD61';
    const headColor = '#FFE6B8';
    const strokeColor = '#4D3D36';
    const bloodColor = '#C10202';
    /* eslint-disable max-len */
    const headPath = 'M438.718,146.799c15.507-25.191,20.163-54.994,13.099-82.672c-41.92,5.111-81.975,21.7-116.199,48.185c-3.2,2.478-7.791,1.968-10.37-1.152c-13.594-16.439-33.61-25.868-54.916-25.868h-70.631c-21.305,0-41.321,9.429-54.916,25.868c-2.579,3.119-7.169,3.629-10.37,1.152C100.193,85.827,60.138,69.238,18.218,64.127c-7.063,27.678-2.408,57.48,13.099,82.672c18.032,29.293,47.811,47.981,80.592,50.916l3.28-30.376c-3.486-5.481-5.008-11.933-4.309-18.488c0.477-4.471,1.954-8.678,4.292-12.367c-20.069-14.365-42.089-24.815-65.563-31.103c-4.001-1.072-6.376-5.185-5.304-9.186s5.186-6.382,9.185-5.304c27.924,7.479,53.915,20.428,77.25,38.484c1.814,1.404,2.886,3.561,2.91,5.854c0.024,2.294-1.003,4.472-2.788,5.913c-5.936,4.792-6.866,13.52-2.075,19.455c1.252,1.55,1.835,3.535,1.621,5.517l-18.808,174.158c-1.885,17.684,3.276,34.326,14.536,46.85c11.26,12.524,27.261,19.422,45.056,19.422h127.649c17.798,0,33.818-6.901,45.108-19.433c11.291-12.531,16.491-29.182,14.642-46.883l-18.966-174.107c-0.216-1.983,0.367-3.972,1.621-5.523c4.792-5.936,3.861-14.663-2.075-19.455c-1.785-1.441-2.812-3.619-2.788-5.913c0.023-2.294,1.095-4.45,2.91-5.854c23.334-18.057,49.325-31.005,77.25-38.484c4-1.078,8.113,1.302,9.185,5.304c1.072,4.001-1.303,8.113-5.304,9.186c-23.474,6.287-45.494,16.737-65.563,31.103c2.339,3.689,3.816,7.896,4.292,12.367c0.699,6.554-0.822,13.005-4.307,18.484l3.309,30.377C390.926,194.769,420.692,176.083,438.718,146.799z ';
    const nosePath = 'M262.949,303.665c-4.142,0-7.5-3.357-7.5-7.5s3.358-7.5,7.5-7.5h23.306c-1.57-7.631-5.438-15.054-10.997-20.798c-9.368-9.679-23.283-14.794-40.241-14.794s-30.873,5.115-40.241,14.794c-5.559,5.743-9.427,13.167-10.997,20.798h23.306c4.142,0,7.5,3.357,7.5,7.5s-3.358,7.5-7.5,7.5h-23.197c3.389,14.137,16.127,24.681,31.289,24.681c5.646,0,11.208-1.491,16.083-4.313c1.162-0.673,2.459-1.009,3.757-1.009s2.595,0.336,3.757,1.009c4.875,2.822,10.437,4.313,16.083,4.313c15.162,0,27.899-10.543,31.289-24.681H262.949z';
    const pointTopPath = 'M147.491,352.04c-4.411,0-8,3.589-8,8s3.589,8,8,8c4.411,0,8-3.589,8-8S151.902,352.04,147.491,352.04z';
    const pointBottomPath = 'M168.143,372.54c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S172.554,372.54,168.143,372.54z';
    const headStrokePath = 'M464.426,53.711c-1.073-3.358-4.336-5.517-7.851-5.186c-44.721,4.232-87.64,20.699-124.568,47.731c-16.185-16.583-38.287-25.966-61.674-25.966h-70.631c-23.387,0-45.489,9.383-61.674,25.966C101.1,69.225,58.181,52.758,13.46,48.525c-3.512-0.34-6.779,1.826-7.851,5.186c-10.681,33.451-5.966,70.246,12.935,100.951c20.482,33.275,54.371,54.536,91.755,57.968L96.687,338.673c-2.344,21.98,4.153,42.749,18.295,58.479c14.142,15.729,34.104,24.393,56.21,24.393h127.649c22.103,0,42.08-8.662,56.252-24.392s20.713-36.499,18.414-58.516l-13.727-126.013c37.365-3.444,71.235-24.702,91.71-57.963C470.393,123.957,475.107,87.162,464.426,53.711z M354.848,167.335c3.485-5.479,5.005-11.931,4.307-18.484c-0.477-4.471-1.954-8.678-4.292-12.367c20.069-14.365,42.089-24.815,65.563-31.103c4.001-1.072,6.376-5.185,5.304-9.186c-1.072-4.002-5.186-6.382-9.185-5.304c-27.924,7.479-53.915,20.428-77.25,38.484c-1.814,1.404-2.886,3.561-2.91,5.854c-0.024,2.294,1.003,4.472,2.788,5.913c5.936,4.792,6.866,13.52,2.075,19.455c-1.253,1.552-1.836,3.54-1.621,5.523l18.966,174.107c1.849,17.701-3.351,34.352-14.642,46.883c-11.291,12.531-27.311,19.433-45.108,19.433H171.193c-17.795,0-33.796-6.897-45.056-19.422c-11.26-12.523-16.421-29.166-14.536-46.85l18.808-174.158c0.214-1.981-0.369-3.967-1.621-5.517c-4.792-5.936-3.861-14.663,2.075-19.455c1.785-1.441,2.812-3.619,2.788-5.913c-0.023-2.294-1.095-4.45-2.91-5.854c-23.334-18.057-49.325-31.005-77.25-38.484c-4-1.078-8.113,1.303-9.185,5.304s1.303,8.113,5.304,9.186c23.474,6.287,45.494,16.737,65.563,31.103c-2.339,3.689-3.816,7.896-4.292,12.367c-0.699,6.556,0.823,13.007,4.309,18.488l-3.28,30.376c-32.781-2.935-62.56-21.623-80.592-50.916c-15.507-25.191-20.163-54.994-13.099-82.672c41.92,5.111,81.975,21.7,116.199,48.185c3.2,2.477,7.791,1.967,10.37-1.152c13.594-16.439,33.61-25.868,54.916-25.868h70.631c21.305,0,41.321,9.429,54.916,25.868c2.579,3.12,7.169,3.63,10.37,1.152c34.224-26.484,74.279-43.073,116.199-48.185c7.063,27.678,2.408,57.48-13.099,82.672c-18.026,29.284-47.792,47.97-80.561,50.914L354.848,167.335z';
    const noseStrokePath = 'M235.018,238.073c-49.172,0-67.021,34.74-67.021,58.092c0,26.016,21.165,47.181,47.18,47.181c6.865,0,13.645-1.504,19.84-4.378c6.195,2.874,12.976,4.378,19.84,4.378c26.015,0,47.18-21.165,47.18-47.181C302.038,272.813,284.19,238.073,235.018,238.073z M254.858,328.346c-5.646,0-11.208-1.491-16.083-4.313c-1.162-0.673-2.459-1.009-3.757-1.009s-2.595,0.336-3.757,1.009c-4.875,2.822-10.437,4.313-16.083,4.313c-15.162,0-27.899-10.543-31.289-24.681h23.197c4.142,0,7.5-3.357,7.5-7.5s-3.358-7.5-7.5-7.5H183.78c1.57-7.631,5.438-15.054,10.997-20.798c9.368-9.679,23.283-14.794,40.241-14.794s30.873,5.115,40.241,14.794c5.559,5.743,9.427,13.167,10.997,20.798h-23.306c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5h23.197C282.757,317.802,270.02,328.346,254.858,328.346z';
    /* eslint-enable */
    const eyeLeftPath = 'm 327.4,205.8 h -17.8 l -8.6,12.9';
    const eyeRightPath = 'm 142.6,205.8 h 17.8 l 8.6,12.9';
    const eyeRightSleepPath = 'm 142.6,205.8 h 17.8 l 8.6,0';
    const eyeLeftSleepPath = 'm 327.4,205.8 h -17.8 l -8.6,0';
    const bloodLeftBeforePath = 'm 309.6,205.8 l 0,0';
    const bloodRightBeforePath = 'm 160.4,205.8 l 0,0';
    const bloodLeftAfterPath = 'm 309.6,205.8 l 0,50';
    const bloodRightAfterPath = 'm 160.4,205.8 l 0,50';

    const snap = Snap('.pig__svg'); /* eslint-disable-line no-undef, new-cap */
    const viewBoxEnd = 470.035;
    const viewBoxStart = 0;

    const eyesAttr = {
        stroke: strokeColor,
        strokeWidth: 14,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    };

    const bloodAttr = {
        stroke: bloodColor,
        strokeWidth: 14,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    };

    snap.attr({
        viewBox: [viewBoxStart, viewBoxStart, viewBoxEnd, viewBoxEnd].join(' '),
        width: 400,
        height: 400
    });


    const interval = 1000;
    const renderInterval = 500;
    const checkDeadInterval = 500;
    // #region states
    const hungerSelector = '.hunger__residue';
    const energySelector = '.energy__residue';
    const moodSelector = '.mood__residue';
    const elementByState = {
        hunger: document.querySelector(hungerSelector),
        energy: document.querySelector(energySelector),
        mood: document.querySelector(moodSelector)
    };
    const STATE_NAMES = {
        hunger: 'hunger',
        energy: 'energy',
        mood: 'mood'
    };
    class States {
        constructor() {
            this._hunger = Number(localStorage.getItem(STATE_NAMES.hunger)) || 100;
            this._energy = Number(localStorage.getItem(STATE_NAMES.energy)) || 100;
            this._mood = Number(localStorage.getItem(STATE_NAMES.mood)) || 100;
        }

        reset() {
            this._setState(STATE_NAMES.hunger, 100);
            this._setState(STATE_NAMES.energy, 100);
            this._setState(STATE_NAMES.mood, 100);
        }

        setZero() {
            this._setState(STATE_NAMES.hunger, 0);
            this._setState(STATE_NAMES.energy, 0);
            this._setState(STATE_NAMES.mood, 0);
        }

        _save(state) {
            localStorage.setItem(state, this[`_${state}`]);
        }

        _load(state) {
            this[`_${state}`] = localStorage.getItem(state);
        }

        _render(state) {
            elementByState[state].style.width = this[`_${state}`] + '%';
        }

        render() {
            this._render(STATE_NAMES.hunger);
            this._render(STATE_NAMES.energy);
            this._render(STATE_NAMES.mood);
        }

        _checkAndSaveState(state, newStateValue) {
            newStateValue = newStateValue > 100 ? 100 : newStateValue;
            newStateValue = newStateValue < 0 ? 0 : newStateValue;
            this[`_${state}`] = newStateValue;
            this._save(state);
        }

        _setState(state, newStateValue) {
            this._checkAndSaveState(state, newStateValue);
        }

        _changeState(state, changes) {
            let newStateValue = this[`_${state}`] + changes;
            this._checkAndSaveState(state, newStateValue);
        }

        changeHunger(changes) {
            this._changeState(STATE_NAMES.hunger, changes);
        }

        changeEnergy(changes) {
            this._changeState(STATE_NAMES.energy, changes);
        }

        changeMood(changes) {
            this._changeState(STATE_NAMES.mood, changes);
        }
    }
    const eyeRightId = 'rightEye';
    const eyeLeftId = 'leftEye';
    const bloodLeftId = 'leftEyeBlood';
    const bloodRightId = 'rightEyeBlood';
    const speedGoingSleep = 500;
    // #endregion
    // #region pig
    class Pig {
        constructor() {
            this.states = new States();
            this.speed = {
                eating: 20,
                sleeping: 20,
                enjoying: 20
            };
            this._actions = {
                eating: 'eating',
                sleeping: 'sleeping',
                enjoying: 'enjoying'
            };
            this._stateByAction = {
                eating: STATE_NAMES.hunger,
                sleeping: STATE_NAMES.energy,
                enjoying: STATE_NAMES.mood
            };
            this._isDead = false;
            this._sleepingInterval = null;
            this._eatingInterval = null;
            this._enjoyingInterval = null;
            this._drawHead();
            this._drawNose();
            this._drawPoints();
            this._drawEyes();
            this._eyes = {
                left: snap.select(`#${eyeLeftId}`),
                right: snap.select(`#${eyeRightId}`)
            };
            this._blood = {
                left: snap.select(`#${bloodLeftId}`),
                right: snap.select(`#${bloodRightId}`)
            };
        }

        _drawNose() {
            snap.path(nosePath).attr({ fill: noseColor });
            snap.path(noseStrokePath).attr({ fill: strokeColor });
        }

        _drawHead() {
            snap.path(headPath).attr({ fill: headColor });
            snap.path(headStrokePath).attr({ fill: strokeColor });
        }

        _drawPoints() {
            snap.path(pointTopPath).attr({ fill: strokeColor });
            snap.path(pointBottomPath).attr({ fill: strokeColor });
        }

        _drawEyes() {
            snap.path(bloodLeftBeforePath).attr(Object.assign({ id: bloodLeftId }, bloodAttr));
            snap.path(bloodRightBeforePath).attr(Object.assign({ id: bloodRightId }, bloodAttr));
            snap.path(eyeRightPath).attr(Object.assign({ id: eyeRightId }, eyesAttr));
            snap.path(eyeLeftPath).attr(Object.assign({ id: eyeLeftId }, eyesAttr));
        }

        _startAction(action) {
            if (this._isDead) {
                return;
            }
            if (this[`_${action}Interval`]) {
                return;
            }
            // console.info('set interval ' + action);
            let state = this._stateByAction[action];
            this[`_${action}Interval`] = setInterval(() => {
                this.states._changeState(this._stateByAction[action], this.speed[action]);
                if (this.states[`_${state}`] === 100) {
                    if (action === this._actions.sleeping) {
                        this._animateAwake();
                    }
                    this._finishAction(action);
                }
            }, interval);
        }

        startEating() {
            if (this.isSleeping()) {
                return;
            }
            this._startAction(this._actions.eating);
            // this._finishAction(this._actions.enjoying);
            // когда заряжается, чтобы можно было говорить с Хрюнделем
        }

        startSleeping() {
            this._startAction(this._actions.sleeping);
            this._finishAction(this._actions.eating);
            this._finishAction(this._actions.enjoying);
            this._animateSleep();
        }

        startEnjoying() {
            this._startAction(this._actions.enjoying);
        }

        _finishAction(action) {
            if (this[`_${action}Interval`]) {
                clearInterval(this[`_${action}Interval`]);
            }
            this[`_${action}Interval`] = null;
        }

        finishEating() {
            this._finishAction(this._actions.eating);
        }

        finishSleeping() {
            this._finishAction(this._actions.sleeping);
            this._animateAwake();
        }

        finishEnjoying() {
            this._finishAction(this._actions.enjoying);
        }

        finishAllActions() {
            this.finishEating();
            this._animateAwake();
            this.finishSleeping();
            this.finishEnjoying();
        }

        _shouldDie() {
            let countZeroStates = 0;
            for (let state of Object.values(this._stateByAction)) {
                if (this.states[`_${state}`] <= 0) {
                    countZeroStates++;
                }
            }

            return countZeroStates >= 2;
        }

        _die() {
            this._isDead = true;
            this._finishDying();
            this.finishAllActions();
            this.states.setZero();
        }

        isDead() {
            return this._isDead;
        }

        revive() {
            this._isDead = false;
            this._animateRevive();
            this.states.reset();
            this._startDying();
        }

        _startDying() {
            if (this._dyingInterval) {
                return;
            }
            this._dyingInterval = setInterval(() => {
                if (this._shouldDie()) {
                    console.info('die');
                    this._die();
                    this._animateDead();
                }
            }, checkDeadInterval);
        }

        _finishDying() {
            clearInterval(this._dyingInterval);
            this._dyingInterval = null;
        }

        _animateDead() {
            /* eslint-disable no-undef */
            this._blood.left.animate({ d: bloodLeftAfterPath }, 1000, mina.easein);
            this._blood.right.animate({ d: bloodRightAfterPath }, 1000, mina.easein);
            /* eslint-enable */
        }

        _animateRevive() {
            this._blood.left.animate({ d: bloodLeftBeforePath }, 0);
            this._blood.right.animate({ d: bloodRightBeforePath }, 0);
        }

        _animateSleep() {
            this._eyes.left.animate({ d: eyeLeftSleepPath }, speedGoingSleep);
            this._eyes.right.animate({ d: eyeRightSleepPath }, speedGoingSleep);
        }

        _animateAwake() {
            this._eyes.left.animate({ d: eyeLeftPath }, speedGoingSleep);
            this._eyes.right.animate({ d: eyeRightPath }, speedGoingSleep);
        }

        isHungry() {
            return this.states._hunger <= 10;
        }

        isTired() {
            return this.states._energy <= 10;
        }

        isSad() {
            return this.states._mood <= 10;
        }

        isSleeping() {
            return this._sleepingInterval !== null;
        }
    }
    // #endregion

    const pig = new Pig();
    window.Pig = pig;
    setInterval(() => {
        pig.states.render();
    }, renderInterval);
    pig._startDying();
}());
