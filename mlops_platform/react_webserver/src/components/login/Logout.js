import React from 'react';

import { GoogleLogout } from 'react-google-login';

const clientId =
  '891936086605-48mauburkbjj9opi3he2k5l3gusv1ath.apps.googleusercontent.com';

export default class Logout extends React.Component {

    constructor(props) {
        super(props);

        this.onSuccess = this.onSuccess.bind(this);
    }

    onSuccess() {
        this.props.setToken(null);
        console.log('Logout success Success');
        alert('Logout successful.');
    }

    render() {

        return (
            <div>
                <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={this.onSuccess}
                >
                </GoogleLogout>
            </div>
        );

    }

}

