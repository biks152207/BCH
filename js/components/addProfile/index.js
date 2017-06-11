import React, { Component } from 'react';
// import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { View, Text, ScrollView } from 'react-native';
import { Container, Header, Left, Body, Button, Icon, Title, Right, Content, ActivityIndicator, Spinner} from 'native-base';
// import { HTTP } from '../helper/common';
import { openDrawer, selectTab } from '../../actions/drawer';
import styles from './styles';
import { getItem, emailCheck, HTTP, executeMsg } from '../helper/common';
import t from 'tcomb-form-native';
const Form = t.form.Form;

const Email = t.subtype(t.Str, function (s) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(s);
});

const FormStructure = t.struct({
  "profileName": t.String,
  "firstName": t.String,
  "lastName": t.String,
  "company": t.String,
  "title": t.String,
  "phoneOffice01": t.String,
  "phoneOffice02": t.maybe(t.String),
  "phoneMobileWork": t.String,
  "phoneMobilePersonal": t.String,
  "emailWork": Email,
  "emailPersonal": Email,
  "websiteWork": t.maybe(t.String),
  "websitePersonal": t.maybe(t.String),
  "linkedInUrl": t.maybe(t.String),
  "googlePUrl": t.maybe(t.String),
  "twitter": t.maybe(t.String),
  "PictureUrl": t.String
});

const options = {
  auto: 'none',
  fields: {
    emailWork: {
      placeholder: 'Workplace email',
      error: 'Enter your valid email',
      autoCapitalize: 'none',
      value: 'bikrambasnet1@gmail.com'
    },
    emailPersonal: {
      placeholder: 'Personal email',
      autoCapitalize: 'none',
      error: 'Enter your valid email'
    },
    linkedInUrl: {
      placeholder: 'LinkedIn profile link',
      autoCapitalize: 'none'
    },
    twitter: {
      placeholder: 'Twitter profile link',
      autoCapitalize: 'none'
    },
    googlePUrl: {
      placeholder: 'Google profile link',
      autoCapitalize: 'none'
    },
    phoneMobilePersonal: {
      placeholder: 'Personal mobile/phone',
      autoCapitalize: 'none'
    },
    phoneMobileWork: {
      placeholder: 'Work mobile/phone',
      autoCapitalize: 'none'
    },
    phoneOffice01: {
      placeholder: 'Office phone 1',
      autoCapitalize: 'none',
      error: 'Enter your office number'
    },
    phoneOffice02: {
      placeholder: 'Office phone 2',
      autoCapitalize: 'none'
    },
    title: {
      placeholder: 'Title',
      autoCapitalize: 'none',
      error: 'Enter your title'
    },
    profileName: {
      placeholder: 'Profile name',
      autoCapitalize: 'none',
      error: 'Enter your profile name'
    },
    firstName: {
      placeholder: 'First name',
      autoCapitalize: 'none',
      error: 'Enter your first name'
    },
    lastName: {
      placeholder: 'Last name',
      autoCapitalize: 'none',
      error: 'Enter your last name'
    },
    company: {
      placeholder: 'Company',
      autoCapitalize: 'none',
      error: 'Enter your company name'
    },
    websiteWork: {
      placeholder: 'Website (work)',
      autoCapitalize: 'none'
    },
    websitePersonal: {
      placeholder: 'Website (personal)',
      autoCapitalize: 'none'
    },
    PictureUrl: {
      placeholder: 'Picture link',
      autoCapitalize: 'none'
    }
  }
}



class AddProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 'addProfile',
      tguid: null,
      progress: false,
      profileForm: {
        "profileId": 0,
        "userId": null,
        "profileName": null,
        "firstName": null,
        "lastName": null,
        "company": null,
        "title": null,
        "phoneOffice01": null,
        "phoneOffice02": null,
        "phoneMobileWork":null,
        "phoneMobilePersonal": null,
        "emailWork": null,
        "emailPersonal": null,
        "websiteWork": null,
        "websitePersonal": null,
        "linkedInUrl": null,
        "googlePUrl": null,
        "twitter": null,
        "PictureUrl": null
      }
    };
    console.log('props....', this.props);
    this.onChange = this.onChange.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  onChange(profileForm) {
    this.setState({profileForm});
    console.log(this.state.profileForm);
  }

  componentDidMount() {
    getItem('user')
      .then((result) => {
        const userInfo = {
          userId: result.userId,
          profileId: 0
        }
        if (this.props.type === 'Enter') {
          this.setState({ profileForm: userInfo, tguid: result.tguid });
        } else {
          getItem('profile')
            .then((profile) => {
              const editingProfile = Object.assign({}, profile);
              if (!editingProfile.PictureUrl) {
                editingProfile.PictureUrl = null;
              }
              this.setState({tguid:result.tguid,  profileForm: editingProfile });
            })
        }
      });
  }

  onPress() {
    const value = this.refs.form.getValue();
    if (value) {
      this.setState({progress: true});
      const uri = `api/profiles?userId=${this.state.profileForm.userId}&tguid=${this.state.tguid}`;
      HTTP(uri, 'POST', this.state.profileForm)
        .then((result) => {
          return result.json();
        })
        .then((jsonResponse) => {
          if (this.props.type === 'Enter') {
            executeMsg('Successfully added new profile.');
          } else {
            executeMsg('Updated profile Successfully.');
          }
        })
        .catch((err) => {
        })
        .finally(() => {
          this.setState({progress: false})
        })
    }
  }

  render() {
    return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.selectTab('friends')}>
                <Icon style={styles.backBtn} name="arrow-back" />
              </Button>
            </Left>
            <Body style={{ flex: 1.5 }}>
              {this.props.type == 'Enter' ?
                <Title style={styles.header}>Add Profile</Title>:
                <Title style={styles.header}>Update Profile</Title>
              }
            </Body>
            <Right>
            </Right>
          </Header>
          <Content style={{margin: 20}}>
              <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 20, padding: 10}}>{this.props.type} your profile information</Text>
              </View>
              <Form
              ref="form"
              type={FormStructure}
              options={options}
              value={this.state.profileForm}
              onChange={this.onChange.bind(this)}
            />
            <View style={{flex: 1,alignItems: 'center', justifyContent:'center', flexDirection: 'row', marginBottom: 40}}>
              <Button style={{backgroundColor: '#3b5998', marginBottom: 10}} onPress={this.onPress.bind(this)}>{this.props.type === 'Enter' ? <Text style={{fontSize: 16, color: '#fff'}}>Save</Text>:  <Text style={{fontSize: 16, color: '#fff'}}>Update</Text>}{this.state.progress && <Spinner/>}</Button>
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

function mapStateToProps(state) {
  return {
    user: state.user
  };
}


export default connect(mapStateToProps, bindAction)(AddProfile);
