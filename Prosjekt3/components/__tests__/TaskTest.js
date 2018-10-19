import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Task from '../../components/Task';

it('renders correctly', () => {
    const tree = renderer.create(<Task>Snapshot test!</Task>).toJSON();
    expect(tree).toMatchSnapshot();
});
