import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TextInput, TouchableOpacity, Button } from 'react-native';
import store from 'react-native-simple-store';
import { MaterialIcons } from '@expo/vector-icons';
import Prompt from 'react-native-prompt-crossplatform';
import { BackHandler } from 'react-native';

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
        this.handleBackPress = this.handleBackPress.bind(this)
        this.handleCheckTask = this.handleCheckTask.bind(this);
        this.openPrompt = this.openPrompt.bind(this);
        this.getMenuName = this.getMenuName.bind(this);

        /*
         * currentMenu: Current menu displayed, null if in main menu.
         * newMenuName: Text from textInput.
         * menuItems: Menus that can be added with add button if in main menu. Saved to local storage
         * tasks: Task objects. Belongs to a parent (menuItem). Saved to local storage.
         * visiblePrompt: Used when adding an item. Pop-ups the prompt to add.
         */
        this.state = {
            currentMenu: null,
            newMenuName: '',
            menuItems: [],
            tasks: [],
            visiblePrompt: false
        }
    }

    componentDidMount() {
        store.get(STORE_MENUITEMS)
            .then((resp) => {
                resp !== null ?
                    this.setState(() => {
                        const menuItemsCopy = resp;
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
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    render() {
        return (
            <View style={styles.container}>
                <Header menu={this.state.currentMenu}
                    title={this.getMenuName()}
                    back={this.back}
                    styleHeader={styles.header}
                />
                {/*
                Handles the showing of a Flatlist of Todos and shows the text Empty... when no Todos are found/ everything has been deleted
                 */}
                {this.state.menuItems.length >= 1 ?
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
                                    />
                                }
                            </Item>
                        }
                    /> : <Text> Empty...</Text>}
                <View style={{ flex: 0.3 }}>
                    <View>
                        {/*
                        This promptBox is shown when the + sign is pressed and you are ready to add an item into the Tasks or Todolist
                        Supports Android BackButton. The promptBox handles the onAdd function when adding
                        */}
                        <Prompt
                            title="Add Item"
                            inputPlaceholder="Item..."
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
                                if (this.state.newMenuName !== '') {
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
                </View>
                {/*
                Shows the breakline and the StepCounter Depending on if you are at the mainscreen or not, when
                within Todos it will not show.
                */}
                {this.state.currentMenu === null ?
                    <View style={styles.breakline} /> : null}
                <View style={styles.subComponents}>
                    {this.state.currentMenu === null ?
                        <View style={styles.container}>
                            <StepCounterComponent limit={10000} />
                        </View> : null}
                </View>
            </View>
        );
    }

    /*
    Iterares over and updates the individual progressbars on the TodDos, eflects how many task have been done within the To-Do
     */
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

    /*
    Handles the Androids BackButton presses so that it can be use for Navigation witnin the Todos and a safety feature to
    ask if the user wants to exit the app
     */
    handleBackPress() {
        if (this.state.currentMenu !== null) {
            this.setState({
                currentMenu: null
            });
        }
        else {
            Alert.alert('Exit app?',
                'Are you sure you want to exit?',
                [
                    { text: 'Yes', onPress: () => BackHandler.exitApp() },
                    {
                        text: 'No', onPress: () => {
                        }
                    },
                ],
            );
        }
        return true
    }
    /*
    The method of updating the render so that the relevant information is showed, if in the mainscreen or within a specific To-do
     */
    updateView() {
        let state = this.state;
        return (state.currentMenu === null) ? state.menuItems
            : state.tasks.filter(obj => { return obj.parentID === state.currentMenu });
    }
/*
The function used to add elements and store them in the asyncStorage, depending on where it is called it
will at either a To-Do from the main menu or a new task when within a To-Do.
 */
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

    /*
    Called when trying to add, will open the promtBox
     */
    openPrompt = () => {
        this.setState({
            newMenuName: '',
            visiblePrompt: true
        });
    };

    /*
    Returns the user back to mainscreen
     */
    back = e => {
        this.setState({ currentMenu: null });
    };

    /*
    Deletes the selected To-do or Task
     */
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

    /*
    Function that handles the assignment of unique ids to todos, tasks and Items
     */
    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /*
    Keeps track of checked tasks in case of need to delete
     */
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
    Handles the extraction of menuName
     */
    getMenuName() {
        let id = this.state.currentMenu;
        if (id === null) {
            return 'Main Menu';
        }
        let menu = this.state.menuItems;
        let index = menu.findIndex(x => x.key === id);
        return menu[index].title;
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 22,
        flex: 1,
        height: '50%'
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
        left: 0,
        top: 0,
        height: 50,
        backgroundColor: '#EEEEEE',
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },

    subComponents: {
        flex: 0.3
    },
    input: {
        height: 40,
        borderTopWidth: 2,
        marginTop: 20
    },
    breakline: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        maxWidth: 200,
        marginLeft: '25%',
        marginRight: '25%'
    }

});

export default Menu;