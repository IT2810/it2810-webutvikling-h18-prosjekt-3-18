import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Button } from 'react-native';
import Menu from './components/menu'
import ProgressBar from './components/ProgressBar.js';
import {StepCounterComponent} from "./components/StepCounterComponent";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            current_val: 13,
            max_val: 15,
            dailyGoal: 6000,
        };

        this._increment_current = this._increment_current.bind(this);
    }

    render() {
        return (
            <View style={{ flex: 5 }}>
                <View style={styles.container}>
                        <StepCounterComponent limit={this.state.dailyGoal} />
                </View>
            </View>
        );
    }

    /**
     * Used for incrementing the value in the progress bar.
     * If several bars are to be used, an id has to be used
     * as a parameter.
     * @private
     */
    _increment_current() {
        let prev_s = this.state;
        this.setState({
            current_val: prev_s.current_val + 1,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

Expo.registerRootComponent(App);