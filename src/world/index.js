import ambientLight from './ambientLight';
import battery from './battery';
import tab from './tab';
import speechRecognition from './speechRecognition';


const ILLUMINANCE_THRESHOLD = 300;


export const getWorldData = () => ({
    night: ambientLight < ILLUMINANCE_THRESHOLD,
    feeding: battery.charging,
    leaving: !tab.focused,
    ...speechRecognition
});
