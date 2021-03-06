import React, { Component } from 'react';
import { Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Item, Input, Button, View, Spinner } from 'native-base';
import { Grid, Col } from 'react-native-easy-grid';

import styles from './styles';
import { selectTab } from '../../actions/drawer';
import { HTTP, setItem } from '../helper/common';

const logo = require('../../../images/logo.png');

class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      reenteremail: '',
      password: '',
      tab: 'homeContent',
      error: '',
      loading: false,
    };
    this.constructor.childContextTypes = {
      theme: React.PropTypes.object,
      selectTab: React.PropTypes.func,
      tabState: React.PropTypes.string,
    };

    this.handleOnPress = this.handleOnPress.bind(this);
    this.isFormInValid = this.isFormInValid.bind(this);
    this.isEmailValid = this.isEmailValid.bind(this);
    this.signUpSucessfull = this.signUpSucessfull.bind(this);
    this.signUpUnSucessfull = this.signUpUnSucessfull.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  handleOnPress() {
    const { email, reenteremail } = this.state;
    if (this.isFormInValid()) {
      this.setState({ error: 'Forms cannot be empty!' });
    } else if (!this.isEmailValid()) {
      this.setState({ error: 'Email structure not valid' });
    } else if (email === reenteremail) {
      this.setState({ error: '', loading: true });
      this.callRegistrationApi();
    } else {
      this.setState({ error: 'Email does not match', loading: false });
    }
  }

  isFormInValid() {
    const { email, reenteremail, password, firstname, lastname } = this.state;
    return (email === '' || reenteremail === '' || password === '' || firstname === '' || lastname === '');
  }

  isEmailValid() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (re.test(this.state.email) && re.test(this.state.reenteremail));
  }

  callRegistrationApi() {
    const { email, password, firstname, lastname } = this.state;
    const uri = 'api/Registrations';
    const payload = {
      email,
      password,
      firstName: firstname,
      lastName: lastname,
    };

    HTTP(uri, 'POST', payload)
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.isActive === true) {
        setItem('user', responseData);
        this.signUpSucessfull(responseData);
      } else {
        this.signUpUnSucessfull(responseData);
      }
    })
    .done();
  }

  signUpSucessfull(responseData) {
    this.setState({ loading: false });
    Actions.home({
      firstname: responseData.firstName,
      lastname: responseData.lastName,
      email: responseData.email,
    });
  }

  signUpUnSucessfull(responseData) {
    const error = responseData.errorUserMessage;
    this.setState({ error, loading: false });
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <Button
          block
          style={styles.createBtn}
        >
          <Spinner color="#fff" />
        </Button>
      );
    }
    return (
      <Button
        block
        style={styles.createBtn}
        onPress={this.handleOnPress}
      >
        <Text style={{ lineHeight: 16, fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}>CREATE</Text>
      </Button>
    );
  }

  render() {
    return (
      <Container style={styles.background}>
        <Content>
          <Image source={logo} style={Platform.OS === 'android' ? styles.aShadow : styles.iosShadow} />
          <View style={{ padding: 30, paddingTop: 20 }}>
            <Grid style={{ marginBottom: 10 }}>
              <Col style={{ paddingRight: 10 }}>
                <Item borderType="underline" style={styles.inputGrp}>
                  <Input
                    placeholder="First Name"
                    placeholderTextColor={'#fff'}
                    autoCapitalize="none"
                    onChangeText={firstname => this.setState({ firstname })}
                    style={styles.input}
                  />
                </Item>
              </Col>
              <Col style={{ paddingLeft: 10 }}>
                <Item borderType="underline" style={styles.inputGrp}>
                  <Input
                    placeholder="Last Name"
                    autoCapitalize="none"
                    placeholderTextColor={'#fff'}
                    onChangeText={lastname => this.setState({ lastname })}
                    style={styles.input}
                  />
                </Item>
              </Col>
            </Grid>
            <Item borderType="underline" style={styles.inputGrp}>
              <Input
                placeholder="Email address"
                placeholderTextColor={'#fff'}
                autoCapitalize="none"
                onChangeText={email => this.setState({ email })}
                style={styles.input}
              />
            </Item>
            <Item borderType="underline" style={styles.inputGrp}>
              <Input
                placeholder="Re-enter email address"
                placeholderTextColor={'#fff'}
                autoCapitalize="none"
                onChangeText={reenteremail => this.setState({ reenteremail })}
                style={styles.input}
              />
            </Item>
            <Item borderType="underline" style={styles.inputGrp}>
              <Input
                placeholder="New password"
                placeholderTextColor={'#fff'}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={password => this.setState({ password })}
                style={styles.input}
              />
            </Item>
            <Text style={styles.errorTypeStyle}>
              {this.state.error}
            </Text>
            { this.renderButton() }
            <Button
              transparent
              onPress={() => Actions.pop()}
              style={{ alignSelf: 'flex-end' }}
            >
              <Text style={styles.forgotPassword}>
                      Sign In
              </Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    selectTab: newTab => dispatch(selectTab(newTab)),
  };
}
const mapStateToProps = state => ({
  tabState: state.drawer.tabState,
});


export default connect(mapStateToProps, bindAction)(SignUp);
