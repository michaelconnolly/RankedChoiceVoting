// See https://aka.ms/new-console-template for more information
using System.Security.Cryptography;
using System.Xml.Linq;

Console.WriteLine("Generating Keys!");

// Input your blacklist.
string fileNameInput = "..\\..\\..\\..\\black-list.txt";
string[] blacklist = File.ReadAllLines(fileNameInput);
Console.WriteLine("Size of input: " + blacklist.Length);
string fileNameOutput = "..\\..\\..\\..\\output-list.txt";
StreamWriter outputFile = File.CreateText(fileNameOutput);

foreach (string blackEntry in blacklist) {

    Console.WriteLine(blackEntry);
}

//int test = 'A';
//int testValue = 65;
//char newChar = (char) testValue;
//Console.WriteLine(test);
//Console.WriteLine(newChar);

int countOfKeys = 0;
int quota = 500;
Random random = new Random();



while (countOfKeys < quota) {

    string newKey = "";
    for (int charCounter = 0; charCounter < 7; charCounter++) {

        int newValue = random.Next(26);
        char newChar = (char) (newValue + 65);
        //Console.WriteLine(value + " - " + newChar);
        newKey += newChar;
    }

    // Throw out the key if we already used it.
    bool isUnique = true;
    foreach (string blackEntry in blacklist) {

        if (newKey == blackEntry) {
            Console.WriteLine("WARNING: Not unique, throwing out " + newKey);
            isUnique = false;
            break;
        }
    }
    if (isUnique) {
        Console.WriteLine(newKey);
        outputFile.WriteLine(newKey);
        countOfKeys++;
    }
}

outputFile.Flush();
outputFile.Close();


// Feature idea: we should create a new file called "blacklist-new", which is the suggested new blacklist.
// 1) write out all the original blacklist.
// 2) write out all the new keys generated. 



