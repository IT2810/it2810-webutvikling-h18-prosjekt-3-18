import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ borderTopWidth: 1 }}>
                <Text> Menu: </Text>
                {this.props.children}
            </View>
        );
    }
}

export default Item;
