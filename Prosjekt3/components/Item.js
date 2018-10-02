import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class Item extends Component {
    constructor(props) {
        super(props);
        this.onPressDelete = this.onPressDelete.bind(this);
        this.onPressOpen = this.onPressOpen.bind(this);
        this.code = this.code.bind(this);
    }

    render() {
        return (
            <View style={{ borderTopWidth: 1, flexDirection: 'row' }}>
                {this.props.children}
                {this.code()}
                <Button onPress={this.onPressDelete} title="Delete"></Button>
            </View>
        );
    }
    code() {
        if (this.props.menu === true) {
            return (
                <View>
                    <Button onPress={this.onPressOpen} title="Open"></Button>
                </View>
            )
        }
    }

    onPressDelete() {
        this.props.onDelete(this.props.id);
    }
    onPressOpen() {
        this.props.onOpen(this.props.id);
    }
}

export default Item;
