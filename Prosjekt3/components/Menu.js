import React, { Component } from 'react';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Button } from 'react-native';
import Store from 'react-native-store';
import { MaterialIcons } from '@expo/vector-icons';
import Prompt from 'react-native-prompt-crossplatform';

import Item from './Item'
import Task from "./Task";

import Header from './Header';
import TodoList from "./TodoList";
import { StepCounterComponent } from "./StepCounterComponent";


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
        this.guid = this.guid.bind(this);

        // manipulating menuItems and tasks.
        this.onAdd = this.onAdd.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.updateView = this.updateView.bind(this);
        this.updateProgressBar = this.updateProgressBar.bind(this);

        this.handleCheckTask = this.handleCheckTask.bind(this);
        this.openPrompt = this.openPrompt.bind(this);

        // debugging
        this.resetStorage = this.resetStorage.bind(this);
        this.getStorage = this.getStorage.bind(this);

        /*
         * currentMenu: Current menu displayed, null if in main menu.
         * newMenuName: Text from textInput.
         * menuItems: Menus that can be added with add button if in main menu. Saved to local storage
         * tasks: Task objects. Belongs to a parent (menuItem). Saved to local storage.
         */
        this.state = {
            currentMenu: null,
            newMenuName: '',
            menuItems: [],
            tasks: [],
            currentViewItems: [],
            dailyGoal: 10000,
            visiblePrompt: false
        }
    }

    componentDidMount() {
        // this.resetStorage(); // Used when the app crashes because of the local storage
        store.get(STORE_MENUITEMS)
            .then((resp) => {
                resp !== null ?
                    this.setState(() => {
                        const menuItemsCopy = resp;
                        // for (let i in resp) {
                        //     menuItemsCopy.push(resp[i]);
                        // }

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
                        const tasksCopy = resp;
                        // for (let i in resp) {
                        //     tasksCopy.push(resp[i]);
                        // }
                        return {
                            tasks: tasksCopy
                        }
                    })
                    : null;
            })
            .then(() => {
                this.updateProgressBar()
            })
            .catch(error => {
            console.error(error.message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={this.state.currentMenu} style={styles.header} />
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
                <View style={{ flex: 0.3 }}>
                    <View>
                        <Prompt
                            title="Add something :)"
                            inputPlaceholder="Add text here"
                            submitButtonText="Add"
                            primaryColor='#0b0c0c'
                            cancelButtonText="Cancel"
                            isVisible={this.state.visiblePrompt}
                            onChangeText={(newMenuName) => {
                                this.setState({ newMenuName: newMenuName });
                            }}
                            onBackButtonPress={() => {
                                this.setState({
                                    newMenuName: '',
                                    visiblePrompt: false,
                                });
                            }}
                            onCancel={() => {
                                this.setState({
                                    newMenuName: '',
                                    visiblePrompt: false,
                                });
                            }}
                            onSubmit={() => {
                                if(this.state.newMenuName!==''){
                                    this.onAdd();
                                    this.setState({
                                        visiblePrompt: false,
                                    });
                                }

                            }}
                        />
                    </View>
                    <TouchableOpacity title="Add" onPress={this.openPrompt}>
                        <View style={styles.button}>
                            <MaterialIcons name="add-circle-outline" size={40} color="black" />
                        </View>
                    </TouchableOpacity>
                    {this.state.currentMenu !== null ? <TouchableOpacity title="Back" onPress={this.back} underlayColor="white">
                        <View style={styles.button}>
                            <MaterialIcons name="arrow-back" size={40} color="black" />
                        </View>
                    </TouchableOpacity> : null}
                </View>
                <View style={{ flex: 0.3 }}>
                    {this.state.currentMenu === null ?
                        <View style={styles.container}>
                            <StepCounterComponent limit={this.state.dailyGoal} />
                        </View> : null}
                    <Text>Dev Tools</Text>
                    <Button style={styles.button} onPress={this.resetStorage} title="Clear storage [DEBUG]">Clear Storage</Button>
                    <Button style={styles.button} onPress={this.getStorage} title="Get storage [DEBUG]">Get storage</Button>
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


    updateView() {
        let state = this.state;
        return (state.currentMenu === null) ? state.menuItems
            : state.tasks.filter(obj => { return obj.parentID === state.currentMenu});
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
    openPrompt = () => {
        this.setState({
            newMenuName: '',
            visiblePrompt: true
        });
    }
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
                store.save(STORE_MENUITEMS, menuList);

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
                store.delete(STORE_TASKS);
                store.save(STORE_TASKS, taskList);

                // updating state
                return {
                    tasks: taskList
                }
            });
        }
    };

    openMenu = e => {
        this.setState({ currentMenu: e })
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
        store.delete(STORE_TASKS);
        store.save(STORE_TASKS, taskList);

        this.setState({ tasks: taskList });
        this.updateProgressBar();
    }

    /*
     * Debugger tools
     */

    /**
     * Clears the local storage.
     */
    resetStorage() {
        store.delete(STORE_MENUITEMS);
        store.delete(STORE_TASKS);
        this.setState({
            menuItems: [],
            tasks: []
        });
        console.log("Cleared storage.")
    }

    /**
     * Prints out elements from storage.
     */
    getStorage() {
        store.get(STORE_MENUITEMS)
            .then(resp => {
                console.debug(":::::::::::===================:::::::::::\n" ,
                    "(1) Printing menuItems", resp, "\n--::::--::::--::::--::::");
            });

        store.get(STORE_TASKS)
            .then(resp => {
                console.debug("(2) Printing tasks", resp)
            });
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 22,
        flex: 1,
        backgroundColor: '#FFF999'
        // flex: 0.4,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        borderRadius: 100,
        alignSelf: 'center',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    list: {
        height: 100,
        flex: 5,
    },
    header: {
    }
});

export default Menu;