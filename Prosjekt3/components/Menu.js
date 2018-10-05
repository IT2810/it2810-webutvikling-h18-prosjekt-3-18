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
        this.updateView = this.updateView.bind(this);
        this.handleCheckTask = this.handleCheckTask.bind(this);
        this.updateProgressBar = this.updateProgressBar.bind(this);

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
                                    complete={item.totalDoneTaskCount}
                                    total={item.totalTaskCount}
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
                        onChangeText={(newMenuName) => this.thing(newMenuName)}
                        value={this.state.newMenuName}
                    />
                    <Button style={styles.button} onPress={this.onAdd} title="Add">Add</Button>
                    {this.state.currentMenu !== null ? <Button style={styles.button} onPress={this.back} title="Back" /> : null}
                </View>
            </View>
        );
    }

    updateProgressBar() {
        let totalTasks = 0;
        let completedTasks = 0;
        let menuItems = this.state.menuItems;
        let taskItems = this.state.tasks;
        for (let i in menuItems) {
            totalTasks = 0;
            completedTasks = 0;
            for (let x in taskItems) {
                if (menuItems[i].key === taskItems[x].parentID) {
                    totalTasks = totalTasks + 1;
                    if (taskItems[x].checked === true) {
                        completedTasks = completedTasks + 1;
                    }
                }
            }
            if (totalTasks !== 0) {
                menuItems[i].totalTaskCount = totalTasks;
                menuItems[i].totalDoneTaskCount = completedTasks;
            } else {
                menuItems[i].totalTaskCount = 1;
                menuItems[i].totalDoneTaskCount = 0;
            }
        }
        this.setState({ menuItems: menuItems });
    }

    updateView() {
        this.updateProgressBar();
        let folderID = this.state.currentMenu;
        if (folderID === null) {
            this.setState({ currentViewItems: this.state.menuItems });
        } else {
            console.debug(this.state.currentViewItems);
            var result = this.state.tasks.filter(obj => {
                return obj.parentID === folderID
            })
            console.log(result);
            this.setState({ currentViewItems: result });

        }
    }

    onAdd = e => {
        let id = this.guid();
        let titleName = this.state.newMenuName;
        if (this.state.currentMenu === null) {
            let menu = [{ title: titleName, key: id, menu: true, totalTaskCount: 1000, totalDoneTaskCount: 1 }];
            this.setState({ menuItems: this.state.menuItems.concat(menu) }, function () {
                this.updateView();
            })
        } else {
            let parent = this.state.currentMenu;
            let task = [{ title: titleName, key: id, menu: false, parentID: parent, checked: false }];
            this.setState({ tasks: this.state.tasks.concat(task) }, function () {
                this.updateView();
            });
        }
    };

    back = e => {
        this.setState({ currentMenu: null }, function () {
            this.updateView();
        });
    };

    deleteItem = e => {
        if (this.state.currentMenu === null) {
            var removeIndex = this.state.menuItems.findIndex(x => x.key == e);
            let menuList = this.state.menuItems;
            menuList.splice(removeIndex, 1);
            this.setState({ menuItems: menuList }, function () {
                this.updateView();
            });
        } else {
            var removeIndex = this.state.tasks.findIndex(x => x.key == e);
            let taskList = this.state.tasks;
            taskList.splice(removeIndex, 1);
            this.setState({ tasks: taskList }, function () {
                this.updateView();
            });
        }
    };

    openMenu = e => {
        this.setState({ currentMenu: e }, function () {
            this.updateView();
        });
    };

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
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
        var checkedIndex = this.state.tasks.findIndex(x => x.key == taskID);
        let taskList = this.state.tasks;
        taskList[checkedIndex].checked = !taskList[checkedIndex].checked;
        this.setState({ tasks: taskList }, function () {
            this.updateView();
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
