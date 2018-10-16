import React, { Component,  } from 'react';
import { View, Text, Button, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

class Item extends Component {
    constructor(props) {
        super(props);
        this.onPressDelete = this.onPressDelete.bind(this);
    }

    render() {
        return (
            <View style={{ borderTopWidth: 1, flexDirection: 'row', borderStyle: 'dashed'}}>
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

export default Item;
