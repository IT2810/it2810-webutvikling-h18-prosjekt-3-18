import React from 'react';

import Menu from './components/Menu';



export default class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Menu style={{ flex: 1 }} />
        );
    }
}

Expo.registerRootComponent(App);

