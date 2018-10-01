import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Button } from 'react-native';
import ProgressBar from './components/ProgressBar.js';
import ItemTodo from "./components/ItemTodo";


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            current_val: 1,
            max_val: 1
        };

        this._increment_current = this._increment_current.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <ProgressBar
                    current ={this.state.current_val}
                    max={this.state.max_val}
                    height={10}
                    width={25}/>
                <ItemTodo label="Do school"/>

                {/*<ItemTodo label="Take trash"/>*/}
                {/*<ItemTodo label="Finish Finland"/>*/}
                {/*<ItemTodo label="Go to bar"/>*/}
                {/*<ItemTodo label="Finish project"/>*/}
                {/*<ItemTodo label="Water plants"/>*/}
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