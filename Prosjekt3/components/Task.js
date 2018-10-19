import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import CheckBox from 'react-native-check-box'

class Task extends Component {
    constructor() {
        super();
    }

    /* 
    Task er brukt som en sub-komponent for Item.js i listen man har på siden. 
    Alt task gjør er å rendre en checkbox og navnet på oppgaven.

    Ved klikk av sjekkboksen returneres dette med id-en til sjekkboksen til en funksjon i
    Menu.js som lagrer at den har forandret state i cachen slik at endringen forblir over 
    oppdatering av siden.
    */

    render() {
        return (
            <View style={styles.container}>
                <CheckBox
                    isChecked={this.props.checked}
                    onClick={() => { this.props.handleCheckbox(this.props.id) }}
                />
                <Text> {this.props.name} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 0.95,
        marginLeft: 2,
        paddingTop: 2,
        marginTop: 2
    }
});

export default Task;