import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Item from './Item'
import Task from "./Task";

import Header from './Header';
import TodoList from "./TodoList";


class Menu extends Component {
    constructor() {
        super();
        this.onAdd = this.onAdd.bind(this);
        this.guid = this.guid.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.increment_current = this.increment_current.bind(this);
        this.handleCheckTask = this.handleCheckTask.bind(this);

        /**
         * currentMenu: current menu displayed, null if in main menu.
         * newMenuName: Text from textInput.
         * menuItems: menus that can be added with add button if in main menu.
         * completedTasks: completed tasks for a TodoList. FIXME place inside menuItem
         * totalTasks: total number of tasks. FIXME see over.
         * tasks: task objects. Belongs to a parent (menuItem).
         * currentViewItems: The current items displayed on the screen. Updates often.
         */
        this.state = {
            currentMenu: null,
            newMenuName: 'Homework',
            menuItems: [
            ],
            tasks: [
            ],
            completedTasks: 0,
            totalTasks: 5,
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
                        <Item
                            key={item.key}
                            id={item.key}
                            onDelete={this.deleteItem}
                        >
                            {item.menu === true ?
                                <TodoList
                                    name={item.title}
                                    id={item.key}
                                    onOpen={this.openMenu}
                                    complete={this.state.completedTasks}
                                    total={this.state.totalTasks}
                                />
                                :
                                <Task
                                    name={item.title}
                                    id={item.key}
                                    checked={item.checked}
                                    handleCheckbox={this.handleCheckTask}
                                />}
                        </Item>
                    }
                />
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={{ height: 40, borderTopWidth: 2, marginTop: 20, }}
                        onChangeText={(newMenuName) => this.setState({ newMenuName })}
                        value={this.state.newMenuName}
                    />
                    <Button style={styles.button} onPress={this.onAdd} title="Add">Add</Button>
                    {this.state.currentMenu !== null ? <Button style={styles.button} onPress={this.back} title="Back" /> : null}
                </View>
            </View>
        );
    }

    onAdd = e => {
        // TODO: Fetch from asyncstorage
        let id = this.guid();
        let titleName = this.state.newMenuName;
        if (this.state.currentMenu === null) {
            let menu = [{ title: titleName, key: id, menu: true }];
            this.setState({ currentViewItems: this.state.currentViewItems.concat(menu) }, function () {
                this.setState({ menuItems: this.state.menuItems.concat(menu) });
            })
        } else {
            console.log("added task");
            let parent = this.state.currentMenu;
            let task = [{ title: titleName, key: id, menu: false, parentID: parent, checked: false }];
            this.setState({ currentViewItems: this.state.currentViewItems.concat(task) }, function () {
                this.setState({ tasks: this.state.tasks.concat(task) });
            });
        }
    };

    back = e => {
        this.setState({
            currentMenu: null,
            currentViewItems: this.state.menuItems
        });
    };

    deleteItem = e => {
        if (this.state.currentMenu === null) {
            var removeIndex = this.state.menuItems.map(function (item) { return item.key; }).indexOf(e);
            this.setState({
                menuItems: this.state.menuItems.splice(removeIndex, 1)
            });
            this.back();
        } else {
            var removeIndex = this.state.tasks.map(function (item) { return item.key; }).indexOf(e);
            this.setState({
                tasks: this.state.tasks.splice(removeIndex, 1),
                currentViewItems: tasks
            });

        }
    };

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
     */
    increment_current() {
        let prev_s = this.state;
        this.setState({
            current_val: prev_s.current_val + 1,
        })
    }

    /*
        task = [{
            title: titleName,
            key: id,
            menu: false,
            parentID: parent,
            checked: false
        }]
     */

    handleCheckTask(taskID) {
        for (let i in this.state.tasks) {
            if (this.state.tasks[i].key === taskID) {
                this.state.tasks[i].checked = !this.state.tasks[i].checked;
                break;
            }
        }
        this.setState({ currentViewItems: this.state.tasks }, function () {
            this.setState({ tasks: this.state.tasks });
        });
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
