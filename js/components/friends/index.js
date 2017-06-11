import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Left, Right, Body, Button, Icon, Title, List, ListItem, Spinner , Thumbnail} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome';
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
      selected: []
    };

    this.callProfileApi = this.callProfileApi.bind(this);
    this.viewContact = this.viewContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.editContact = this.editContact.bind(this);
    this.selectProfile = this.selectProfile.bind(this);
    this.goToShareProfile = this.goToShareProfile.bind(this);
  }

  goToShareProfile() {
      if (this.state.selected.length === 0) {
        alert(`You haven't selected profile to share`);
      } else {
        const selectedProfiles = this.state.profilesInfo.filter((profile, key) => {
          return this.state.selected.filter((selected) => {
            return selected ==  key;
          }).length > 0;
        });
        setItem('selectedProfiles', selectedProfiles);
        Actions.shareProfile();
      }
  }

  selectProfile(id) {
    const selected = [...this.state.selected];
    const index = selected.indexOf(id);
    index === -1 ? selected.push(id) : selected.splice(index, 1);
    this.setState({selected});
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
      return (
        <List  key={key}>
        <ListItem>
              <TouchableOpacity onPress={() => this.selectProfile(key)}>
                  <Thumbnail source={require('../../../images/profile.png')} />
                </TouchableOpacity>
            <Body>
                <View style={{flex:1, flexDirection: 'row'}}>
                  {this.state.selected.indexOf(key) !== -1 &&
                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                          <FontIcon style={{color: 'green', fontSize: 20}} name="check"/>
                      </View>
                  }
                  <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.name}>{profile.company}</Text>
                    <Text note>{profile.title}</Text>
                  </View>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
                      <Button full light onPress={() => this.editContact(profile)}><Text>Edit</Text></Button>
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
    }
    );
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.selectTab('homeContent')}>
              <Icon style={styles.backBtn} name="arrow-back" /><Text style={{color: 'white'}}>Back</Text>
            </Button>
          </Left>
          <Body style={{ flex: 1.5 }}>
            <Title style={styles.header}>Profiles</Title>
          </Body>
          <Right>
            {/*<Button transparent onPress={() => this.props.selectTab('addProfile')}>
              <Text style={{color: 'white'}}>Share</Text>
              <Icon style={styles.addBtn} name="add" />
            </Button>*/}
            <Button transparent onPress={() => this.goToShareProfile()}>
              <Text style={{color: 'white'}}>Share</Text>
              {/*<Icon style={styles.addBtn} name="add" />*/}
            </Button>
          </Right>
        </Header>

        { this.state.loading ?
          <Spinner color="#3B5998" /> :
          <Content style={styles.content}>
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
              <Button transparent onPress={() => this.props.selectTab('addProfile')}>
                <Icon style={styles.addBtn} name="add" /><Text>ADD</Text>
              </Button>
            </View>
            <View style={styles.requestContainer}>
              <Text style={styles.whiteRequest}>Choose profile to share</Text>
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
