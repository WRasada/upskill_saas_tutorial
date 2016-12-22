//Document Ready.
$(document).on('turbolinks:load', function(){
	var theForm = $('#pro_form');
	var submitBtn = $('#form-signup-btn');

	//Set Stripe public key.
	Stripe.setPublishableKey( $('meta[name="stripe-key"]'.attr('content') );

	//When user clicks form submit button.
	submitBtn.click(function(event){
		//prevent default submission behavior.
		event.preventDefault();
		submitBtn.val("Processing").prop('disabled', true);

		//Collect the credit card fields.
		var ccNum = $('#card_number').val(),
				cvcNum = $('#card_code').val(),
				expMonth = $('#card_month').val(),
				expYear = $('#card_year').val();

		// Use Stripe JS Library to check for card errors
		var error = false;

		// Validate card number.
		if(!Stripe.card.validateCardNumber(ccNum)) {
			error = true;
			alert('The credit card number appears to be invalid');
		}

		if(!Stripe.card.validateCVCNumber(cvcNum)) {
			error = true;
			alert('The CVC number appears to be invalid');
		}

		if(!Stripe.card.validateExpiry(expMonth, expYear)) {
			error = true;
			alert('The expiration date appears to be invalid');
		}

		if (error) {
			// If there are card errors, don't send to Stripe
			submitBtn.prop('disabled', false).val("Sign Up");
		} else {
			//Send the card info to Stripe.
		Stripe.createToken({
			number: ccNum,
			cvc: cvcNum,
			exp_month: expMonth,
			exp_year: expYear
		}, stripeReponseHandler);

		}


		return false;
	});

	//Stripe will return a card token.
	function stripeResponseHandler(status, response) {
		// Get the token from the response.
		var token = response.id;

		// Inject the card token in a hidden field.
		theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );

		//Submit form to our Rails app.
		theForm.get(0).submit();
	}
});