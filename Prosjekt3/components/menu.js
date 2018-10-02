import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Item from './Item'
import ProgressBar from "./ProgressBar";
import ItemTodo from "./ItemTodo";

class Menu extends Component {
    constructor() {
        super();
        this.onPress = this.onPress.bind(this);
        this.guid = this.guid.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.state = {
            newMenuName: 'Homework',
            menuItems: [
            ],
            current_val: 2,
            max_val: 15
        };
        this._increment_current = this._increment_current.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <ProgressBar
                    max={this.state.max_val}
                    current ={this.state.current_val}
                    height={10}
                    width={25}/>
                <FlatList
                    extraData={this.state}
                    style={styles.list}
                    data={this.state.menuItems}
                    renderItem={({ item }) =>
                        <Item key={item.key} id={item.key} onDelete={this.deleteItem}>
                            <ItemTodo name={item.title}/>
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
    };

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
     * Used for incrementing the value in the progress bar.
     * If several bars are to be used, an id has to be used
     * as a parameter.
     * @private
     */
    _increment_current() {
        let prev_s = this.state;
        this.setState({
            current_val: prev_s.current_val + 1,
        })
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
});

export default Menu;
