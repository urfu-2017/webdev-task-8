import { DomHruborgText, DomEnergy, DomSatiety, DomMood, DomSoundController,
    DomEnergyCard, DomSatietyCard, DomMoodCard } from './DomElements/DomElements';
import notifications from './lib/Notifications';
import { playAudio } from './lib/Audio';
import { hrundelPhrases, notificationImage,
    sounds, blinkingInteraval, periodicSoundInterval } from '../config/config';
import Drawer from './Drawer/Drawer';

const DRAWER = new Drawer();

let periodicSoundIntervalId;

export function сonfigurateHrundel(hrundel) {
    DRAWER.drawHrundel();

    initNotifications();

    initOnStatesChange(hrundel);
    initOnStartActions(hrundel);
    initOnStopActions(hrundel);
    initOnHrundelHealthChanges(hrundel);

    hrundel.onNewHrundelText = (newText) => {
        DomHruborgText.innerHTML = newText;
    };

    hrundel.onStartDying = () => {
        DRAWER.startBlinking(blinkingInteraval);
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
        DomEnergy.innerHTML = `${newValue}%`;
    };

    hrundel.onMoodChange = (newValue) => {
        DomMood.innerHTML = `${newValue}%`;
    };

    hrundel.onSatietyChange = (newValue) => {
        DomSatiety.innerHTML = `${newValue}%`;
    };
}

function initOnStartActions(hrundel) {
    hrundel.onStartSleeping = () => {
        DRAWER.makeSleepingEyes(1500);
        DRAWER.stopBlinking();
        DomEnergyCard.style.fontWeight = 'bold';
        playAudioWithSettedVolume(sounds.onStartAction);
    };

    hrundel.onStartEating = () => {
        playAudioWithSettedVolume(sounds.onStartAction);
        DomSatietyCard.style.fontWeight = 'bold';
    };

    hrundel.onStartSpeaking = () => {
        playAudioWithSettedVolume(sounds.onStartAction);
        DomMoodCard.style.fontWeight = 'bold';
    };
}

function initOnStopActions(hrundel) {
    hrundel.onStopSleeping = () => {
        DRAWER.makeAliveEyes(1500);
        DRAWER.startBlinking(blinkingInteraval);
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
        DRAWER.makeSadFace(1000);
        playAudioWithSettedVolume(sounds.onPoorHealth);
        if (document.hidden && notifications.isAvailable()) {
            notifications.sendNotification('Хрюногочи',
                hrundelPhrases.onPoorHealth, notificationImage);
        }
    };

    hrundel.onDeath = () => {
        DRAWER.makeDeadEyes(1000);
        DRAWER.stopBlinking();
        stopPeriodicSound();
        playAudioWithSettedVolume(sounds.onDeath);
        if (document.hidden && notifications.isAvailable()) {
            notifications.sendNotification('Хрюногочи', hrundelPhrases.onDeath, notificationImage);
        }
    };

    hrundel.onReset = () => {
        DRAWER.makeHappyFace(1000);
        DRAWER.makeAliveEyes(1000);
        DRAWER.startBlinking(blinkingInteraval);
        startPeriodicSound(periodicSoundInterval);
        playAudioWithSettedVolume(sounds.onNewGame);
        DomMoodCard.style.fontWeight = 'normal';
        DomSatietyCard.style.fontWeight = 'normal';
        DomEnergyCard.style.fontWeight = 'normal';
    };

    hrundel.onGoodHealth = () => {
        DRAWER.makeHappyFace(1000);
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
    playAudio(file, DomSoundController.value);
}
