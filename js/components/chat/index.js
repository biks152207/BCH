import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Text, TextInput, ActivityIndicator,
  Platform} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Left, Right, Body, Content, Button, Icon, Thumbnail, Title, List, Spinner, Card, CardItem} from 'native-base';
import {BleManager, LogLevel} from 'react-native-ble-plx';
import { Col, Row, Grid } from "react-native-easy-grid";
import { openDrawer, selectTab } from '../../actions/drawer';

import styles from './styles';
import data from './data';



const primary = require('../../themes/variable').brandPrimary;

const chatContactsImg = require('../../../images/chatcontacts.png');
const profileImg = require('../../../images/profile.png');
const lamborghini = require('../../../images/lamborghini.png');


class Chat extends Component {  // eslint-disable-line

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = { text: ''};
    this.manager = new BleManager();
    this.manager.setLogLevel(LogLevel.Verbose);
    this.scan = this.scan.bind(this);
    this.error = this.error.bind(this);
    this.scanAndConnect = this.scanAndConnect.bind(this);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      alert(device);
      alert(JSON.stringify(device));
    })
  }

  error(err) {
    alert(err);
  }

  scan() {
  }


  render() {
    return (
      <Container style={{ backgroundColor: '#fff' }}>
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.selectTab('homeContent')}>
            <Icon style={styles.backBtn} name="arrow-back" /><Text style={{color: 'white', marginLeft: 5}}>Back</Text>
          </Button>
        </Left>
        <Body style={{ flex: 1.5 }}>
          <Title style={styles.header}>Receive</Title>
        </Body>
      </Header>
        <Content style={styles.content}>
          <Card style={{marginTop: 10, marginLeft: 15, marginRight: 15}}>
            <CardItem>
              <Grid>
                <Col size={1}>
                  <Thumbnail source={require('../../../images/profile.png')} style={{ marginTop: 20}}/>
                </Col>
                <Col size={2} style={{ marginTop: 20}}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18}}>{this.props.user.firstName} {this.props.user.lastName}</Text>
                  <Text>{this.props.user.email}</Text>
                </Col>
                <Col size={1}>
                  <Button full style={{backgroundColor: '#3b5998'}} onPress={() => this.editContact(profile)}><Text style={{color: '#fff'}}>Edit</Text></Button>
                  <Button full style={{marginTop: 10, backgroundColor: '#E53A40'}}  onPress={() => this.deleteContact(profile)}><Icon name='trash' style={{color: '#fff'}}/></Button>
                </Col>
              </Grid>
            </CardItem>
          </Card>
          <View style={styles.scannerContainer}>
            <Button style={styles.scannerButton} onPress={() => this.scanAndConnect()}>
                <Icon name='add' style={{color: 'white', fontSize: 20, fontWeight: '800'}}/>
                <Text style={{color: 'white', fontSize: 20}}>Add to contacts</Text>
            </Button>
          </View>

          <View style={styles.largeDivider}>
            <Text>DEVICES NEARBY</Text>
          </View>

          <View style={{flex: 1, marginBottom: 70 }}>
            <List
            dataArray={data}
            renderRow={dataRow =>
              <TouchableOpacity style={styles.nameContainer}>
              <Thumbnail circle size={60} source={dataRow.image} />
              <View style={{ marginTop: 8 }}>
              <Text style={styles.userName}>{dataRow.name}</Text>
              <Text style={styles.viewProfileText}>{dataRow.note}</Text>
              </View>
              <Icon active name="hand" style={styles.arrowForward} />
              </TouchableOpacity>
            }
            />
          </View>
        </Content>
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

const mapStateToProps = state => ({
  user: state.user.user
});


export default connect(mapStateToProps, bindAction)(Chat);
