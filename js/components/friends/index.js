import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Left, Right, Body, Button, Icon, Title, List, ListItem, Spinner } from 'native-base';
import { openDrawer, selectTab } from '../../actions/drawer';
import { HTTP, getItem, setItem } from '../helper/common';
import styles from './styles';


class Friends extends Component {  // eslint-disable-line
  static propTypes = {
    tabState: React.PropTypes.string,
    selectTab: React.PropTypes.func,
    openDrawer: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      userid: null,
      profileId: 0,
      tguid: null,
      loading: true,
      message: null,
      profilesInfo: [],
      tab: 'friends',
    };

    this.callProfileApi = this.callProfileApi.bind(this);
    this.viewContact = this.viewContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.editContact = this.editContact.bind(this);
  }

  editContact(contact) {
    setItem('profile', contact);
    this.props.selectTab('editProfile');
  }

  viewContact(data) {
    Alert.alert(
      'User details',
      `Company Name: ${data.company}\n
      Title: ${data.title}\n
      Profile Name: ${data.profileName}\n
      First Name: ${data.firstName}\n
      Last Name: ${data.lastName}\n
      Phone Office 1: ${data.phoneOffice01}\n
      Phone Office 2: ${data.phoneOffice02}\n
      Phone/Mobile (work): ${data.phoneMobileWork}\n
      Phone/Mobile (personal): ${data.phoneMobilePersonal}\n
      Work Email: ${data.emailWork}\n
      Personal Email: ${data.emailPersonal}\n
      `
    )
  }

  deleteContact() {

  }

  componentDidMount() {
    getItem('user')
      .then((user) => {
        this.setState({
          tguid: user.tguid,
          userid: user.userId,
        });
        this.callProfileApi();
      })
  }

  callProfileApi() {
    const { userid, profileId, tguid } = this.state;
    const uri = `api/profiles?userid=${userid}&profileId=${0}&tguid=${tguid}`;
    console.log('uri', uri);
    HTTP(uri, 'GET')
    .then(response => response.json())
    .then((responseData) => {
      if (responseData && responseData.length > 0) {
        this.setState({ loading: false, profilesInfo: responseData });
      }
      else {
        this.setState({ loading: false, message: 'No profile found' });
      }
    })
    .catch((error) => {
      this.setState({ loading: false, message: 'No profile found' });
    });
  }

  render() {
    const profiles = this.state.profilesInfo.map((profile, key) =>{
      return (<ListItem avatar key={key}>
            <Left>
                {/*<Thumbnail source={require('../../../images/cam.png')} />*/}
                <Icon name='man' style={{fontSize: 40, width: 30}} />
            </Left>
            <Body>
                <Text style={styles.name}>{profile.company}</Text>
                <Text note>{profile.title}</Text>
            </Body>
            <Right>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <Button light style={{height: 36}} onPress={() => this.editContact(profile)}><Text>Edit</Text></Button>
                    <Button light style={{height: 36, marginLeft: 10}} onPress={() => this.viewContact(profile)}><Icon name='eye' /></Button>
                    <Button light style={{height: 36, marginLeft: 10}} onPress={() => this.deleteContact(profile)}><Icon name='trash' /></Button>
                </View>
            </Right>
        </ListItem>
      )
    }
    );
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.selectTab('homeContent')}>
              <Icon style={styles.backBtn} name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 1.5 }}>
            <Title style={styles.header}>Profiles</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.selectTab('addProfile')}>
              <Icon style={styles.addBtn} name="add" />
            </Button>
          </Right>
        </Header>

        { this.state.loading ?
          <Spinner color="#3B5998" /> :
          <Content style={styles.content}>
            <View style={styles.requestContainer}>
              <Text style={styles.whiteRequest}>Profiles</Text>
            </View>
            <View style={styles.requestContainer}>
              { this.state.message === null ?
                <List>
                  {profiles}
                </List> :
                <Text style={styles.name}>{this.state.message}</Text>
              }
            </View>
          </Content>
        }
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    selectTab: newTab => dispatch(selectTab(newTab)),
  };
}

function mapStateToProps(state) {
  return {
    user:  state.user
  };
}


export default connect(mapStateToProps, bindAction)(Friends);
