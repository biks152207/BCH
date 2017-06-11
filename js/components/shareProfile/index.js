import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Left, Right, Body, Button, Icon, Title, List, ListItem, Spinner , Thumbnail, Toast} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { openDrawer, selectTab, closeDrawer } from '../../actions/drawer';
import { HTTP, getItem, setItem } from '../helper/common';
import BluetoothSerial from 'react-native-bluetooth-serial';
import styles from './styles';


class ShareProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: []
    }
    this.editContact = this.editContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }

  editContact(contact) {
    setItem('profile', contact);
    this.props.selectTab('editFromShare');
  }

  deleteContact() {

  }

  componentWillMount() {
    getItem('selectedProfiles')
      .then((profiles) => {
        this.setState({profiles})
      });
    // BluetoothSerial.on('bluetoothEnabled', () => Toast.show({
    //   supportedOrientations: ['potrait','landscape'],
    //   text: 'Bluetooth is enabled',
    //   position: 'bottom',
    //   buttonText: 'Okay'
    // }));
    // BluetoothSerial.on('bluetoothDisabled', () => Toast.show({
    //   supportedOrientations: ['potrait','landscape'],
    //   text: 'Bluetooth is disabled',
    //   position: 'bottom',
    //   buttonText: 'Okay'
    // }))
  }
  render() {
    const profiles = this.state.profiles.map((profile, key) =>{
      return (
        <List  key={key} >
        <ListItem>
              <TouchableOpacity>
                  <Thumbnail source={require('../../../images/profile.png')} />
                </TouchableOpacity>
            <Body>
                <View style={{flex:1, flexDirection: 'row'}}>
                  <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.name}>{profile.company}</Text>
                    <Text note>{profile.title}</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                      <Button  transparent  onPress={() => this.editContact(profile)}><Text>Edit</Text></Button>
                      <Button full light style={{marginTop: 4}}  onPress={() => this.deleteContact(profile)}><Icon name='trash' /></Button>

                  </View>
                </View>
            </Body>
            {/*<Right>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Button light style={{height: 36}} onPress={() => this.editContact(profile)}><Text>Edit</Text></Button>
                    <Button light style={{height: 36, marginLeft: 10}} onPress={() => this.viewContact(profile)}><Icon name='eye' /></Button>
                    <Button light style={{height: 36, marginLeft: 10}} onPress={() => this.deleteContact(profile)}><Icon name='trash' /></Button>
                </View>
            </Right>*/}
        </ListItem>
        </List>
      )
    })
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => {Actions.friends(); this.props.closeDrawer()}}>
              <Icon style={styles.backBtn} name="arrow-back" /><Text style={{color: 'white'}}>Back</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1.5 }}>
            <Title style={styles.header}>Share Profile</Title>
          </Body>
          <Right>
            <Button transparent >
              <Text style={{color: 'white'}}>Share</Text>
            </Button>
          </Right>
        </Header>
        <View style={{marginTop : 30}}>
          {profiles}
        </View>
      </Container>
    )
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    selectTab: bindActionCreators(selectTab, dispatch)
  };
}

export default connect(null, bindAction)(ShareProfile);
