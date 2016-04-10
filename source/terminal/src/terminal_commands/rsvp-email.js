(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPEmailCommandHandler = {};

                RSVPEmailCommandHandler.command = 'RSVPEmail';
                RSVPEmailCommandHandler.description = ['RSVP Email Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPEmailCommandHandler.parentCommand = ['RSVPEmail', 'RSVPAuth', 'RSVPAuthFailed'];

                RSVPEmailCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        if(isSuccessful === "false"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPRevisit',
                                    'outText' : "You have already RSVP'd. Would you like to view/edit your RSVP?."
                                }
                            );
                        }
                        else if (isSuccessful === "true") {
                            deferred.resolve(
                            {
                                'childHandler' : 'RSVPName',
                                'outText' : '\n  You have now begun the RSVP process.\n' +
                                '  You will be able to RSVP all the guest coming with you, ' +
                                'but to begin with I need to ask you a few questions.\n\n' +
                                '  First, please re-enter your email.'
                            });
                        }
                        else if(isSuccessful === "continue"){
                            deferred.resolve(
                            {
                                'childHandler' : 'RSVPName',
                                'outText' : '\n  You did not complete your RSVP process the first time through.\n\n' +
                                '  You will have to start again from the begining of the RSVP process.\n' +
                                '  You will be able to RSVP all the guest coming with you, ' +
                                'but to begin with I need to ask you a few questions.\n\n' +
                                '  First, please re-enter your email.'
                            });
                        }
                        else {
                            deferred.resolve(
                            {
                                'childHandler' : '',
                                'outText' : 'Error.'
                            });
                        }

                      return deferred.promise;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("Please re-enter your email for verification purposes.\n\n  "+
                            "If you do not complete the RSVP process you will need to start from the beginning again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPEmail');

                        return deferred.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.   You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else{

                        return fakeHttpCall(cmd).then(
                            function (data) {
                                var deferred = q.defer();
                                // success callback
                                outText.push(data['outText']);
                                session.output.push({ output: true, text: outText, breakLine: true });
                                deferred.resolve(data['childHandler']);

                            return deferred.promise;
                        },
                        function (err) {
                            // error callback
                            console.log(err);
                        });
                    }

                };

                $commandBrokerProvider.appendChildCommandHandler(RSVPEmailCommandHandler);
            }]);
        };
    });
}(window));