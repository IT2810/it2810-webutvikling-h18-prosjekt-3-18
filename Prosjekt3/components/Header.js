import React, { Component } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={this.props.styleHeader}>
                {this.props.menu !== null ?
                    <TouchableOpacity title="Back" underlayColor="white" onPress={this.props.back}>
                    <View style={this.props.styleButton}>
                        <MaterialIcons name="arrow-back" size={30} color="black" />
                    </View>
                    </TouchableOpacity>
                    : null}
                <Text> {this.props.title} </Text>
            </View>
        );
    }
}

export default Header;
