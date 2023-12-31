//the data dump must be available on your device
//all the produced files contain an extra new line at the end, this can be fixed using a simple if statement but I am too lazy + sick of js already + didn't expect anyone to actually see this code
//just remove the line manually  

const fs = require('fs');

const dataDumpPath = "/home/basmala/Downloads/artic-api-data/json/artworks/"; //you may need to change this
const codes = fs.readFileSync('available_codes.txt', 'utf-8');//you have to run data_scraper.js first to get this file
const codearray = codes.split(/\r?\n/);
codearray.pop();//remove this line if you already removed the last line in available_codes.txt


var jsonfile;
var filename;
var jsondata;
var j = 0;

for (var i = 0; i < codearray.length; i++){
    

    try { 
        filename = dataDumpPath + codearray[i] + ".json"; 
        jsonfile = fs.readFileSync(filename, 'utf-8');
        jsondata = JSON.parse(jsonfile);


            //the tags are in an array
            for(var x = 0; x < jsondata.term_titles.length; x++){

                fs.writeFileSync('tags_id.txt',  i + "\n", {flag: 'a+'}, (err) => { //for the sql insert statement (will be formatted later)
                    if (err) { 
                    throw err; 
                    } });
                fs.writeFileSync('tags.txt', jsondata.term_titles[x] + "\n", {flag: 'a+'}, (err) => { 
                    if (err) { 
                    throw err; 
                    } });


            }


            


            


        
        
        } catch (error) { 
        console.error(error); 
        }
    
}
