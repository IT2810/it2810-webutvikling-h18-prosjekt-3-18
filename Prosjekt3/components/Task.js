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
            <View>
                <CheckBox
                    isChecked={this.props.checked}
                    onClick={(e) => {
                        console.log("trykket");
                        this.props.handleCheckbox(this.props.id)
                    }
                    }
                />
            </View>
        )
    }
}


export default Task;