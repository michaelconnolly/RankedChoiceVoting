//
// Create a "Ranked Choice Voting" Google Forms from a spreadsheet.
//

function CreateForm() {
    Logger.log('################################ Start')
    var spreadsheet = SpreadsheetApp.getActive().getActiveSheet();

    var gridValidation = FormApp.createGridValidation()
      .setHelpText("Select one item per column.")
      .requireLimitOneResponsePerColumn()
      .build();

    const TheOrder = ['First Choice', 'Second Choice', 'Third Choice', 'Fourth Choice', 'Fifth Choice', 'Sixth Choice','Seventh Choice','Eight Choice','Ninth Choice']  // limited to 9

    Logger.log('Create New Form: ' + spreadsheet.getSheetName())
    var form = FormApp.create(spreadsheet.getSheetName())
      // .setConfirmationMessage("Thanks for Voting!")
      // .setLimitOneResponsePerUser(true);  // do not use, assumes google e-mail. 

    var valVotingKey = FormApp.createTextValidation()
      .requireTextMatchesPattern("[a-f0-9]{5}")   // All keys are 5 digit numbers!
      .setHelpText(("Please enter your voting key, one per member, do not share the key with other members."))
      .build();

    var votingKey = form.addTextItem()
      .setTitle('What is your Voting Key?')
      .setRequired(true)
      .setValidation(valVotingKey);

    Logger.log('Voting Key ID: ' + votingKey.getId() ); 

    var i = 0 
    spreadsheet.getRange("B1:1").getValues()[0].filter(String).forEach( function( value ) {

        Logger.log( "New Race: " + value );
        const names = spreadsheet.getRange( String.fromCharCode( 66 + i ) + '2:' + String.fromCharCode( 66 + i ) + '15').getValues().filter(String);
      
        form.addGridItem()
          .setTitle(spreadsheet.getRange( String.fromCharCode( 66 + i ) + '1').getValue())
          .setColumns(names)
          .setRows(TheOrder.slice(0,names.length))
          .setValidation(gridValidation);
        i++;
    })

    // var resultsSheet = SpreadsheetApp.create(spreadsheel.getSheetName() + ' Results');
    // form.setDestination( FormApp.DestinationType.SPREADSHEET, resultsSheet.getId() );

    Logger.log('################################ Done')
    Logger.log('Editor URL (internal): ' + form.getEditUrl());    
    Logger.log('Published URL (public): ' + form.getPublishedUrl());
    Logger.log('PreFilled URL (for e-mail): ' + form.createResponse().withItemResponse(votingKey.createResponse('XXXXX')).toPrefilledUrl() )

}
