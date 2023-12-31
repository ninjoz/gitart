//the data dump must be available on your device
//all the produced files contain an extra new line at the end, this can be fixed using a simple if statement but I am too lazy + sick of js already + didn't expect anyone to actually see this code
//just remove the new line manually  
const fs = require('fs');

const dataDumpPath = "/home/basmala/Downloads/artic-api-data/json/artworks/"; //you may need to change this
const codes = fs.readFileSync('codes.txt', 'utf-8');//these codes are the artworks ids, which are the names of the files in the artworks folder, I used a command to get the names of all the files in that folder. 
const codearray = codes.split(/\r?\n/);

var jsonfile;
var filename;
var jsondata;
var j = 0;

for (var i = 0; i < codearray.length; i++){
    

    try { 
        filename = dataDumpPath + codearray[i] + ".json";
        jsonfile = fs.readFileSync(filename, 'utf-8');
        jsondata = JSON.parse(jsonfile);


        if(jsondata.image_id != null && jsondata.title != "Untitled"){// we're only interested in artworks that have an image and a title
            j++;


            fs.writeFileSync('available_codes.txt', codearray[i] + "\n", {flag: 'a+'}, (err) => { 
                if (err) { 
                throw err; 
                } });


            fs.writeFileSync('image_codes.txt', jsondata.image_id + "\n", {flag: 'a+'}, (err) => { 
                    if (err) { 
                    throw err; 
                    } });

            fs.writeFileSync('titles.txt', jsondata.title + "\n", {flag: 'a+'}, (err) => { 
                        if (err) { 
                        throw err; 
                        } });
             
            
            if(jsondata.description != null){//the description in the data dump already contained an \n if it is not null
            fs.writeFileSync('descriptions.txt', jsondata.description, {flag: 'a+'}, (err) => { 
                            if (err) { 
                            throw err; 
                            } });


                        }else {
                            fs.writeFileSync('descriptions.txt', jsondata.description + "\n", {flag: 'a+'}, (err) => { 
                                if (err) { 
                                throw err; 
                                } });



                        }

        }
        
        
        } catch (error) { 
        console.error(error); 

        
        }
    
}


console.log("Available designs: " + j);

