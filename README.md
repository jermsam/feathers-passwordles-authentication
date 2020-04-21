# feathers-passwordles-authentication

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.
It's a modification of [Nick Baroni's](https://github.com/rhythnic) example on the subject that you can [find here](https://github.com/rhythnic/feathers-passwordless-auth-example).
It was revised to work with the current [4.x.x version](https://github.com/feathersjs/feathers)

## Major Changes

Followed the logic explained in the previous article with the following modifications

1. Modified the **mailer service** to work with **gmail api** with **oauth2 authentication** to avoid the trouble of having to **Enable Less Secure Apps** as explained by **Nick Roach** in [his medium article here](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1).

2. Used short codes (**resetPwdShort**) instead of the magic link (from **resetPwdLong**) that was used in the mother article

3. Removed the account authentication logic that used to happens after the **resetPWdShort** action for authmanagement [explained here](https://github.com/rhythnic/feathers-passwordless-auth-example#auth-managementhooksjs) and and the hook that [disallowed local authentication for external providers](https://github.com/rhythnic/feathers-passwordless-auth-example#authentication-service) there by making it a candidate for [Anonymous authentication](https://docs.feathersjs.com/cookbook/authentication/anonymous.html).

4. I then went to **config/default.js** and created a new custom strategy called **"passwordless"**:

    ```
    "authentication":{
      ...
   "authStrategies": [
      "jwt",
      "passwordless"
     ],
    "passwordless": {
      "usernameField": "email",
      "passwordField": "email"
    }
    ...
   }
    ```

5. Then defined it as shown below:

    ```
    const {AuthenticationBaseStrategy, AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
   
    const { NotAuthenticated} = require('@feathersjs/errors');
     ...
    class PasswordlessStrategy extends AuthenticationBaseStrategy {
       async authenticate(authentication, ) {

        if(!authentication.token) {

        let email;
      // check if user with email (& or phone) exists
      const {total,data} = await this.app.service('users').find({
        query:{
          email:authentication.email
        }
      });

      if(total>0) email=data[0].email;

      // if not create one
      if(!email){
        let  newUser = await this.app.service('users').create({email:authentication.email});
        // verify this jama:
        email=newUser.email;
      }
      // console.log('now use this to play the gem ',email);
      // use their email (& or phone) address from database to generate a password reset code
      const res = await this.app.service('authManagement').create({
        action:'sendResetPwd',
        value:{email}
      });
      // console.log('token sent ',res);
      // send it to them via their email (& or phone) address
      return {
        accessToken:null,
        message: `token sent to ${res.email}`
      };
    }
    //when they return the code check if their email and code
    const {email,token}=authentication;
    // console.log(authentication);
    // match by running a resetPwdShort if they do, authenticate
    // if it expired say so and prompt them to retry
    // if invalid do the same

    try{

      const res=  await this.app.service('authManagement').create({
        action:'resetPwdShort',
        value:{
          user:{email},
          token
        }
      });

      console.log(res);
      return {
        email,
      };

    }catch(err){
      console.log('which error: ',err.message);
      throw new NotAuthenticated('Your ticket has expired. Request for a new one');
    }

    }
   }

    ```

6. Yes ofcourse I used [feathers-sequelize](https://github.com/feathersjs-ecosystem/feathers-sequelize) for postgres but this could do for any other datasource.

## To use this very sample

1. [Download](https://github.com/jermsam/feathers-passwordles-authentication.git) the example or clone the repo:

```
git clone https://github.com/jermsam/feathers-passwordles-authentication.git your-app
```

2. Change into your app's directory and download the dependencies

```
cd your-app
yarn
```
3. create a .env file 

```
touch .env
```

4. create your postgres database and inside the .env file define the postgres database connection variables
```
host=YOURDATABASEHOST
port=YOURDATABASEPORT
username=YOURDATABASEUSERNAME
pwd=YOUR PWD
db=YOURDATABASENAME
```


## RUN

```
yarn dev
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
