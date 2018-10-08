import React from 'react';

import Menu from './components/menu';

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

Expo.registerRootComponent(App);

