import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import CheckBox from 'react-native-check-box'

class Task extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={styles.container}>
                <CheckBox
                    isChecked={this.props.checked}
                    onClick={() => {this.props.handleCheckbox(this.props.id)}}
                />
                <Text> {this.props.name} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex:0.95,
        marginLeft:2,
        paddingTop:2,
        marginTop:2
    }
});

export default Task;