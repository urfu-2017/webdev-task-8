import Game from './game';
import satietySetup from './satiety';
import Animator from './animator';
import moodSetup from './mood';
import notificationSetup from './notification';

const game = new Game();

const animator = new Animator();
animator.drawHero();

window.onfocus = () => game.wakeUp();
window.onblur = () => game.sleep();

game.on('death', () => animator.animateDeath());

game.on('stateChanged', () => {
    document.querySelector('.satiety .state__feature-value').innerHTML = game.state.energy;
    document.querySelector('.energy .state__feature-value').innerHTML = game.state.satiety;
    document.querySelector('.mood .state__feature-value').innerHTML = game.state.mood;
});
document.querySelector('.new-game-btn')
    .addEventListener('click', () => game.reset());
satietySetup(game);
moodSetup(game, animator);
notificationSetup(game);

game.start();
