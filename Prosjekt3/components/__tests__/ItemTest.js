import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Item from '../../components/Item';

it('renders correctly', () => {
    const tree = renderer.create(<Item>Snapshot test!</Item>).toJSON();
    expect(tree).toMatchSnapshot();
});
