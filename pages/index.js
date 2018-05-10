'use strict';

import React from 'react';
import './index.css';

const decreaseTimeout = 3000;
const maxIndicatorValue = 100;

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            indicators: {
                satiety: maxIndicatorValue,
                energy: maxIndicatorValue,
                mood: maxIndicatorValue
            },
            catState: 'smile'
        };
    }

    componentDidMount() {
        this.loadStateFromLocalStorage();
        window.onblur = () => {
            if (this.state.catState !== 'dead') {
                this.setState({ catState: 'sleep' });
            }
        };

        setInterval(() => this.updateIndicators(), decreaseTimeout);
        window.onbeforeunload = () => this.saveStateToLocalStorage();
    }

    loadStateFromLocalStorage() {
        let indicators = localStorage.getItem('indicators');

        if (indicators) {
            this.setState({
                indicators: JSON.parse(indicators),
                catState: localStorage.getItem('catState')
            });
        } else {
            indicators = {
                satiety: maxIndicatorValue,
                energy: maxIndicatorValue,
                mood: maxIndicatorValue
            };
            localStorage.setItem('indicators', JSON.stringify(indicators));
            localStorage.setItem('catState', 'smile');
            this.setState({ indicators, catState: 'smile' });
        }
    }

    saveStateToLocalStorage() {
        localStorage.indicators = JSON.stringify(this.state.indicators);
        localStorage.catState = this.state.catState;
    }

    updateIndicators() {
        const { indicators } = this.state;

        for (const key of Object.keys(indicators)) {
            indicators[key] = Math.max(indicators[key] - 1, 0);
        }

        if (this.state.catState === 'sleep') {
            indicators.energy = Math.min(indicators.energy + 6, 100);
        }

        const catState = this.detectCatState();

        this.setState({ indicators, catState });
    }

    detectCatState() {
        const { indicators } = this.state;
        const criticalIndicators = Object.keys(indicators).filter(x => indicators[x] === 0);

        if (criticalIndicators.length >= 2) {
            return 'dead';
        }

        const [worstIndicator] = Object
            .keys(indicators)
            .map(key => [key, indicators[key]])
            .sort((a, b) => a[1] - b[1]);

        if (worstIndicator[1] >= 50) {
            return 'smile';
        }

        if (worstIndicator[0] === 'mood') {
            return 'angry';
        }

        return 'sad';
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

        this.setState({ catState: 'eat' });
        const { indicators } = this.state;

        indicators.satiety = Math.min(indicators.satiety + 5, maxIndicatorValue);
        this.setState({ indicators });
    }

    render() {
        return (
            <main className="main">
                <div className="cat-indicators">
                    <p>satiety: {this.state.indicators.satiety}</p>
                    <p>energy: {this.state.indicators.energy}</p>
                    <p>mood: {this.state.indicators.mood}</p>
                    <p>state: {this.state.catState}</p>
                    <button onClick={this.feed()}>feed</button>
                    <button onClick={this.revive()}>revive</button>
                </div>
                <img className="cat" src={`/static/${this.state.catState}.svg`} alt="cat smile" />
            </main>
        );
    }
}
