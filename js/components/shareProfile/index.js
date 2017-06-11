import React, { Component } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Content, Left, Right, Body, Button, Icon, Title, List, ListItem, Spinner , Thumbnail, Toast, Card, CardItem} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import { openDrawer, selectTab, closeDrawer } from '../../actions/drawer';
import { HTTP, getItem, setItem } from '../helper/common';
// import BluetoothSerial from 'react-native-bluetooth-serial';
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
  }
  render() {
    const profiles = this.state.profiles.map((profile, key) =>{
      return (
        <Card key={key} style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
          <CardItem>
            <Grid>
              <Col size={1}>
                <Thumbnail style={{marginTop: 20}} source={require('../../../images/profile.png')} />
              </Col>
              <Col size={2} style={{marginTop: 20}}>
                <Text style={styles.name}>{profile.company}</Text>
                <Text>{profile.title}</Text>
              </Col>
              <Col size={1}>
                <Button full style={{backgroundColor: '#3b5998'}} onPress={() => this.editContact(profile)}>
                  <Text style={{color: '#fff'}}>Edit</Text>
                </Button>
                <Button full style={{marginTop: 10, backgroundColor: '#E53A40'}}  onPress={() => this.deleteContact(profile)}>
                  <Icon style={{color: '#fff'}} name='trash' />
                </Button>
              </Col>
            </Grid>
          </CardItem>
        </Card>
      )
    })
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => {Actions.friends(); this.props.closeDrawer()}}>
              <Icon style={styles.backBtn} name="arrow-back" /><Text style={{color: 'white', marginLeft: 5}}>Back</Text>
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
        <Content>
          {profiles}
        </Content>
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
