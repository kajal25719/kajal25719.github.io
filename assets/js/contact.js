$(document).ready(function() {
  // Function to handle file selection and encoding
  function handleFileSelect(evt) {
    const files = evt.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();
      reader.trigger = this.id;
      reader.filename = file.name;

      reader.onload = function(readerEvt) {
        const binaryString = readerEvt.target.result;

        if (this.trigger === 'cover-letter') {
          $('.js-cover-letter__textarea').val(this.filename + ':' + btoa(binaryString));
        } else if (this.trigger === 'cv') {
          $('.js-cv__textarea').val(this.filename + ':' + btoa(binaryString));
        }

        swapIcon(this.trigger);
      };

      if (file.size > 2000000) { // 2MB limit
        alert('File too large. Please select a file under 2MB.');
        $(this).val(null);
      } else if (!(/\.(doc|docx|pdf|csv|xlsx)$/i).test(file.name)) {
        alert('Filetype not allowed. Please use .doc, .docx, .pdf, .csv, or .xlsx only.');
        $(this).val(null);
      } else {
        reader.readAsBinaryString(file);
      }
    }
  }

  if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('photo').addEventListener('change', handleFileSelect, false);
    document.getElementById('document').addEventListener('change', handleFileSelect, false);
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }

  // Function to swap icon
  function swapIcon(id) {
    $('label[for="' + id + '"]').css({"background-color": "#006699"})
      .children('i.fa')
      .removeClass('fa-upload')
      .addClass('fa-check-square-o');
  }

  // Initialize EmailJS
  emailjs.init('kkajalkhan71@gmail.com'); // Replace with your EmailJS user ID

  // Form submission handler
  function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);

    // Prepare email parameters
    const templateParams = {
      from_name: formData.get('full_name'),
      phone_number: formData.get('phone_number'),
      email: formData.get('email'),
      address: formData.get('address'),
      message: formData.get('message'),
      document: formData.get('document'),
      photo: formData.get('photo')
    };

    emailjs.send('service_thtolf4', 'template_xo1l3vr', templateParams)
      .then(function(response) {
        console.log('Email sent successfully:', response);
        alert('Email sent successfully!');
      })
      .catch(function(error) {
        console.error('Error sending email:', error);
      });
  }

  // Attach form submit handler
  $('form.app__form').on('submit', submitForm);
});