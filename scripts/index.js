import { Hrundel } from './model';
import { setState, feedButton, resetButton } from './view';

if ('Notification' in window) {
    Notification.requestPermission();
}

const hrundel = new Hrundel(JSON.parse(localStorage.getItem('hrundel')) || {}, setState);

feedButton.onclick = () => hrundel.feed();
resetButton.onclick = () => hrundel.reset();
