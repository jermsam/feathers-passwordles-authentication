// const isProd = process.env.NODE_ENV === 'production';
//from,to, subject, content
const Handlebars = require('handlebars');
const template = require('../mailer/template');
const html = Handlebars.compile(template);

const makeTemplate=(from,to,subject,content)=>({

  from,
  to,
  subject,
  generateTextFromHTML: true,
  html:html({from,content}),

});

module.exports = app => {
  const support = app.get('gmail');
  const from = `BZoe Welcome <${support.user}>`;


  /**
   * @getSmsToken :The getSmsToken function generates our sms token.
   * This can either have a verify token or a reset token included.
   * For now, we are only using the verify token.
   */
  const getSmsToken = (hash) => hash;


  /**
   * @sendEmail :The sendEmail function calls our /mailer service internally to send the email.
   */
  const sendEmail = email =>
    app
      .service('mailer')
      .create(email)
      .catch(err => {
        console.log('____________________________________________________');
        console.log('Error sending email', err);
        console.log('____________________________________________________');
      });

  /**
   * @sendSMS :The sendSMS function calls our /smser service internally to send the sms.
   */
  /*
  const sendSMS = (sms) =>
    app
      .service('smser')
      .create(sms)
      .catch((err) => {
        console.log('____________________________________________________');
        console.log('Error sending sms', err);
        console.log('____________________________________________________');
      });
      */
  /**
   * @notifier :the notifier function (which is based on the action type), decides what email to send where.
   * We are now only using the verification part but this can also be used to code the other actions.
   * Also, we will only be sending the plain link to the email.
   * If you want to use html templates or some preprocessor to generate nicer looking emails,
   * you need to make sure they are inserted as a value in the html key in the email object.
   */



  const notifier = (type, user) => {
    let shortToken;
    let token;
    let mail;
    // let sms;
    let content;
    const { email, resetShortToken, // phone
    } = user;
    const to =email;
    const subject = 'Support ticket - B\'Zoe Home Care';
    console.log(user);
    switch (type) {

    case 'sendResetPwd': // inform that user's email is now confirmed
      // tokenLink = getLink('reset',email, resetToken,);
      token = resetShortToken;
      shortToken = getSmsToken(token);
      content = `Your Support Ticket is ${getSmsToken(shortToken)}`;
      mail = makeTemplate(from,to, subject, content);
      /*sms = {
        to: phone,
        message: content
      };*/
      return sendEmail(mail);

    default:
      break;
    }




  };

  return { notifier };

};
