import React, {Component} from 'react';
import {View} from 'react-native';
import CheckBox from 'react-native-checkbox';


class ItemTodo extends Component {
    constructor() {
        super();

        this._handle_check_status = this._handle_check_status.bind(this);
    }
    /*
        Todo:
        - need a checkbox
        - need an id (ex. 0, 1, 2, 3, 4...)
        - save information for states over.
        - special functions for TodoItems
     */
    render() {
        return (
            <View>
                <CheckBox
                    label={this.props.label}
                    onChange={this._handle_check_status}
                />
            </View>
        )
    }

    _handle_check_status() {
        console.log("Hello")
    }
}

export default ItemTodo;