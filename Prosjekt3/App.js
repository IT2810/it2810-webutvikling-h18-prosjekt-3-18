import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Button } from 'react-native';
import Menu from './components/menu'

export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
          <Menu />
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
