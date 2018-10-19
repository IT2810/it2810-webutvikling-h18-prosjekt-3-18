import { Pedometer } from "expo";
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ProgressBar from "./ProgressBar";
import { MaterialIcons } from '@expo/vector-icons';

export class StepCounterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPedometerAvailable: "checking",
            pastStepCount: 0,
            currentStepCount: 0,
            dailyGoal: this.props.limit
        };

    }

    componentDidMount() {
        this._subscribe();

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
        start.setHours(0, 0, 0, 0);
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



    render() {
        return (
            <View>
                <View style={styles.container}>
                    <Text>
                        Steps taken today: {this.state.pastStepCount} / {this.state.dailyGoal}
                    </Text>
                    <View style={styles.StepContainer}>
                        <MaterialIcons name="directions-walk" size={20} color="black" />
                        <ProgressBar
                            current={parseInt(this.state.pastStepCount + 2 - 2)}
                            max={this.state.dailyGoal}
                            height={10}
                            width={200}
                        />
                        <MaterialIcons name="flag" size={20} color="black" />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    StepContainer: {
        flexDirection: 'row',
        paddingTop: 20
    }
});

Expo.registerRootComponent(StepCounterComponent);

