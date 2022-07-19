import * as functions from "firebase-functions"
// import * as admin from "firebase-admin"

type requestBody = {
  "g-recaptcha-response": String,
  "name": String,
  "email": String,
  "message": String
}

exports.formSubmit = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*')

    try {

      const data:requestBody = JSON.parse(req.body)

      // const fetch = (await import('node-fetch')).default
      const axios = require('axios').default;

      // Captcha verification
      const apiRoute = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_PRIVATE_KEY}&response=${data["g-recaptcha-response"]}`
      const captchaResponse = await axios.get(apiRoute)
      if (captchaResponse.data.success !== true) {
        throw `reCAPTCHA failed (${captchaResponse.data["error-codes"][0]})`
      }

      // Send Email
      const emailBody = 
`Von: ${data.name || 'Unbekannt'} (${data.email || 'Nicht angegeben'})
Nachricht:
${data.message || "Leere Nachricht"}
`

      const requestBody = JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: "mail@alexanderhorner.com"
              }
            ],
            subject: "Homepage Contact form"
          }
        ],
        content: [
          {
            type: "text/plain",
            value: emailBody
          }
        ],
        from: {
          email: "mail@alexanderhorner.com"
        },
        reply_to: {
          email: data.email || 'email.nicht.gegeben',
          name: data.name || 'Kein Name'
        }
      })

      await axios(
        'https://api.sendgrid.com/v3/mail/send', 
        {
          data: requestBody,
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
      ).catch((error: any) => {
        throw error.response.data.errors?.[0]?.message || error
      })

      res.json({
        "status": "success",
        "data": null
      })

    } catch (error) {
      res.status(400).json({
        "status": "error",
        "message": String(error)
      })

    }
  });
