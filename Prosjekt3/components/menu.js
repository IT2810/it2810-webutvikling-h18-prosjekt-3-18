import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Item from './Item'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
        this.state = {
            newMenuName: 'hawdawhee',
            menuItems: [
                { name: 'Devin' },
                { name: 'Jackson' },
                { name: 'James' },
                { name: 'Joel' },
                { name: 'John' },
                { name: 'Jillian' },
                { name: 'Jimmy' },
                { name: 'Julie' },
                { name: 'dude' },
                { name: 'dude2' },
                { name: 'dude3' },
                { name: 'dude4' },
            ]
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={styles.list}
                    data={this.state.menuItems}
                    renderItem={({ item }) =>
                        <Item key={item.name}>
                            <Text style={styles.item}>{item.name}</Text>
                        </Item>}
                />
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={{ height: 40, borderTopWidth: 2, marginTop: 20, }}
                        onChangeText={(newMenuName) => this.setState({ newMenuName })}
                        value={this.state.newMenuName}
                    />
                    <Button style={styles.button} onPress={this.onPress} title={this.state.newMenuName}>
                    </Button>
                </View>
            </View>
        );
    }
    onPress() {
        let menuName = this.state.newMenuName.toString();
        let menu = [{ name: menuName }];
        this.setState({ menuItems: this.state.menuItems.concat(menu) });
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 22,
        flex: 1
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    list: {
        height: 10,
        flex: 13
    }
})

export default Menu;
