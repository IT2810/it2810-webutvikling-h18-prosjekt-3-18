import React, { Component, } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

class Item extends Component {
    constructor(props) {
        super(props);
        this.onPressDelete = this.onPressDelete.bind(this);
    }

    /* 
    Dette er en item i listen som vises. I en item kan det enten være en meny eller en oppgave.
    Item gir felles metoder for både menyene og oppgavene, som feks delete knappen eller stylingen som begge må ha.
    Videre spesialisering av items inn i meny eller oppgave skjer i underkomponentene TodoList.js eller Task.js.
    */

    render() {
        return (
            <View style={styles.items}>
                {this.props.children}
                <TouchableOpacity title="Delete" onPress={this.onPressDelete}>
                    <MaterialIcons name="delete" size={40} color="black" />
                </TouchableOpacity>
            </View>
        );
    }

    onPressDelete() {
        this.props.onDelete(this.props.id);
    }

}
const styles = StyleSheet.create({
    items: {
        borderTopWidth: 1,
        flexDirection: 'row',
        borderStyle: 'dashed'
    }


});
export default Item;
