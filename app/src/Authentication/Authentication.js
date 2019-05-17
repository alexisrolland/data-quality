import gql from 'graphql-tag';
import UrlBuilder from '../Components/Base/UrlBuilder';
import InvalidUserCredentials from '../Exceptions/InvalidUserCredentials';
import DevLog from '../DevLog';
import Client from '../Components/Base/Client';
import SessionUser from './SessionUser';

export default class Authentication {
  // THIS LINE IS REQUIRED FOR ESLINT :/ (try to remove it and you find out why ;)
  /**
   * Authenticate current user and save their tokens/data in the session storage
   * @param userEmail
   * @param password
   * @returns {Promise<SessionUser>}
   */
  static async authenticateSessionUser(userEmail, password) {
    SessionUser.sessionToken = await this.getFreshBearerToken(userEmail, password);
    SessionUser.user = await this.getUser(userEmail);
    return SessionUser;
  }

  /**
   * Request a new Session token
   * @param userEmail
   * @param userPassword
   * @returns {Promise<Token|*>}
   */
  static async getFreshBearerToken(userEmail, userPassword) {
    const GET_TOKEN = gql`
    mutation getToken($userEmail: String!, $userPassword: String!){
       authenticateUser(input: {userEmail: $userEmail, userPassword: $userPassword}) {
          token
       }
    }`;

    const variables = {
      userEmail,
      userPassword
    };

    DevLog.info(`Requesting auth-token: ${UrlBuilder.getDefault().graphQl()}`);

    const apolloClient = Client.getApolloClient();

    const result = await apolloClient.mutate({
      'mutation': GET_TOKEN,
      variables
    });

    DevLog.info(result);

    if (!result.data.authenticateUser.token) {
      throw new InvalidUserCredentials();
    }

    return result.data.authenticateUser.token;
  }

  static async getUser(userEmail) {
    const GET_USER_ROLE = gql`
    query myusers ($userEmail: String!){
      userByEmail(email: $userEmail) {
        id
        email
        role
      }
    }`;

    DevLog.info(`Requesting user data: ${UrlBuilder.getDefault().graphQl()}`);

    const apolloClient = Client.getApolloClient();

    const result = await apolloClient.query({
      'query': GET_USER_ROLE,
      'variables': { userEmail }
    });

    DevLog.log('Userdata: ', result.data.userByEmail);

    return result.data.userByEmail;
  }
}