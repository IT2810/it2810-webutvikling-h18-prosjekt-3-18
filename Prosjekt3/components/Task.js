import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import CheckBox from 'react-native-check-box'

class Task extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {

    }

    render() {
        return (
            <View style={{ flexDirection: 'row', flex: 0.95, marginLeft: 2, paddingTop: 2, marginTop: 2 }} style={this.greyStyle()}>
                <CheckBox
                    isChecked={this.props.checked}
                    onClick={(e) => {
                        console.log("trykket");
                        this.props.handleCheckbox(this.props.id)
                    }
                    }
                />
                <Text> {this.props.name} </Text>
            </View>
        )
    }
}

greyStyle = function () {
    if (this.props.checked === true) {
        return {
            borderRadius: 12,
            background: 'grey',
        }
    }
}


export default Task;