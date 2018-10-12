import React from 'react';

import Menu from './components/Menu';

import { StackNavigator } from 'react-navigation';
const AppNavigator = StackNavigator({
    HomeScreen: { screen: Menu }

});

export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <AppNavigator />
        );
    }
}

Expo.registerRootComponent(App);

