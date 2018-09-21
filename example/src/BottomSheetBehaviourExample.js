/* @flow */

import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Colors, Caption, Searchbar, withTheme, BottomSheetBehaviour, Surface, List, Divider } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';
import CardExample from './CardExample';
import DividerExample from './DividerExample';

type Props = {
  navigation: any,
  theme: Theme,
};

type State = {
  firstQuery: string,
  secondQuery: string,
  thirdQuery: string,
};

const items = ['Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach', 'Orange', 'Passionfruit'];

const BottomContent = props => (
  <View style={{ backgroundColor: props.background }}>
    {items.map(i => <List.Item title={i}/>)}
  </View>
)

class BottomSheetBehaviourExample extends React.Component<Props, State> {
  static title = 'Bottom sheet';

  state = {
    firstQuery: '',
    secondQuery: '',
    thirdQuery: '',
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <BottomSheetBehaviour
          initialPoint={1}
          snapPoints = {[0, 300, 500]}
          renderHeader={this._renderHeader}
        >
          <BottomContent background={background}/>
        </BottomSheetBehaviour>
        <Surface style={{ backgroundColor: 'red' }}>
          <List.Section title="Single line">
            <List.Item
              left={props => <List.Icon {...props} icon="event" />}
              title="List item 1"
            />
            <List.Item
              left={props => <List.Icon {...props} icon="redeem" />}
              title="List item 2"
            />
          </List.Section>
          <Divider />
          <List.Section title="Two line">
            <List.Item
              left={() => (
                <Image
                  source={require('../assets/email-icon.png')}
                  style={styles.image}
                />
              )}
              title="List item 1"
              description="Describes item 1"
            />
            <List.Item
              left={() => (
                <Image
                  source={require('../assets/email-icon.png')}
                  style={styles.image}
                />
              )}
              right={props => <List.Icon {...props} icon="info" />}
              title="List item 2"
              description="Describes item 2"
            />
          </List.Section>
          <Divider />
          <List.Section title="Three line">
            <List.Item
              left={() => (
                <Image
                  source={require('../assets/email-icon.png')}
                  style={styles.image}
                />
              )}
              title="List item 1"
              description="Describes item 1. Example of a very very long description."
            />
            <List.Item
              left={() => (
                <Image
                  source={require('../assets/email-icon.png')}
                  style={styles.image}
                />
              )}
              right={props => <List.Icon {...props} icon="star-border" />}
              title="List item 2"
              description="Describes item 2. Example of a very very long description."
            />
          </List.Section>
        </Surface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    margin: 4,
  },
});

export default withTheme(BottomSheetBehaviourExample);
