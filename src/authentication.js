const {AuthenticationBaseStrategy, AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
// const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { iff,} = require('feathers-hooks-common');
const { NotAuthenticated} = require('@feathersjs/errors');

class PasswordlessStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, ) {

    if(!authentication.token) {
      let email;
      // check if user with email (& or phone) exists
      const {data} = await this.app.service('users').find({
        query:{
          email:authentication.email
        }
      });
      email=data[0].email;

      // if not create one
      if(!email){
        let  newUser = await this.app.service('users').create({email:authentication.email});
        // verify this jama:
        email=newUser.email;
        const token=newUser.verifyShortToken;
        newUser = await this.app.service('authManagement').create({
          action:'verifySignupShort',
          value:{
            user:{email},
            token
          }
        });
      }
      console.log('now use this to play the gem ',email);
      // use their email (& or phone) address from database to generate a password reset code
      const res = await this.app.service('authManagement').create({
        action:'sendResetPwd',
        value:{email}
      });
      console.log('token sent ',res);
      // send it to them via their email (& or phone) address
      return {
        accessToken:null,
        message: `token sent to ${res.email}`
      };
    }
    //when they return the code check if their email and code
    const {email,token}=authentication;
    console.log(authentication);
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

module.exports = app => {
  const authentication = new AuthenticationService(app);


  authentication.register('jwt', new JWTStrategy());
  // uthentication.register('local', new LocalStrategy());
  authentication.register('passwordless', new PasswordlessStrategy(app));

  app.use('/authentication', authentication);
  app.configure(expressOauth());
  app.service('authentication').hooks({
    before:{
      create:[
        async(context)=>{
          const { params } = context;

          if(params.provider && !params.authentication) {
            context.params = {
              ...params,
              authentication: {
                strategy: 'passwordless'
              }
            };
          }

          return context;
        },

        iff(hook => hook.data.strategy === 'passwordless', hook => {
          const query = { email: hook.data.email };
          return hook.app.service('users').find({ query }).then(({total,data}) => {
            if (total>0) hook.params.payload = { sub: data[0].id };
            return hook;
          });
        }),

      ]
    },
    after:{
      create:[]
    },
    error:{
      create:[]
    }
  });
};
