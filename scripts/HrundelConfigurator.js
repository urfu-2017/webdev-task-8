import { DomHruborgText, DomSoundController,
    DomEnergyCard, DomSatietyCard, DomMoodCard } from './Dom/Dom';
import notifications from './lib/Notifications';
import { hrundelPhrases, sounds, blinkingInteraval, periodicSoundInterval } from '../config/config';
import SVG from './Svg/SVG';

const svgDraw = new SVG();

let periodicSoundIntervalId;

export function сonfigurateHrundel(hrundel) {
    svgDraw.drawHrundel();

    initNotifications();

    initOnStatesChange(hrundel);
    initOnStartActions(hrundel);
    initOnStopActions(hrundel);
    initOnHrundelHealthChanges(hrundel);

    hrundel.onNewHrundelText = (newText) => {
        DomHruborgText.innerHTML = newText;
    };

    hrundel.onStartDying = () => {
        svgDraw.startBlinking(blinkingInteraval);
    };

    startPeriodicSound(periodicSoundInterval);

    return hrundel;
}

function initNotifications() {
    if (notifications.isAvailable()) {
        notifications.init();
    }
}

function initOnStatesChange(hrundel) {
    hrundel.onEnergyChange = (newValue) => {
        svgDraw.updateText(newValue, 1);
    };

    hrundel.onMoodChange = (newValue) => {
        svgDraw.updateText(newValue, 2);
    };

    hrundel.onSatietyChange = (newValue) => {
        svgDraw.updateText(newValue, 0);
    };
}

function initOnStartActions(hrundel) {
    hrundel.onStartSleeping = () => {
        svgDraw.makeSleepingEyes(1500);
        svgDraw.stopBlinking();
        DomEnergyCard.style.fontWeight = 'bold';
        playAudioWithSettedVolume(sounds.onStartAction);
    };

    hrundel.onStartEating = () => {
        playAudioWithSettedVolume(sounds.onMeal);
        DomSatietyCard.style.fontWeight = 'bold';
    };

    hrundel.onStartSpeaking = () => {
        playAudioWithSettedVolume(sounds.onStartAction);
        DomMoodCard.style.fontWeight = 'bold';
    };
}

function initOnStopActions(hrundel) {
    hrundel.onStopSleeping = () => {
        svgDraw.makeAliveEyes(1500);
        svgDraw.startBlinking(blinkingInteraval);
        DomEnergyCard.style.fontWeight = 'normal';
    };

    hrundel.onStopEating = () => {
        DomSatietyCard.style.fontWeight = 'normal';
    };

    hrundel.onStopSpeaking = () => {
        DomMoodCard.style.fontWeight = 'normal';
    };
}

function initOnHrundelHealthChanges(hrundel) {
    hrundel.onPoorHealth = () => {
        svgDraw.makeSadFace(1000);
        playAudioWithSettedVolume(sounds.onPoorHealth);
        if (document.hidden && notifications.isAvailable()) {
            notifications.sendNotification('Хрюногочи',
                hrundelPhrases.onPoorHealth);
        }
    };

    hrundel.onDeath = () => {
        svgDraw.makeDeadEyes(1000);
        svgDraw.stopBlinking();
        stopPeriodicSound();
        playAudioWithSettedVolume(sounds.onDeath);
        if (document.hidden && notifications.isAvailable()) {
            notifications.sendNotification('Хрюногочи', hrundelPhrases.onDeath);
        }
    };

    hrundel.onReset = () => {
        svgDraw.makeHappyFace(1000);
        svgDraw.makeAliveEyes(1000);
        svgDraw.startBlinking(blinkingInteraval);
        startPeriodicSound(periodicSoundInterval);
        playAudioWithSettedVolume(sounds.onNewGame);
        DomMoodCard.style.fontWeight = 'normal';
        DomSatietyCard.style.fontWeight = 'normal';
        DomEnergyCard.style.fontWeight = 'normal';
    };

    hrundel.onGoodHealth = () => {
        svgDraw.makeHappyFace(1000);
    };
}

function startPeriodicSound(interval) {
    clearInterval(periodicSoundIntervalId);
    periodicSoundIntervalId = setInterval(() => {
        playAudioWithSettedVolume(sounds.periodicSound);
    }, interval);
}

function stopPeriodicSound() {
    clearInterval(periodicSoundIntervalId);
}

function playAudioWithSettedVolume(file) {
    const audio = new Audio(file);
    audio.volume = DomSoundController.value;
    audio.play();
}
