'use strict';

import React from 'react';
import './index.css';
import _ from 'underscore';

import SoundPlayer from '../server/models/soundPlayer';
import StateStorage from '../server/models/stateStorage';

const decreaseTimeout = 3000;
const maxIndicatorValue = 100;
const decreaseSpeed = 1;
const increaseSpeed = 5;

/* eslint-disable no-undef */
export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indicators: {
                satiety: maxIndicatorValue,
                energy: maxIndicatorValue,
                mood: maxIndicatorValue
            },
            catState: 'smile',
            isFocused: true,
            speechText: ''
        };
    }

    async componentDidMount() {
        /* eslint-disable react/no-did-mount-set-state*/
        this.setState(StateStorage.load());
        window.onfocus = () => this.setState({ isFocused: true });
        window.onblur = () => {
            if (this.state.catState !== 'dead') {
                this.speechRecognizer.stop();
                this.setState({ catState: 'sleep', isFocused: false });
            }
        };

        this.soundPlayer = new SoundPlayer();
        this.speechRecognizer = this.initSpeechRecognizer();

        this.Notification = window.Notification || window.webkitNotification;
        const response = await this.Notification.requestPermission();

        this.notificationsIsAllowed = response !== 'denied';

        setInterval(() => this.updateIndicators(), decreaseTimeout);
        window.onbeforeunload = () => StateStorage.save(this.state);
    }

    initSpeechRecognizer() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const speechRecognizer = new SpeechRecognition();

        speechRecognizer.lang = 'en-US';
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.onresult = e => this.listen(e);

        return speechRecognizer;
    }

    updateIndicators() {
        let { indicators } = this.state;

        indicators = _.mapObject(indicators, val => Math.max(val - decreaseSpeed, 0));

        if (this.state.catState === 'sleep') {
            indicators.energy = Math.min(indicators.energy + increaseSpeed, 100);
        }

        const catState = this.detectCatState();

        this.setState({ indicators, catState });
    }

    getWorstIndicator() {
        return _.chain(this.state.indicators)
            .pairs()
            .sortBy(pair => pair[1])
            .first()
            .value();
    }

    isDead() {
        return _.filter(this.state.indicators, indicatorValue => indicatorValue === 0).length >= 2;
    }

    /* eslint-disable */
    detectCatState() {
        if (this.isDead()) {
            return 'dead';
        }

        if (this.state.catState === 'listen') {
            return 'listen'
        }

        const [worstIndicatorName, worstIndicatorValue] = this.getWorstIndicator();

        if (worstIndicatorValue >= 50) {
            return 'smile';
        }

        if (worstIndicatorValue === 10) {
            this.sendNotification(worstIndicatorName);
        }

        return worstIndicatorName === 'mood' ? 'angry' : 'sad';
    }

    sendNotification(worstState) {
        if (!this.notificationsIsAllowed || this.state.isFocused) {
            return;
        }

        /* eslint-disable no-new */
        new this.Notification(
            'my little kitty',
            {
                body: worstState === 'mood' ? 'I miss you' : 'i am so hungry! Please feed me',
                icon: `/static/sad.svg`
            }
        );
    }

    revive() {
        this.setState({
            indicators: {
                satiety: maxIndicatorValue,
                energy: maxIndicatorValue,
                mood: maxIndicatorValue
            },
            catState: 'smile'
        });
    }

    feed() {
        if (this.state.catState === 'dead') {
            return;
        }
        const { indicators } = this.state;

        this.speechRecognizer.stop();
        indicators.satiety = Math.min(indicators.satiety + increaseSpeed, maxIndicatorValue);
        this.setState({ indicators, catState: 'eat' });
    }

    startListen() {
        if (this.state.indicators.mood === maxIndicatorValue 
            || this.state.catState === 'dead' 
            || this.state.catState === 'listen') {
            return;
        }
        this.speechRecognizer.start();
        this.setState({ catState: 'listen' });
    }

    listen(speechEvent) {
        if (this.state.mood === maxIndicatorValue) {
            this.speechRecognizer.stop();
        }

        let speechText = '';

        for (let i = speechEvent.resultIndex; i < event.results.length; i += 1) {
            speechText += speechEvent.results[i][0].transcript;
        }

        const { indicators } = this.state;

        indicators.mood = Math.min(indicators.mood + increaseSpeed, maxIndicatorValue);
        this.setState({ speechText, indicators });
    }

    render() {
        return (
            <main className="main">
                <div className="game-region">
                    <div className="cat-indicators">
                        <p>satiety: {this.state.indicators.satiety}</p>
                        <p>energy: {this.state.indicators.energy}</p>
                        <p>mood: {this.state.indicators.mood}</p>
                        <p>state: {this.state.catState}</p>
                        <textarea className="speech-output" value={this.state.speechText} readOnly />
                        <button onClick={() => this.feed()}>feed</button>
                        <button onClick={() => this.revive()}>revive</button>
                    </div>
                    <img className="cat" onClick={() => this.startListen()} src={`/static/${this.state.catState}.svg`} alt="cat smile" />
                </div>
            </main>
        );
    }
}
