import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Container, Content, Text, Icon, List, Left, Right, Body, ListItem, Thumbnail } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { deleteItem } from '../helper/common';

import { closeDrawer, selectTab } from '../../actions/drawer';

import styles from './style';
import { logout } from '../../actions/userActionCreator';

const profileImg = require('../../../images/profile.png');
const locationImg = require('../../../images/nearby.png');


class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnail: locationImg,
      name: 'Scan nearby device',
      content: 'Who is near you',
      link: 'nearbyFriends',
    }
    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser() {
    this.props.logout();
    deleteItem('user');
    Actions.login({
      type: ActionConst.RESET
    });
  }

  routeCall(data) {
    if (data === 'profile') {
      Actions.profile();
      this.props.closeDrawer();
    } else {
      Actions.nearbyFriends();
      this.props.closeDrawer();
    }
  }

  render() {
    return (
      <Container>
        <Content style={styles.drawerContent}>
          <List>
              <ListItem
                button
                thumbnail
                onPress={() => { Actions.blankPage(); this.props.closeDrawer(); }}
                style={styles.links}
              >
                <Left>

                  <Thumbnail square size={50} source={this.props.user && this.props.user.image ? this.props.user.image: profileImg} />
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{this.props.user && this.props.user.firstName ?this.props.user.firstName: '' }</Text>
                  <Text style={styles.viewProfileLink}>{'Profile'}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>
          <List>
              <ListItem
                button
                thumbnail
                onPress={() =>{ this.props.selectTab('friends'); this.props.closeDrawer()}}
                style={styles.links}
              >
                <Left style={{width:50}}>
                  <FontIcon name='user-circle' size={50} color='#fff'/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{'Profile Manager'}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>
          <List>
              <ListItem
                button
                thumbnail
                onPress={() =>{ this.props.selectTab('friends'); this.props.closeDrawer()}}
                style={styles.links}
              >
                <Left style={{width:50}}>
                  <FontIcon name='bullseye' size={50} color='#fff'/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{'Receive'}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>
          <List>
              <ListItem
                button
                thumbnail
                onPress={() =>{ this.props.selectTab('nearbyFriends'); this.props.closeDrawer()}}
                style={styles.links}
              >
                <Left style={{width:50}}>
                  <FontIcon name='share-alt' size={50} color='#fff'/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{'Share'}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>
          <List>
              <ListItem
                button
                thumbnail
                onPress={() =>{ this.props.selectTab('homeContent'); this.props.closeDrawer()}}
                style={styles.links}
              >
                <Left style={{width:50}}>
                  <FontIcon name='address-book-o' size={50} color='#fff'/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{'Contacts'}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>
          {/*<List>
              <ListItem
                button
                thumbnail
                onPress={() => this.routeCall(this.state.link)}
                style={styles.links}
              >
                <Left>
                  <Thumbnail square size={50} source={this.state.thumbnail} />
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{this.state.name}</Text>
                  <Text style={styles.viewProfileLink}>{this.state.content}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>*/}
          <List>
              <ListItem
                button
                thumbnail
                onPress={() => {Actions.home();  this.props.closeDrawer();}}
                style={styles.links}
              >
                <Left style={{width:50}}>
                  <FontIcon name='home' size={50} color='#fff'/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text style={styles.profileName}>{'Home'}</Text>
                </Body>
                <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
                  <Icon name="arrow-forward" style={styles.arrowForward} />
                </Right>
              </ListItem>
          </List>
          <List >
          <ListItem
            button
            thumbnail
            onPress={() => { this.logoutUser(); this.props.closeDrawer(); }}
            style={styles.links}
          >
            <Left style={{width:50}}>
              <FontIcon name='sign-out' size={50} color='#fff'/>
            </Left>
            <Body style={{ borderBottomWidth: 0 }}>
              <Text style={styles.profileName}>{'Logout'}</Text>
            </Body>
            <Right style={{ borderBottomWidth: 0, paddingLeft: 5 }}>
              {/*<Icon name="arrow-forward" style={styles.arrowForward} />*/}
            </Right>
          </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    logout: bindActionCreators(logout, dispatch),
    selectTab: bindActionCreators(selectTab, dispatch),
  };
}

const mapStateToProps = state => ({
  user: state.user.user
});

export default connect(mapStateToProps, bindAction)(SideBar);
