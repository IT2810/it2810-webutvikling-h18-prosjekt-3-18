import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class Item extends Component {
    constructor(props) {
        super(props);
        this.onPressDelete = this.onPressDelete.bind(this);
    }

    render() {
        return (
            <View style={{ borderTopWidth: 1, flexDirection: 'row' }}>
                {this.props.children}
                <Button onPress={this.onPressDelete} title="Delete"/>
            </View>
        );
    }

    onPressDelete() {
        this.props.onDelete(this.props.id);
    }

}

export default Item;
