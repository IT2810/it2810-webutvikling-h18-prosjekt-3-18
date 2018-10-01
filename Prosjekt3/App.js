import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Button } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import Menu from './components/menu'
import ProgressBar from './components/ProgressBar.js';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            current_val: 2,
            max_val: 15
        };

        this._increment_current = this._increment_current.bind(this);
    }

    render() {
        return (
          <Menu />
            <View style={styles.container}>
                <ProgressBar
                    max={this.state.max_val}
                    current ={this.state.current_val}
                    height={10}
                    width={25}/>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
