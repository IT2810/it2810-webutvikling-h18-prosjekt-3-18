import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Menu from '../../components/menu';

it('renders correctly', () => {
    const tree = renderer.create(<Menu>Snapshot test!</Menu>).toJSON();
    expect(tree).toMatchSnapshot();
});
