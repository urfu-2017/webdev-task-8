export let DomHruborgText;
export let DomHruborgImage;
export let DomFeedButton;
export let DomSatiety;
export let DomEnergy;
export let DomMood;
export let DomSatietyCard;
export let DomEnergyCard;
export let DomMoodCard;
export let DomNewGameButton;
export let DomSoundController;
export let DomHelp;
export let DomCloseHelpButton;

export function initDomElements() {
    DomHruborgText = document.querySelector('.hrundel__text');
    DomHruborgImage = document.querySelector('.hrundel__img');
    DomFeedButton = document.querySelector('.feed-button');
    DomSatiety = document.querySelector('.satiety-value');
    DomEnergy = document.querySelector('.energy-value');
    DomMood = document.querySelector('.mood-value');
    DomSatietyCard = document.querySelector('.satiety-card');
    DomEnergyCard = document.querySelector('.energy-card');
    DomMoodCard = document.querySelector('.mood-card');
    DomNewGameButton = document.querySelector('.new-game-button');
    DomSoundController = document.querySelector('.sound-controller');
}

