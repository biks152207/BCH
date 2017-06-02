
import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
// import { Actions } from 'react-native-router-flux';
import { Container, Content, List, ListItem, Spinner, Thumbnail, Left, Right, Body, Icon, Button } from 'native-base';
import { HTTP, getItem } from '../helper/common';
import { openDrawer } from '../../actions/drawer';

import styles from './styles';


class HomeContent extends Component {  // eslint-disable-line

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      userid: null,
      profileId: 0,
      tguid: null,
      contactsInfo: [],
      loading: true,
      message: null,
      showAddForm: false
    };

    this.callContactsApi = this.callContactsApi.bind(this);
    this.deleteContacts = this.deleteContacts.bind(this);
    this.viewContact = this.viewContact.bind(this);
  }

  viewContact(data) {
    Alert.alert(
      'User details',
      `NickName: ${data.nickName}\nNotes: ${data.notes}\n`
    )
  }

  deleteContacts(contacts) {
    const { contactProfileId, userProfileId, userId } = contacts;
    const api = `api/contacts?action=3&userId=${contacts.userId}&tguid=${this.state.tguid}`;
    const payload = {
      contactProfileId,
      userProfileId,
      userId
    }
    HTTP(api,'POST', payload)
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData, 'responseData');
      })
  }

  componentDidMount() {
    getItem('user')
      .then((user) => {
        this.setState({
          tguid: user.tguid,
          userid: user.userId,
        });
        this.callContactsApi();
      })
  }

  async callContactsApi() {
    const { userid, profileId, tguid } = this.state;
    const uri = `api/contacts?userid=${userid}&profileId=${profileId}&tguid=${tguid}`;
    const response = await HTTP(uri, 'GET');
    const actualResponse = await response.json();
    if (actualResponse && actualResponse.length > 0) {
      this.setState({ loading: false, contactsInfo: actualResponse });
    } else {
      this.setState({ loading: false, message: 'No contacts found' });
    }
  }

  render() {
    const contacts = this.state.contactsInfo.map((contact, key) =>{
      return (
        <ListItem avatar key={key}>
            <Left>
                {/*<Thumbnail source={require('../../../images/cam.png')} />*/}
                <Icon name='person' style={{fontSize: 40, width: 30}} />
            </Left>
            <Body>
                <Text style={styles.name}>{contact.nickName}</Text>
                <Text note>{contact.notes}</Text>
            </Body>
            <Right>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Button light style={{height: 36}} onPress={() => this.viewContact(contact)}><Icon name='eye' /></Button>
                    <Button light style={{height: 36, marginLeft: 10}} onPress={() => this.deleteContacts(contact)}><Icon name='trash' /></Button>
                </View>
            </Right>
        </ListItem>
      )
    });
    return (
      <Container>
        { this.state.loading ?
          <Spinner color="#3B5998" /> :
          <Content style={styles.content}>
            {/*<View style={{flex:1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 4}}>
              <Button info onPress={() => this.setState({showAddForm: true})}><Icon name="add"></Icon></Button>
            </View>*/}
            <View style={styles.requestContainer}>
              <Text style={styles.whiteRequest}>Your Contacts</Text>
            </View>
            {!this.state.showAddForm ?
              <View style={styles.requestContainer}>
              { this.state.message === null ?
                <List>
                {contacts}
                </List> :
                <Text style={styles.name}>{this.state.message}</Text>
              }
              </View>:
              <View><Text>Form</Text></View>
            }
          </Content>
        }
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

function mapStateToProps(state) {
  return {
    user:  state.user
  };
}

export default connect(mapStateToProps, bindAction)(HomeContent);
