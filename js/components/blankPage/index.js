import React, { Component } from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Button, Icon, Left, Right, Body, Thumbnail, List, ListItem } from 'native-base';

import { openDrawer } from '../../actions/drawer';
// import HeaderContent from './../headerContent/';

import styles from './styles';
const profileImg = require('../../../images/profile.png');
import { getItem } from '../helper/common';

const headerLogo = require('../../../images/Header-Logo.png');

class BlankPage extends Component { // eslint-disable-line

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      profile: {}
    }
  }
  componentDidMount() {
    getItem('user')
      .then((user) => {
        console.log(user);
        this.setState({profile: user})
      })
  }

  render() { // eslint-disable-line class-methods-use-this
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent
              style={styles.btnHeader}
              onPress={() => Actions.pop()}
            >
              <Icon name="arrow-back" />
            </Button></Left>
          <Body><Image source={headerLogo} style={styles.imageHeader} /></Body>
          <Right>
            <Button transparent style={styles.btnHeader} onPress={this.props.openDrawer} >
              <Icon name="menu" />
            </Button>
          </Right>
        </Header>
        <Content>
          <Container>
                <Content>
                  <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                    <Thumbnail square size={50} source={profileImg} />
                    <List>
                        <ListItem>
                            <Text style={styles.title}>First name:</Text><Text style={styles.data}>{this.state.profile.firstName}</Text>
                        </ListItem>
                        <ListItem>
                            <Text style={styles.title}>Last name:</Text><Text style={styles.data}>{this.state.profile.lastName}</Text>
                        </ListItem>
                        <ListItem>
                            <Text style={styles.title}>Email:</Text><Text style={styles.data}>{this.state.profile.email}</Text>
                        </ListItem>
                    </List>
                  </View>
                </Content>
            </Container>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}


export default connect(null, bindAction)(BlankPage);
