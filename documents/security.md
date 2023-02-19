# security

- [security](#security)
  - [compromised database](#compromised-database)
  - [Brute force attacks](#brute-force-attacks)
  - [cross site scripting attack](#cross-site-scripting-attack)
  - [Denial-Of-Service (DOS) attack](#denial-of-service-dos-attack)
  - [noSGL injection attack](#nosgl-injection-attack)
  - [best practices](#best-practices)
  - [sending token in cookie](#sending-token-in-cookie)

## compromised database

when a hacker gains access to the database

- strongly encrypted passwords
- strongly encrypted reset tokens

## Brute force attacks

when a hacker tries to guess password by trying different passwords

- use bcrypt (to make login process slow)
- implement rate limiting (express-rate-limit)
- implement maximum login attempts

## cross site scripting attack

when a hacker tries to send script and run its own code

- store JWT in `HTTPOnly cookies`
- sanitize user input data
- set special http headers (helmet-package)

## Denial-Of-Service (DOS) attack

when an attacker sends too many requests to the server and breaks it down

- implement rate limiting
- limit body payload (in body-parser)
- avoid heavy REGEXs

## noSGL injection attack

when an attacker uses queries instead of valid data

- use mongoose for mongoDB (schema types)
- sanitize user input data

---

## best practices

- use **HTTPS**
- create random password reset tokens with expiry dates
- deny access to JWT after password changed
- don't commit sensitive data to Git
- don't send Error details to Client
- prevent cross site request forgery (`csurf` package)
- require re-authentication before a high value action
- implement a blacklist of untrusted JWT
- confirm user email after creating account
- keep user logged in with refresh tokens
- implement two factor authentication
- prevent parameter pollution causing Uncaught Exceptions

## sending token in cookie

to be saved in more secure place

**cookies** : are small strings that server sends to client, and client sends it back in every request
