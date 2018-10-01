import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Item from './Item'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.onPress = this.onPress.bind(this);
        this.guid = this.guid.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.state = {
            newMenuName: 'Homework',
            menuItems: [
            ]
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    extraData={this.state}
                    style={styles.list}
                    data={this.state.menuItems}
                    renderItem={({ item }) =>
                        <Item key={item.key} id={item.key} onDelete={this.deleteItem}>
                            <Text style={styles.item}>{item.title}</Text>
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
        let titleName = this.state.newMenuName.toString();
        let id = this.guid();
        let menu = [{ title: titleName, key: id }];
        this.setState({ menuItems: this.state.menuItems.concat(menu) });
    }

    deleteItem = e => {
        for (let i = 0; i < this.state.menuItems.length; i++) {
            let item = this.state.menuItems[i];
            if (item.key === e) {
                this.state.menuItems.splice(this.state.menuItems.indexOf(item), 1);
            }
        }
        this.setState({ menuItems: this.state.menuItems })
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
