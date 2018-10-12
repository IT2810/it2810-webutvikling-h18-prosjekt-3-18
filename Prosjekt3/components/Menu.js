import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Button, TextInput } from 'react-native';

import Item from './Item'
import Task from "./Task";

import Header from './Header';
import TodoList from "./TodoList";
import {StepCounterComponent} from "./StepCounterComponent";


const STORE_TASKS = 'tasks';
const STORE_MENUITEMS = 'menuItems';

/**
 * Library used for AsyncStorage:
 * https://github.com/jasonmerino/react-native-simple-store
 */
import store from 'react-native-simple-store';

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
         * currentMenu: Current menu displayed, null if in main menu.
         * newMenuName: Text from textInput.
         * menuItems: Menus that can be added with add button if in main menu. Saved to local storage
         * tasks: Task objects. Belongs to a parent (menuItem). Saved to local storage.
         */
        this.state = {
            currentMenu: null,
            newMenuName: 'Homework',
            menuItems: [],
            tasks: []
        };
    }

    componentDidMount() {
        store.get(STORE_MENUITEMS)
            .then((resp) => {
                resp !== null ?
                    this.setState(() => {
                        const menuItemsCopy = [];
                        for (let i = 0; i < resp.keys().length; i++) {
                                menuItemsCopy.push(resp[i]);
                        }
                        return {
                            menuItems: menuItemsCopy
                        };
                    })
                    : null;
            }).catch(error => {
            console.error(error.message);
        });

        store.get(STORE_TASKS)
            .then((resp) => {
                resp !== null ?
                    this.setState(() => {
                        const tasksCopy = [];
                        for (let i = 0; i < resp.keys().length; i++) {
                            tasksCopy.push(resp[i]);
                        }
                        return {
                            tasks: tasksCopy
                        }
                    })
                    : null;
            }).catch(error => {
            console.error(error.message);
        });
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
                        onChangeText={(newMenuName) => this.setState({ newMenuName: newMenuName })}
                        value={this.state.newMenuName}
                    />
                    <Button style={styles.button} onPress={this.onAdd} title="Add">Add</Button>
                    {this.state.currentMenu !== null ? <Button style={styles.button} onPress={this.back} title="Back" /> : null}
                    <Button style={styles.button} onPress={this.resetStorage} title="Clear storage [DEBUG]">Clear Storage</Button>
                </View>
                    {/*<View style={styles.container}>
                        <StepCounterComponent limit={10000} />
                    </View>*/}
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

    updateView() {
        return (this.state.currentMenu === null) ? this.state.menuItems
            : this.state.tasks.filter(obj => { return obj.parentID === this.state.currentMenu});
    }

    onAdd = e => {
        let id = this.guid();
        let titleName = this.state.newMenuName;
        if (this.state.currentMenu === null) {
            let menu = { title: titleName, key: id, menu: true, totalTaskCount: 1000, totalDoneTaskCount: 1 };
            this.setState(() => {
                const menuItemsCopy = this.state.menuItems;
                menuItemsCopy.push(menu);
                return {
                    menuItems: menuItemsCopy
                }
            });
            // add to local storage
            store.push(STORE_MENUITEMS, menu)
                .then(console.log(menu, "pushed to local storage."));

        } else {
            let parent = this.state.currentMenu;
            let task = { title: titleName, key: id, menu: false, parentID: parent, checked: false };
            this.setState(() => {
                const tasksCopy = this.state.tasks;
                tasksCopy.push(task);
                return {
                    tasks: tasksCopy
                }
            });

            // add to local storage
            store.push(STORE_TASKS, task)
                .then(console.log(task, "pushed to local storage"));
        }
    };

    back = e => {
        this.setState({ currentMenu: null });
    };

    deleteItem = e => {
        let removeIndex;
        if (this.state.currentMenu === null) {
            let menuList = this.state.menuItems;
            removeIndex = menuList.findIndex(x => x.key === e);
            menuList.splice(removeIndex, 1);
            this.setState(() => {
                // removing from local storage
                store.delete(STORE_MENUITEMS);
                store.update(STORE_MENUITEMS, menuList);

                // updating state
                return {
                    menuItems: menuList
                }
            });
        } else {
            let taskList = this.state.tasks;
            removeIndex = taskList.findIndex(x => x.key === e);
            taskList.splice(removeIndex, 1);
            this.setState(() => {
                // removing from local storage
                store.delete(STORE_TASKS)
                    .then()
                    .update(STORE_TASKS, taskList);

                // updating state
                return {
                    tasks: taskList
                }
            });
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
        let taskList = this.state.tasks;
        let checkedIndex = taskList.findIndex(x => x.key === taskID);
        taskList[checkedIndex].checked = !taskList[checkedIndex].checked;
        this.setState({ tasks: taskList });
        this.updateProgressBar();
    }

    resetStorage() {
        store.delete(STORE_MENUITEMS);
        store.delete(STORE_TASKS);
        this.setState({
            menuItems: [],
            tasks: []
        })
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 22,
        flex: 1,
        // flex: 0.4,
        // justifyContent: 'center',
        // alignItems: 'center',
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