import Game from './game';
import satietySetup from './satiety';
import Animator from './animator';
import moodSetup from './mood';
import notificationSetup from './notification';

const game = new Game();

const animator = new Animator();

window.onfocus = () => game.wakeUp();
window.onblur = () => game.sleep();

game.on('death', () => animator.animateDeath());
game.on('start', () => animator.drawHero());
game.on('wakeUp', () => animator.animateWaking());
game.on('sleep', () => animator.animateSleep());
game.on('feed', () => animator.animateFeeding());

game.on('stateChanged', () => {
    document.querySelector('.satiety .state__feature-value').innerHTML = game.state.satiety;
    document.querySelector('.energy .state__feature-value').innerHTML = game.state.energy;
    document.querySelector('.mood .state__feature-value').innerHTML = game.state.mood;
});
document.querySelector('.new-game-btn')
    .addEventListener('click', () => {
        game.reset();
        animator.resetCurrentAnimation();
    });
satietySetup(game);
moodSetup(game, animator);
notificationSetup(game);

game.start();
