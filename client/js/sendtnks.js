$(document).ready(function() {
    function recalculate() {
        // Donation
        var donationAmount = $('#give').find('.donation .selected .amount');
        var donation;
        if (donationAmount.find('input').length)
            donation = parseFloat(donationAmount.find('input').val());
        else
            donation = parseFloat(donationAmount.text());

        // Multiplier
        var totalRecipients = $('#recipient').find('.people .person.selected').length;
        $('#recipient').find('.for-each .amount').text(totalRecipients);
        $('#recipient').find('.for-all .amount').text(Math.min(1, totalRecipients));
        var multiplier = parseFloat($('#recipient').find('.distribution .selected .amount').text());

        // Distribution
        var donatedAmount = donation * multiplier;
        var totalPercent = 0, peopleAmount = 0, people = [];
        $('#recipient').find('.people .selected').each(function() {
            totalPercent += parseFloat($(this).find('.allocation input').val());
        });
        $('#recipient').find('.people .person.selected').each(function() {
            var percent = parseFloat($(this).find('.allocation input').val());
            var amount = Math.floor(donatedAmount * percent / totalPercent);
            peopleAmount += amount;
            people.push($(this).find('.title').text());

            $(this).find('.amount').text(amount);
        });
        $('#recipient').find('.people .site .amount').text(donatedAmount - peopleAmount);

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

    $('.pick input').change(function() {
        recalculate();
    });
    $('.pick li').click(function() {
        if ($(this).parent().is('.multiple')) {
            if ($(this).is('.selected'))
                $(this).removeClass('selected');
            else
                $(this).addClass('selected');
        } else {
            $(this).parent().children().removeClass('selected');
            $(this).addClass('selected');
        }

        recalculate();
    });
    $('.note').click(function() {
        $(this).find('textarea').focus();
    });
    $('.note').focusin(function() {
        if (!$(this).is('.active'))
            $(this).addClass('active');
    });
    $('.note').focusout(function() {
        if (!$(this).find('textarea').val().length)
            $(this).removeClass('active');
    });
    $('.note textarea').change(function() {
        if (!$(this).find('textarea').val().length && !$('.note').is(":focus"))
            $(this).removeClass('active');
    });
    recalculate();
});
