//
// Tally the "Ranked Choice Voting" Google Forms from a spreadsheet.
//

function TallyResults() {

    Logger.log('################################ Start')
    var spreadsheet = SpreadsheetApp.getActive().getActiveSheet();

    Logger.log('Process New Results: ' + spreadsheet.getSheetName())
    if ( spreadsheet.getRange('A1').getValue() != 'Timestamp' ) { throw('ERROR!!!   Not results sheet'); }

    // Get the number of votes
    var maxvotes = 0;
    spreadsheet.getRange("A2:A").getValues().filter(String).forEach( function( value, index ) { maxvotes = index + 1; } )
    Logger.log( "Total Votes: " + maxvotes );

    // Get a range for each race
    var race_data = {};
    var start_column;
    spreadsheet.getRange("C1:1").getValues()[0].filter(String).forEach( function( value, index ) { 
      var race = value.toString().split('[')[0].trim();
      if ( race_data[race] == null) {
        start_column = index + 1
        race_data[race] = String.fromCharCode( 66 + start_column ) + '2';
      }
      else {
        race_data[race] = String.fromCharCode( 66 + start_column ) + '2' + ':' + String.fromCharCode( 66 + index + 1) + (maxvotes + 1).toString();
      }      
    });

    // TODO: Remove Dupes..
    // Process each race...    
    for ( var k in race_data ) {
      Logger.log( k + ' = ' + race_data[k]);

      var candidates = {}
      spreadsheet.getRange( race_data[k] ).getValues().filter(String).forEach( function ( value ) {
        value.forEach( function ( value ) { if ( value != '') { candidates[value] = []; } } )
      } )

      spreadsheet.getRange( race_data[k] ).getValues().filter(String).forEach( function ( value ) {
        if ( value[0] != '') { candidates[value[0]].push(value) }
      } )

      ProcessVotingRound ( spreadsheet, candidates, maxvotes, spreadsheet.getRange( race_data[k] ).getColumn() )
    }

    Logger.log('################################ Done');
}

function ProcessVotingRound( spreadsheet, candidates, maxvotes, OutputColumn ) {

  // First pass:
  var winner = 0;
  var looser = 30000;
  var winnerName;
  var looserName;
  for ( var c in candidates ) { 
    Logger.log( c + ' =  ' + candidates[c].length  ); 
    if ( winner < candidates[c].length ) { 
      winner = candidates[c].length; winnerName = c 
    }
    if ( looser > candidates[c].length ) { 
      looser = candidates[c].length; looserName = c 
    }
  }

  Logger.log("Candidates Remaining: " + Object.keys(candidates).length);
  OutCol = String.fromCharCode( 64 + OutputColumn );
  if ( (winner / maxvotes) > 0.6 ) { 
    Logger.log( "[' + outputcell + '] Winner: " + winnerName + '['+ winner + '/' + maxvotes + '] ' + (winner / maxvotes * 100) + '%' );
    spreadsheet.getRange( OutCol + (maxvotes + 4) ).setValue("WINNER!" ); 
    spreadsheet.getRange( OutCol + (maxvotes + 5) ).setValue(winnerName); 
    spreadsheet.getRange( OutCol + (maxvotes + 6) ).setValue('['+ winner + '/' + maxvotes + ']'); 
    spreadsheet.getRange( OutCol + (maxvotes + 7) ).setValue((winner / maxvotes * 100) + '%' ); 
  }
  // missing two remaining...
  else if ( Object.keys(candidates).length == 2 ) {
    Logger.log( '#################### TIE' );
    spreadsheet.getRange( OutCol + (maxvotes + 4) ).setValue("NO WINNER!" ); 
    var i = 0;
    for ( var c in candidates ) { 
      var n = candidates[c].length
      spreadsheet.getRange( OutCol + (maxvotes + 5 + i++) ).setValue(  c + ': ['+ n + '/' + maxvotes + ']'); 
      spreadsheet.getRange( OutCol + (maxvotes + 5 + i++) ).setValue( (n / maxvotes * 100) + '%' ); 
    }
  }
  else {
    Logger.log ( "Looser: " + looserName );
    spreadsheet.getRange( OutCol + (maxvotes + 4) ).setValue("New Round!"); 
    spreadsheet.getRange( OutCol + (maxvotes + 5) ).setValue("Remove:"); 
    spreadsheet.getRange( OutCol + (maxvotes + 6) ).setValue(looserName); 

    for ( var i = 0; i < candidates[looserName].length; i++ ) {
      for ( var j = 1; (candidates[looserName][i].slice(j) != null) && (candidates[looserName][i].slice(j).length > 0) ; j++ ) {
        var NewHome = candidates[looserName][i].slice(j)
        Logger.log( 'find a new home: ' + NewHome );
        if (candidates[NewHome[0]] != null ) {
          candidates[NewHome[0]].push(NewHome)
          break
        }
      }
    }
    delete candidates[looserName];

    ProcessVotingRound ( spreadsheet, candidates, maxvotes, OutputColumn + 1);

  }

}
