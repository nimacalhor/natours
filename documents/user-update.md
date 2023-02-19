# updating users data

- [updating users data](#updating-users-data)
  - [forgot password](#forgot-password)
    - [sending email](#sending-email)
      - [mailtrap](#mailtrap)
    - [reset password](#reset-password)
      - [get user by token](#get-user-by-token)
  - [user updates his password](#user-updates-his-password)
  - [user updates his data](#user-updates-his-data)
  - [deleting user](#deleting-user)

## forgot password

1. get user by its email
2. generate reset token : fake random token witch must have an expiration time
3. send it to users email

### sending email

```npm
npm install nodemailer
```

for development use `mailtrap`

#### mailtrap

1. create transporter
2. define email options
3. send email

### reset password

1. get user by token and check if exists
2. if token was not expired, change the password
3. update changedPasswordAt property of the user
4. log the user in, send new JWT

#### get user by token

we have access to the decrypted token from the request, but the token that is saved on the server is encrypted

## user updates his password

this password update functionality is for logged in users. for more security we can accept his password for this action

1. get user from collection
2. validate password
3. update password
4. log user in

## user updates his data

1. return error when he wanted to update his password
2. filter out not allowed fields
3. update user

## deleting user

for this action we don't delete the document from collection but we make it `inactive`
