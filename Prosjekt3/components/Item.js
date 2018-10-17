import React, { Component,  } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

class Item extends Component {
    constructor(props) {
        super(props);
        this.onPressDelete = this.onPressDelete.bind(this);
    }

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
