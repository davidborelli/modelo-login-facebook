import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
    };
  }

  getUserCallBack = (error, result) => {
    if (error) {
      console.log('getUserError()', error);
    } else {
      this.setState({loading: false, user: result});
    }
  };

  getUserInfo = token => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {string: 'email, name'},
        },
      },
      this.getUserCallBack,
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {this.state.loading && <ActivityIndicator />}
            {this.state.user && (
              <Fragment>
                <Text style={styles.userName}>{this.state.user.name}</Text>
                <Text style={styles.userEmail}>{this.state.user.email}</Text>
              </Fragment>
            )}
          </View>

          <LoginButton
            permissions={['public_profile', 'email']}
            onLoginFinished={async (error, result) => {
              if (error) {
                console.log('auth error', error);
              } else if (result.isCancelled) {
                console.log('isCancelled');
              } else {
                const accessData = await AccessToken.getCurrentAccessToken();

                this.setState({loading: true});
                this.getUserInfo(accessData.accessToken);
              }
            }}
            onLogoutFinished={() => this.setState({user: null})}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
});
