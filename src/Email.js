import sgMail from '@sendgrid/mail';

function sendEmail() {
  sgMail.setApiKey('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');
  
  const msg = {
    to: 'conornaughton6@gmail.com',
    from: 'conornaughton6@gmail.com',
    subject: 'Test email',
    text: 'This is a test email sent from my React app using SendGrid.',
  };
  
  sgMail.send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
}

function EmailSender() {
  return (
    <div>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
}

function EmailComponent() {
  return (
    <div>
      <EmailSender />
    </div>
  );
}

export default EmailComponent;
