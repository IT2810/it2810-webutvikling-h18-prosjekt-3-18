import React from 'react';

import Menu from './components/menu';

export default class App extends React.Component {
    constructor() {
        super();
      /*
        this.state = {
            current_val: 13,
            max_val: 15,
            dailyGoal: 6000,
        };
        */

    }

    render() {
        return (
          {/*
          <View style={{ flex: 5 }}>
                <View style={styles.container}>
                        <StepCounterComponent limit={this.state.dailyGoal} />
                </View>
            </View>
          */}
            <Menu />

        );
    }
}

          /*
const styles = StyleSheet.create({
    container: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
*/
Expo.registerRootComponent(App);

