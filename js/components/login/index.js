import React, { Component } from 'react';
import { Image, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Item, Input, Button, View, Spinner } from 'native-base';
import { bindActionCreators } from 'redux';
import styles from './styles';
import { selectTab } from '../../actions/drawer';
import { addUser }  from '../../actions/userActionCreator';
import { HTTP, setItem, getItem } from '../helper/common';


const logo = require('../../../images/logo.png');


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      tab: 'homeContent',
      error: null,
      loading: false,
      logic: true
    };
    // this.constructor.childContextTypes = {
    //   theme: React.PropTypes.object,
    //   selectTab: React.PropTypes.func,
    //   tabState: React.PropTypes.string,
    // };

    this.handleOnPress = this.handleOnPress.bind(this);
    this.isFormInValid = this.isFormInValid.bind(this);
    this.isEmailValid = this.isEmailValid.bind(this);
    this.signUpSucessfull = this.signUpSucessfull.bind(this);
    this.signUpUnSucessfull = this.signUpUnSucessfull.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  componentWillMount() {
    this.setState({logic: true})
    getItem('user')
      .then((user) => {
        this.props.dispatch(addUser(user));
        Actions.home({
          firstname: this.props.user.firstName,
          lastname: this.props.user.lastName,
          email: this.props.user.email,
        });
      })
      .finally(() =>{
        this.setState({logic: false});
      });
  }

  handleOnPress() {
    if (this.isFormInValid()) {
      this.setState({ error: 'Form cannot be empty!' });
    } else if (!this.isEmailValid()) {
      this.setState({ error: 'Invalid email' });
    } else {
      this.setState({ error: null, loading: true });
      this.callRegistrationApi();
    }
  }

  isFormInValid() {
    const { email, password } = this.state;
    return (email === '' || password === '');
  }

  isEmailValid() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.email);
  }

  callRegistrationApi() {
    const { email, password } = this.state;
    const uri = `api/Registrations?email=${email}&password=${password}&tguid=0`;

    HTTP(uri, 'GET')
    .then(response => response.json())
    .then((responseData) => {
      if (responseData.isActive === true) {
        setItem('user', responseData);
        this.props.dispatch(addUser(responseData));
        this.signUpSucessfull(responseData);
      } else {
        this.signUpUnSucessfull();
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

  signUpUnSucessfull() {
    const error = 'Login failed ! Please try again';
    this.setState({ error, loading: false });
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <Button
          block
          style={styles.loginBtn}
        >
          <Spinner color="#fff" />
        </Button>
      );
    }
    return (
      <Button
        block
        style={styles.loginBtn}
        onPress={this.handleOnPress}
      >
        <Text style={{ lineHeight: 16, fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' }}>LOG IN</Text>
      </Button>
    );
  }

  render() {
    return (
      <Container style={styles.background}>
        {!this.state.logic ?
          <Content>
            <Image source={logo} style={Platform.OS === 'android' ? styles.aShadow : styles.iosShadow} />
            <View style={{ padding: 40 }}>
              <Item borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="Email"
                  placeholderTextColor={'#fff'}
                  autoCapitalize="none"
                  onChangeText={email => this.setState({ email })}
                  style={styles.input}
                />
              </Item>
              <Item borderType="underline" style={styles.inputGrp}>
                <Input
                  placeholder="Password"
                  placeholderTextColor={'#fff'}
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={password => this.setState({ password })}
                  style={styles.input}
                />
              </Item>
              {this.state.error &&
                <View>
                  <Text style={styles.errorTypeStyle}>
                    {this.state.error}
                  </Text>
                </View>
              }
              { this.renderButton() }
              <Button transparent style={{ alignSelf: 'center' }}>
                <Text style={styles.forgotPassword}>
                  Forgot Password?
                </Text>
              </Button>
              <Button
                block bordered
                style={styles.createBtn}
                onPress={() => Actions.signUp()}
              >
                <Text style={styles.createBtnTxt}>CREATE NEW ACCOUNT</Text>
              </Button>
            </View>
          </Content>
          : <ActivityIndicator />
        }
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    selectTab: newTab => dispatch(selectTab(newTab))
  };
}

const mapStateToProps = state => ({
  tabState: state.drawer.tabState,
  user: state.user.user
});

export default connect(mapStateToProps, bindAction)(Login);
