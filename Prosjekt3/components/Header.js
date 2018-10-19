import React, { Component } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={this.props.styleHeader} >
                {this.props.menu !== null ?
                    <TouchableOpacity
                        title="Back"
                        underlayColor="white"
                        onPress={this.props.back}
                    >
                    <View>
                        <MaterialIcons name="arrow-back" size={45} color="black" />
                    </View>
                    </TouchableOpacity>
                : null}
                <View style={{flexGrow: 1, left: -20}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, width: "100%", textAlign: "center"}}>{this.props.title} </Text>
                </View>
            </View>
        );
    }
}

export default Header;
