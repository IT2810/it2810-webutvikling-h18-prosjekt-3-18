import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Item from './Item';
import Header from './Header';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.guid = this.guid.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.state = {
            currentMenu: null,
            newMenuName: 'Homework',
            menuItems: [
            ],
            tasks: [
            ],
            currentViewItems: [
            ]
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={this.state.currentMenu} />
                <FlatList
                    extraData={this.state}
                    style={styles.list}
                    data={this.state.currentViewItems}
                    renderItem={({ item }) =>
                        <Item key={item.key} id={item.key} onDelete={this.deleteItem} onOpen={this.openMenu} menu={item.menu}>
                            <Text style={styles.item}>{item.title}</Text>
                        </Item>}
                />
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={{ height: 40, borderTopWidth: 2, marginTop: 20, }}
                        onChangeText={(newMenuName) => this.setState({ newMenuName })}
                        value={this.state.newMenuName}
                    />
                    <Button style={styles.button} onPress={this.onAdd} title="Add"></Button>
                    {this.state.currentMenu !== null ? <Button style={styles.button} onPress={this.back} title="Back" /> : null}
                </View>
            </View>
        );
    }

    onAdd = e => {
        let id = this.guid();
        let titleName = this.state.newMenuName;
        if (this.state.currentMenu === null) {
            let menu = [{ title: titleName, key: id, menu: true }];
            this.setState({ currentViewItems: this.state.currentViewItems.concat(menu) }, function () {
                this.setState({ menuItems: this.state.menuItems.concat(menu) });
            })
        } else {
            console.log("ehfbsefj");
            let parent = this.state.currentMenu;
            let task = [{ title: titleName, key: id, menu: false, parentID: parent }]
            this.setState({ currentViewItems: this.state.currentViewItems.concat(task) }, function () {
                this.setState({ tasks: this.state.tasks.concat(task) });
            })
        }
    }

    back = e => {
        this.setState({ currentMenu: null });
        this.setState({ currentViewItems: this.state.menuItems });
    }

    deleteItem = e => {
        let deleteListCurrent = this.state.currentViewItems;
        let deleteListMenu = this.state.menuItems;
        if (this.state.currentMenu === null) {
            for (let i = 0; i < this.state.menuItems.length; i++) {
                let item = this.state.menuItems[i];
                if (item.key === e) {
                    deleteListCurrent.splice(item, 1);
                    deleteListMenu.splice(item, 1);
                }
            }
            this.setState({ currentViewItems: deleteListCurrent }, function () {
                this.setState({ menuItems: deleteListMenu });
            });
        }
        deleteListCurrent = this.state.currentViewItems;
        deleteListTasks = this.state.tasks;
        for (let i = 0; i < this.state.tasks.length; i++) {
            let item = this.state.tasks[i];
            if (item.key === e) {
                deleteListCurrent.splice(item, 1);
                deleteListTasks.splice(item, 1);
            }
        }
        this.setState({ currentViewItems: deleteListCurrent }, function () {
            this.setState({ tasks: deleteListTasks });
        });
    }

    openMenu = e => {
        this.state.currentMenu = e;
        let ny = [];
        for (let i = 0; i < this.state.tasks.length; i++) {
            let item = this.state.tasks[i];
            if (item.parentID === e) {
                ny.push(item);
            }
        }
        this.setState({ currentViewItems: ny });
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
