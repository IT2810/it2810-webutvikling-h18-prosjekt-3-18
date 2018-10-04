import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import CheckBox from 'react-native-checkbox'

class Task extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View>
                <CheckBox
                    label={this.props.name}
                    onChange={(checked) =>
                        this.props.handleCheckbox(this, checked)
                    }
                />
            </View>
        )
    }
}


export default Task;