# RCV
Ranked Choice Voting in Google Forms

This project was created to provide an easy way to add and tally Ranked Choice Voting within Google Forms.

We went with the choice of using "Multiple-choice Grid" method for each race, which is complex to setup manually. 

## List of Races

Start by creating a Google Sheet with the format:

| Position   | Best Haloween Candy | Best Seahawk   | Best District in Seattle |
| ---------- | ------------------- | -------------- | ------------------------ |
| Candidates | Neco Wafers         | Warren Moon    | 11th                     |
|            | Twix                | Walter Jones   | 32nd                     |
|            | Reese PB Cups       | Cortez Kennedy | 36th                     |
|            | 100 Grand           | Russell Wilson | 37th                     |
|            | m&m's               | Marshawn Lynch | 43rd                     |
|            |                     |                | 46th                     |

Give a Tabname something descriptive for this election.  "Fall Favorites 2022"

## Create the form

Now go into Google Apps Script, create a new file and add the "CreateForm.gs" code from this repo, and run the script. 

It should create a new Google Form with the races above.

## Vote!

Send out the "Published" URL out for voting.  It should work like any other google form. Close out voting when done, and grab the data out of a spreadsheet. 

## Tally the results

Now open the results in Google sheets, and open up the Apps Script page, paste in the "ProcessResults.gs" code from this repo. Run the "ProcessResults" function.

## output

The script should tally the results and output a table of results at the bottom of the tally sheet:

In an example I ran recently for Best Haloween Candy:
| New Round! | New Round!  | New Round! | WINNER!       |
| ---------- | ----------- | ---------- | ------------- |
| Remove:    | Remove:     | Remove:    | Reese PB Cups |
| 100 Grand  | Neco Wafers | Twix       | \[22/36\]     |
|            |             |            | 61.11%        |
|            |             |            | 32.43%        |

* There was no winner for the first round, "100 Grand" had the fewest votes so it was removed.
* There was no winner for the second round, "Neco Wafers" had the fewest votes so it was removed.
* There was no winner for the third round, "Twixt" had the fewest votes so it was removed.
* In the final round "Reese PB Cups" had over 60% of the vote so it won!

Notes:

* In my example here, you MUST have 60% of the vote to win, otherwise if two remain with a 45% to 55% split, there is no winner.
* We use voting keys in our race so anyone with a key can vote (not just those with a google e-mail account ).
