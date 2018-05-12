import { Game } from './game';
import UI from './ui';

const root = document.querySelector('#root');

const game = new Game(root);
const ui = new UI(root, game);

ui.link();
game.run();
