/* ROUTING
 * -------------------------------------------------------------------------------------------------------------------------------------- */
Meteor.Router.add({
  '/': 'send',
  '/me': 'me',
  '/about': 'about',
  '*': '404'
});

/* TEMPLATE: send
 * -------------------------------------------------------------------------------------------------------------------------------------- */
Template.send.events({
    'change .pick input': function(e) {
        recalculate();
    },
    'click .pick li': function(e) {
        var target = $(e.currentTarget);
        if (target.parent().is('.multiple')) {
            if (target.is('.selected'))
                target.removeClass('selected');
            else
                target.addClass('selected');
        } else {
            target.parent().children().removeClass('selected');
            target.addClass('selected');
        }

        recalculate();
    },
    'click .note': function(e) {
        var target = $(e.currentTarget);
        target.find('textarea').focus();
    },
    'focus .note': function(e) {
        var target = $(e.currentTarget);
        if (!target.is('.active'))
            target.addClass('active');
    },
    'blur .note': function(e) {
        var target = $(e.currentTarget);
        if (!target.find('textarea').val().length)
            target.removeClass('active');
    },
    'change .note textarea': function(e) {
        var target = $(e.currentTarget);
        if (!target.find('textarea').val().length && !$('.note').is(":focus"))
            target.removeClass('active');
    },
});
Template.send.rendered = function() {
    recalculate();
}

/* FUNCTIONS
 * -------------------------------------------------------------------------------------------------------------------------------------- */
function recalculate() {
    // Donation
    var donationAmount = $('#send-give').find('.donation .selected .amount');
    var donation;
    if (donationAmount.find('input').length)
        donation = parseFloat(donationAmount.find('input').val());
    else
        donation = parseFloat(donationAmount.text());

    // Multiplier
    var totalRecipients = $('#send-recipient').find('.people .person.selected').length;
    $('#send-recipient').find('.for-each .amount').text(totalRecipients);
    $('#send-recipient').find('.for-all .amount').text(Math.min(1, totalRecipients));
    var multiplier = parseFloat($('#send-recipient').find('.distribution .selected .amount').text());

    // Distribution
    var donatedAmount = donation * multiplier;
    var totalPercent = 0, peopleAmount = 0, people = [];
    $('#send-recipient').find('.people .selected').each(function() {
        totalPercent += parseFloat($(this).find('.allocation input').val());
    });
    $('#send-recipient').find('.people .person.selected').each(function() {
        var percent = parseFloat($(this).find('.allocation input').val());
        var amount = Math.floor(donatedAmount * percent / totalPercent);
        peopleAmount += amount;
        people.push($(this).find('.title').text());

        $(this).find('.amount').text(amount);
    });
    $('#send-recipient').find('.people .site .amount').text(donatedAmount - peopleAmount);

    // Summary
    var peopleString = "";
    for (var i = 0; i < people.length; ++i)
        if (i == 0)
            peopleString += people[i];
        else if (i != people.length - 1)
            peopleString += ', ' + people[i];
        else
            peopleString += ' and ' + people[i];
    if (!peopleString.length)
        peopleString = 'nobody yet';
    var thanksString = "people";
    if (people.length > 0 && people.length < 5)
        thanksString = peopleString;
    $('#send').find('.amount').text(donatedAmount);
    $('#send').find('.people').text(peopleString);
    $('#send').find('.thanks-people').text(thanksString);
    $('#send').find('button').prop('disabled', people.length == 0);
}
