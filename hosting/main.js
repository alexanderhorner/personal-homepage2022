import autosize from "autosize"
import AOS from 'aos'
import 'aos/dist/aos.css'



// autosize message field
autosize(document.querySelector('.message'));


// Scroll to section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});


// google captcha
const googlecaptchaBig = document.querySelector('.g-recaptcha.g-recaptcha--big')
const googlecaptchaCompact = document.querySelector('.g-recaptcha.g-recaptcha--compact')

// Responsive google captcha
{
  const setAttribute = () => {
    if (window.innerWidth < 302 + 40) {
      googlecaptchaBig.style.display = 'none'
      googlecaptchaCompact.style.display = ''
    } else {
      googlecaptchaBig.style.display = ''
      googlecaptchaCompact.style.display = 'none'
    }
  }
  setAttribute()
  window.addEventListener('resize', setAttribute);
}



// form
const form = document.querySelector("form")
let actionPath = 'https://europe-west1-personal-homepage2022.cloudfunctions.net/formSubmit'
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  actionPath = 'http://localhost:5001/personal-homepage2022/europe-west1/formSubmit'
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  document.querySelector(".submit").disabled = true;

  const captchaResponse = grecaptcha.getResponse(window.captchaBig) || grecaptcha.getResponse(window.captchaSmall)

  const formData = new FormData(form)
  formData.set("g-recaptcha-response", captchaResponse)
  const formDataJSON = JSON.stringify(Object.fromEntries(formData))

  fetch(actionPath, {
    method: 'post',
    body: formDataJSON,
  }).then(async response => {
    const jsonResponse = await response.json()
    if (jsonResponse.status != "success") {
      document.querySelector(".error").textContent = jsonResponse.message
      throw jsonResponse.message
    }
    if (!response.ok) {
      console.log(response);
      throw `${response.statusText} (${response.status})`
    }
    return response
  }).then(response => {
    document.querySelector(".success").style.display = "block"
    document.querySelector("form").style.display = "none"
    document.querySelector(".error").style.display = "none"
  })
  .catch(error => {
    console.error(error);
    document.querySelector(".error").textContent = `Error: ${error}. Please try again later.`
    document.querySelector(".error").style.display = "block"
    document.querySelector(".submit").disabled = false;
  })
})

// get safari vw and set hero to it
{
  const heroSection = document.querySelector('.top-section')
  const realHeightIndicator = document.querySelector('.real-height-indicator')

  const validataSize = () => {
    if (heroSection.offsetHeight - realHeightIndicator.offsetHeight > 5 || heroSection.offsetHeight - realHeightIndicator.offsetHeight < 5) {
      heroSection.style.height = `min(100vh, ${realHeightIndicator.offsetHeight}px)`
    }
  }

  validataSize()
  window.addEventListener('resize', validataSize)
}


// Responsive AOS
// {
AOS.init();

//   const elements = document.querySelectorAll('[data-]')

//   const setAattributes = () => {
//     const do
//   }

//   window.addEventListener('resize', setAattributes);
// }

