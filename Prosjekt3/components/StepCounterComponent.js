import { Pedometer } from "expo";
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export class StepCounterComponent extends React.Component {
    constructor(props) {
        super(props);
        state = {
            isPedometerAvailable: "checking",
            pastStepCount: 0,
            currentStepCount: 0
        };

    }

    componentDidMount() {
        this._subscribe();
        console.log(this.state.isPedometerAvailable)
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    _subscribe = () => {
        this._subscription = Pedometer.watchStepCount(result => {
            this.setState({
                currentStepCount: result.steps
            });
        });



        Pedometer.isAvailableAsync().then(
            result => {
                this.setState({
                    isPedometerAvailable: String(result)
                });
            },
            error => {
                this.setState({
                    isPedometerAvailable: "Could not get isPedometerAvailable: " + error
                });
            }
        );
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);
        Pedometer.getStepCountAsync(start, end).then(
            result => {
                this.setState({ pastStepCount: result.steps });
            },
            error => {
                this.setState({
                    pastStepCount: "Could not get stepCount: " + error
                });
            }
        );
    };
    _unsubscribe = () => {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    };



    render()
        {
            return (
                <View style={{flex: 5}}>
                    <View style={styles.container}>
                        <Text>
                            Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
                        </Text>
                        <Text>
                            Steps taken in the last 24 hours: {this.state.pastStepCount}
                        </Text>
                        <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
                    </View>
                </View>
            );
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

Expo.registerRootComponent(StepCounterComponent);

