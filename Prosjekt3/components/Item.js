import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class Item extends Component {
    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    render() {
        return (
            <View style={{ borderTopWidth: 1, flexDirection: 'row' }}>
                <Text> Menu: </Text>
                {this.props.children}
                <Button onPress={this.onPress} title="Delete"></Button>
            </View>
        );
    }
    onPress() {
        this.props.onDelete(this.props.id);
    }
}

export default Item;
