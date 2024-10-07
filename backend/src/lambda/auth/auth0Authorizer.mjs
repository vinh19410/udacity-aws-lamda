import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-sh6tseyvjgrnt4z4.us.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJJNZfIWWtLZjSMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1zaDZ0c2V5dmpncm50NHo0LnVzLmF1dGgwLmNvbTAeFw0yMzAzMDYx
NTI4NTJaFw0zNjExMTIxNTI4NTJaMCwxKjAoBgNVBAMTIWRldi1zaDZ0c2V5dmpn
cm50NHo0LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAMu07azw1gFoYBF4kN2lSxE23Cwv5xn34fV6zJoG6mhxTqyDjD/w2bRWD7lg
+8WZSSMoqHOcIM+CBCysnWAH5NOWX+RY9tLI7PAiyVYw8VQpYRmSdcbt578YDDDk
kCKcCPhTOj/H/1mwC/qhK2NDd19yAXI15la8hi3e2Ip8z7/mO2c8udi/TUhL3t8G
hjVeQDtN5RbSBbtX/avLkS8whmAZhmRAW2UNlqzRbAEMIZ7DWQYSEKTtEyJokQaj
/ShODRDxK8ItdmkWfJJrcYJWiSQK3v5DqkYFli0zYyp6Vkr0hjkzYkFYwsURKmSM
+D3qgcX1JvbprQlAuIPKATvyYjcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUia8kts/44Bln3CKt3AILYFFZ9gUwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBCMOxDtQ6Yn0YWvTBEmsPKt9HOAW/sBSTMJ3cmHuPg
6HpyxWCioLHmOcfWGmOW4jON5r/RLbhHdeT28aNd1Ej6Kqf1POvTfyxRObzOtYOV
w92ie0D3uOUAjZrXg91GUZFCja2NkS1dnVaF0hx5wWlRc8q9ZrMEcDOV26tbPWaa
9vlNvLTxkmc5kdshhCd2meTff93wHZht1LJUBYl/QoGHdbKBbCghywiCz+1AOY5T
MsttN1nAViQJN71tBR+3Rao2cs5ufdqwzOefhezBt7qfUpkQJfQHIEqf08D04bzf
0KsHZO8extP2vF2teYIIkuAXOB2+FDbfptyQJYOyA88q
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  // const jwt = jsonwebtoken.decode(token, { complete: true })

  // // TODO: Implement token verification
  // const response = await Axios.get(jwksUrl);
  // const keys = response.data.keys;
  // const  signingKeys = keys.find(key => key.kid === jwt.header.kid);
  // logger.info("signingKeys", signingKeys);
  // if(!signingKeys){
  //   throw new Error(`The jwks endpoint not valid`);
  // }

  // const pemData = signingKeys.x5c[0];
  // const cert = 

  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
