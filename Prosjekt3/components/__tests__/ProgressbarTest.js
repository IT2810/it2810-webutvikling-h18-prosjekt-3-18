import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import ProgressBar from '../../components/ProgressBar';

it('renders correctly', () => {
    const tree = renderer.create(<ProgressBar>Snapshot test!</ProgressBar>).toJSON();
    expect(tree).toMatchSnapshot();
});
