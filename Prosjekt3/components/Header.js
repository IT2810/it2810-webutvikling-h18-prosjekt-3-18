import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Dette er headeren på siden. Den viser tittelen
 * på siden du er på og tilbakeknapp for navigasjon.
 */
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
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>{this.props.title} </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
        text: {
            fontWeight: 'bold',
            fontSize: 20,
            width: "100%",
            textAlign: "center"
        },
        textWrapper: {
            flexGrow: 1,
            left: -20
        }
    }
);

export default Header;
