import Client from ".";

export default class OAuth2Client implements Client {
  clientId: string;
  state: string;
  redirectUri: string;

  constructor(clientId: string, state: string, redirectUri: string) {
    this.clientId = clientId;
    this.state = state;
    this.redirectUri = redirectUri;
  }
}
