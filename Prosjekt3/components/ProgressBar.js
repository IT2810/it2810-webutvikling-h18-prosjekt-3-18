import React, {Component} from 'react';
import {View} from 'react-native';
import {Bar} from 'react-native-progress';

/**
 * Simple Progress bar to be used in Todolists.
 * Height and width should be decided from parent.
 * Library used:
 * https://github.com/oblador/react-native-progress
 */
class ProgressBar extends Component {
    render() {
        let calc_val =
            parseInt(this.props.current)
            / parseInt(this.props.max);
        return (
            <View>
                <Bar
                    progress={calc_val}
                    color={'#0F0'}
                    width={this.props.width}
                    height={this.props.height}
                    unfilledColor={'#F22'}
                    borderColor={"#000"}
                    />
            </View>
        )
    }
}

export default ProgressBar;