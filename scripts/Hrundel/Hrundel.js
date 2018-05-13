import HrundelState from './HrundelState/HrundelState';
import { increaseValue, increaseSpeed,
    hrundelPhrases, decreaseValue, decreaseSpeed } from '../../config/config';
import recognizer from '../lib/Recognizer';

export default class Hrundel {
    constructor() {
        this.state = new HrundelState();


        if (recognizer.isAvailable()) {
            recognizer.init();
        }
    }

    set onSatietyChange(onSatietyChange) {
        this.state.onSatietyChange = onSatietyChange;
    }

    set onMoodChange(onMoodChange) {
        this.state.onMoodChange = onMoodChange;
    }

    set onEnergyChange(onEnergyChange) {
        this.state.onEnergyChange = onEnergyChange;
    }

    set onNewHrundelText(onNewHrundleText) {
        this._onNewHrundelText = onNewHrundleText;
        if (this.state.isDead) {
            this._onNewHrundelText(hrundelPhrases.onDeath);
        }
    }

    set onPoorHealth(onPoorHealth) {
        this.state.onPoorHealth = () => {
            onPoorHealth();
            this._onNewHrundelText(hrundelPhrases.onPoorHealth);
        };

        if (this.state.isPoorHealth()) {
            onPoorHealth();
        }
    }

    set onDeath(onDeath) {
        this.state.onDeath = () => {
            onDeath();
            this._onNewHrundelText(hrundelPhrases.onDeath);
        };

        if (this.state.isDead) {
            onDeath();
        }
    }

    set onGoodHealth(onGoodHealth) {
        this.state.onGoodHealth = () => {
            onGoodHealth();
            this._onNewHrundelText(hrundelPhrases.onGoodHealth);
        };
    }

    set onStartSleeping(onBeforeSleeping) {
        this._onStartSleeping = onBeforeSleeping;
    }

    set onStopSleeping(onStopSleeping) {
        this._onStopSleeping = onStopSleeping;
    }

    set onStartEating(onStartEating) {
        this._onStartEating = onStartEating;
    }

    set onStopEating(onStopEating) {
        this._onStopEating = onStopEating;
    }

    set onStartSpeaking(onStartSpeaking) {
        this._onStartSpeaking = onStartSpeaking;
    }

    set onStopSpeaking(onStopSpeaking) {
        this._onStopSpeaking = onStopSpeaking;
    }

    set onReset(onReset) {
        this._onReset = onReset;
    }

    set onStartDying(onStartDying) {
        this._onStartDying = onStartDying;
    }

    startDying() {
        if (!this.state.isDead) {
            this.state.startChangingSatiety(decreaseValue, decreaseSpeed);
            this.state.startChangingEnergy(decreaseValue, decreaseSpeed);
            this.state.startChangingMood(decreaseValue, decreaseSpeed);

            this._onStartDying();
        }
    }

    resetState() {
        this._onReset();
        this._onNewHrundelText(hrundelPhrases.Greeting);
        this.state.reset();
    }

    startSleeping() {
        if (!this.state.isDead) {
            this._stopAllActions();
            this._onStartSleeping();
            this.state.startChangingEnergy(increaseValue, increaseSpeed);
            this._onNewHrundelText(hrundelPhrases.onStartSleeping);
        }
    }

    stopSleeping() {
        if (!this.state.isDead) {
            this._onStopSleeping();
            this.state.startChangingEnergy(decreaseValue, decreaseSpeed);
            this._onNewHrundelText(hrundelPhrases.onStopSleeping);
        }
    }

    startEating() {
        if (!this.state.isDead) {
            this._stopAllActions();
            this._onStartEating();
            this.state.startChangingSatiety(increaseValue, increaseSpeed);
            this._onNewHrundelText(hrundelPhrases.onStartEating);
        }
    }

    quickEat() {
        if (!this.state.isDead) {
            this._stopAllActions();
            this._onStartEating();
            this.state.changeSatiety(20);
            this._onNewHrundelText(hrundelPhrases.onStopEating);
            setTimeout(() => {
                this._onStopEating();
            }, 2000);
        }
    }

    stopEating() {
        if (!this.state.isDead) {
            this._onStopEating();
            this.state.startChangingSatiety(decreaseValue, decreaseSpeed);
            this._onNewHrundelText(hrundelPhrases.onStopEating);
        }
    }

    startSpeaking() {
        if (!this.state.isDead) {
            this._stopAllActions();
            this._onStartSpeaking();

            if (recognizer.isAvailable()) {
                this._speakUsingRecognition();
            } else {
                this._speakWithoutRecognition();
            }
        }
    }

    stopSpeaking() {
        if (!this.state.isDead) {
            this._onStopSpeaking();
            if (recognizer.isAvailable()) {
                this._onNewHrundelText(hrundelPhrases.onStopSpeaking);
                recognizer.stopRecognition();
                this.state.startChangingMood(decreaseValue, decreaseSpeed);
            }
        }
    }

    _speakUsingRecognition() {
        this._onNewHrundelText(hrundelPhrases.onStartSpeaking);

        this.state.stopChangingMood();

        recognizer.startRecognition(result => {
            this._onNewHrundelText(result);
            const newValue = this.state.changeMood(1);
            if (newValue === 100) {
                this.stopSpeaking();
            }
        });
    }

    _speakWithoutRecognition() {
        this.state.changeMood(10);
        this._onNewHrundelText(hrundelPhrases.onStopSpeaking);
        setTimeout(() => {
            this._onStopSpeaking();
        }, 2000);
    }

    _stopAllActions() {
        this.stopSleeping();
        this.stopEating();
        this.stopSpeaking();
    }
}
