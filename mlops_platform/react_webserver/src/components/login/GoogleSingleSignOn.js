
import React from 'react';

import { GoogleLogin } from 'react-google-login';

const clientId =
  '891936086605-48mauburkbjj9opi3he2k5l3gusv1ath.apps.googleusercontent.com';

export default class GoogleSingleSignOn extends React.Component {

    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);
        this.onFailure = this.onFailure.bind(this);
    }

    onSuccess(response) {
        fetch(process.env.REACT_APP_API_URL + '/peoples_speech/verify_account',
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(response) // body data type must match "Content-Type" header
            }
        )
        .then(res => res.json())
        .then((data) => {
            this.handleGranted(response, data["is_granted"]);
        })
        .catch(console.log)
    }

    handleGranted(response, is_granted) {
        if (is_granted) {
            this.props.setToken(response);
            console.log('Login Success: currentUser:', response.profileObj);
            alert(
              `Logged in successfully welcome ${response.profileObj.name} 😍. \n See console for full profile object.`
            );
            refreshTokenSetup(response);
        }
        else {
            alert('Login denied.');
        }
    }

    onFailure(response) {
    }

    render() {
        return (
            <div>
                <GoogleLogin
                    clientId={clientId}
                    buttonText="Login"
                    onSuccess={this.onSuccess}
                    onFailure={this.onFailure}
                    cookiePolicy={'single_host_origin'}
                    style={{ marginTop: '100px' }}
                    isSignedIn={true}
                />
            </div>
        );
    }
}

function refreshTokenSetup(res) {
    // Timing to renew access token
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async () => {
        const newAuthRes = await res.reloadAuthResponse();
        refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
        console.log('newAuthRes:', newAuthRes);
        // saveUserToken(newAuthRes.access_token);  <-- save new token
        localStorage.setItem('authToken', newAuthRes.id_token);

        // Setup the other timer after the first one
        setTimeout(refreshToken, refreshTiming);
    };

    // Setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
}


