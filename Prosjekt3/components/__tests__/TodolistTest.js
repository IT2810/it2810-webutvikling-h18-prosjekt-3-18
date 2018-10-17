import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TodoList from '../../components/TodoList';

it('renders correctly', () => {
    const tree = renderer.create(<TodoList>Snapshot test!</TodoList>).toJSON();
    expect(tree).toMatchSnapshot();
});
