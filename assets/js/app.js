(function ($) {
  var form = document.getElementById('contactForm');
  var errorMessages = document.getElementById('errorMessages');
  var spinner = document.getElementById('spinner');

  window.onContactFormSubmit = function(captchaResponse) {
    var doSubmit = true;
    if (form.checkValidity() === false) {
      doSubmit = false;
    }
    form.classList.add('was-validated');

    clearErrorMessages();

    if (doSubmit) {
      var data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        hcaptcha: captchaResponse
      };

      showSpinner();

      fetch('https://holistic-olivine-buzzard.glitch.me/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function (response) {
        hideSpinner();
        if (response.ok) {
          $('#contactModal').modal('hide');
          setTimeout(function() {
            alert('Your message to Spruce Therapy has been sent.');
          }, 10);
        } else if (response.status === 400) {
          response.json().then(function (jsonResult) {
            setErrorMessages(jsonResult.errors);
          });
        } else {
          setErrorMessages("Sorry, the message couldn't be sent. Please try again");
        }
      })
      .catch(function () {
        hideSpinner();
        setErrorMessages("Sorry, the message couldn't be sent. Please try again");
      });
    }
  };

  function showSpinner() {
    spinner.classList.remove('d-none');
  }

  function hideSpinner() {
    spinner.classList.add('d-none');
  }

  function clearErrorMessages() {
    errorMessages.innerText = '';
    errorMessages.classList.add('d-none');
  }

  function setErrorMessages(errors) {
    var errorContent = '';

    if (errors) {
      if (typeof errors === 'string') {
        errorContent = errors;
      }
      else if (Array.isArray(errors) && errors.length > 0) {
        if (errors.length === 1) {
          errorContent = errors[0];
        } else {
          errorContent = '<ul>';
          for (var i = 0; i < errors.length; i++) {
            errorContent += '<li>' + errors[i] + '</li>';
          }
          errorContent += '</ul>';
        }
      }
    }

    errorMessages.innerHTML = errorContent;
    errorMessages.classList.remove('d-none');
  }

})(jQuery);
