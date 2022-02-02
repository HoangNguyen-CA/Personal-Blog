---
title: 'JWT-Based Authentication'
date: '2021-07-26'
---

## Why Json Web Tokens?

JWTs are a popular way to authenticate and authorize users. There are several advantages of using JWTs when compared to session-based authentication:

- Data is stored in client (token in localStorage) as opposed to being stored in a database (sessions). This makes JWTs more scalable.
- There are issues with session based authentication because they rely on cookies, cookies can be disabled when used from a different domain. JWTs are sent in the request header so no such problems exist.
- Cookies only work for web browsers, other applications may need additional logic to implement session-based authentication (like mobile native apps).
- Using JWTs makes a server stateless and truly adhere to REST architecture.

## JWT Workflow

1. User sends authentication data to server.
2. Server verifies authentication data and sends back a JWT.
3. The JWT is stored in the client localStorage.
4. The JWT is sent on all further requests to the server (in the header).
5. Protected routes verify the integrity of the JWT.
6. Server authorizes user to access to protect route.

## What Exactly Is a Json Web Token?

A JWT consists of 3 parts. The header, the payload and the signature. The header & payload are standard JSON objects.

```js

//header
{
  "alg": "HS256",
  "typ": "JWT"
}

//payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

```

The header and token are base64 encoded to form the first two parts of the token. The server then takes the encoded header & payload and hashes + encodes it with an algorithm (usually HS256 or RS256). This generates the third and final part of the token, the signature.The three parts of the token are separated by ".".

```js
//example
const signature = HMACSHA256(
  base64UrlEncode(header) + '.' + base64UrlEncode(payload),
  secret
);

/* 
Resulting token: 

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ->header
.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ -> payload
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c -> signature
*/
```

The final result is a 3-part token that can be sent in the request header to authorize an user.

## Signing The Token

JWTs can be signed using a symmetric algorithm (HS256) or an asymmetric algorithm (RS256). The signature is used to verify the integrity of the token, not to hide the data from other parties (encoding).

### Symmetric Algorithm

A symmetric algorithm uses a single key to sign data. When the token is created, the header & payload are hashed and encoded with the key. When the server receives a JWT, it decodes the signature given the key, and compares it to the hash of the header & payload. If the hashes match, it means the data has not been tampered with and the token is valid.

Using one key to encrypt/decrypt can cause problems because anyone who has access to the key can create any type of token and impersonate others. There is also no way to know if a token is valid without having access to the key. This problem is solved by using asymmetric encryption.

### Asymmetric Algorithm

An asymmetric algorithm uses a private key and a public key to sign data. The private key is used to encode the data while the public key is used to decode the data. When the token is created, the server hashes the header & payload and encodes it with the private key. When the server receives a JWT, it decodes the signature using the public key and compares it to the hash of the header & payload. If the hashes match, then the token is valid and the data has not been tampered with.

The advantage of using an asymmetric algorithm is that only the holder of the private key can create tokens. Anyone else can use the matching public key to verify the integrity of the token and make sure that the token is coming from the private key holder.
