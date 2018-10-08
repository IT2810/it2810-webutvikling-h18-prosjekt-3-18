import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Store from 'react-native-store';

import Item from './Item'
import Task from "./Task";

import Header from './Header';
import TodoList from "./TodoList";


/**
 * Library used:
 * https://github.com/thewei/react-native-store
 */

const TODO_DB = {
    'tasks': Store.model('tasks'),
    'menuItems': Store.model('menuItems')
};


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
        this.resetStorage = this.resetStorage.bind(this);

        /**
         * currentMenu: current menu displayed, null if in main menu.
         * newMenuName: Text from textInput.
         * menuItems: menus that can be added with add button if in main menu.
         * tasks: task objects. Belongs to a parent (menuItem).
         * currentViewItems: The current items displayed on the screen. Updates often.
         */
        this.state = {
            currentMenu: null,
            newMenuName: 'Homework',
            menuItems: [],
            tasks: [],
            currentViewItems: []
        }
    }

    componentDidMount() {
        // finding tasks
        TODO_DB.tasks.find()
            .then(resp => {
                console.log(resp);
                if (resp !== null) {
                    this.setState({
                        tasks: resp
                    })
                }
            }
        );

        // finding menu items
        TODO_DB.menuItems.find()
            .then(resp => {
                if (resp !== null) {
                    this.setState({
                        menuItems: resp,
                    })
                }
            }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={this.state.currentMenu} />
                <FlatList
                    extraData={this.state}
                    style={styles.list}
                    data={this.updateView()}
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
                    <Button style={styles.button} onPress={this.resetStorage} title="Reset DB">Reset DB</Button>
                </View>
            </View>
        );
    }

    updateProgressBar() {
        let totalTasks;
        let completedTasks;
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

        // this.updateProgressBar(); // fixme do not use updateProgressbar in updateview. Find solution
    updateView() {
        return (this.state.currentMenu === null) ? this.state.menuItems
            : this.state.tasks.filter(obj => { return obj.parentID === this.state.currentMenu});
    }
    onAdd = e => {
        let id = this.guid();
        let titleName = this.state.newMenuName;
        if (this.state.currentMenu === null) {
            let menu = [{ title: titleName, key: id, menu: true, totalTaskCount: 1000, totalDoneTaskCount: 1 }];

            this.setState(() => {
                const menuItemsCopy = this.state.menuItems;
                const currentViewItemsCopy = this.state.currentViewItems;
                return {
                    menuItems: menuItemsCopy.concat(menu),
                    currentViewItems: currentViewItemsCopy.concat(menu)
                }
            });

            // add to local storage
            TODO_DB.menuItems.add(menu);

        } else {
            let parent = this.state.currentMenu;
            let task = [{ title: titleName, key: id, menu: false, parentID: parent, checked: false }];
            this.setState({ tasks: this.state.tasks.concat(task)});

            // add to local storage
            TODO_DB.tasks.add(task);
        }
    };

    back = e => {
        this.setState({ currentMenu: null });
    };

    deleteItem = e => {
        let removeIndex;
        if (this.state.currentMenu === null) {
            removeIndex = this.state.menuItems.findIndex(x => x.key === e);
            let menuList = this.state.menuItems;
            let removedMenu = menuList.splice(removeIndex, 1);

            this.setState({ menuItems: menuList });

            // removing from local storage
            TODO_DB.menuItems.remove({
                where: {
                    key: removedMenu.key
                }
            }).then(resp => {
                console.log(resp, "removed menu");
            })

        } else {
            removeIndex = this.state.tasks.findIndex(x => x.key === e);
            let taskList = this.state.tasks;
            let removedTask = taskList.splice(removeIndex, 1);
            this.setState({ tasks: taskList });

            TODO_DB.tasks.remove({
                where: {
                    key: removedTask.key
                }
            }).then(resp => {
                console.log(resp, "removed task")
            })
        }
    };

    openMenu = e => {
        this.setState({ currentMenu: e });
    };

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


    handleCheckTask(taskID) {
        var checkedIndex = this.state.tasks.findIndex(x => x.key === taskID);
        let taskList = this.state.tasks;
        taskList[checkedIndex].checked = !taskList[checkedIndex].checked;
        this.setState({ tasks: taskList });
    }

    resetStorage() {
        TODO_DB.tasks.remove(resp => {
                console.log("destroyed", resp);
        });

        TODO_DB.menuItems.remove(resp => {
            console.log("destroyed menuItems", resp);
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
