// Debugging helper functions
function logBug(title, val, idx = null) {
    if(!idx) {
        console.log(`${title} -> ${val}`);
    } else {
        console.log(`Loop ${idx}: ${title} -> ${val}`);
    }
}

// Imports & Configurations
const express = require('express');
const CalcError = require('./calcError'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Route Handlers
// Mean Route
app.get('/mean', (req, res, next) => {
    try{
        // store query string
        const nums = req.query.nums;
        // check if invalid query string
        // Use SC: 400 Bad Request; because we want nums to follow specific format.
        if(!nums) throw new CalcError("Nums are required", 400);
        // create array out of converted query string
        const a = nums.split(',').map((x) => Number(x));
        // loop through a finding sum of all values
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            // store current val of a
            let curr = a[i];
            // throw error if curr is not a number
            if(!curr) throw new CalcError(`${nums.split(',')[i]} is not a number.`, 400);
            // add curr to sum
            sum += curr;
        }
        // find mean with sum
        const mean = sum / a.length;
        return res.json({response : {
            operation : "mean",
            value : mean
        }});
    }
    catch(err) {
        return next(err);
    }
})

// Median Route
app.get('/median', (req, res, next) => {
    try{
        // store query string
        const nums = req.query.nums;
        // check if query contains nums
        if(!nums) throw new CalcError("Nums are required.", 400);
        // convert query string to array of numbers
        const a = nums.split(',').map((x) => Number(x)).sort();
        // check that all nums in arr are a number
        if(!a.every((x) => typeof x === 'number')) throw new CalcError("All query items should be numbers");
        // find middle of arr
        let middle = Math.floor(a.length / 2);
        // create median var
        let median = 0;
        // update median depending on there being an odd or even amount of nums
        if(a.length % 2 === 0) {
            median = (a[middle] + a[middle-1]) / 2;
        } else {
            median = a[middle];
        }
        // send JSON of median
        return res.json({response : {
            operation : "median",
            value : median
        }});
    }
    catch(err) {
        next(err);
    }
})

// Mode Route
app.get('/mode', (req, res, next) => {
    // store query string
    const nums = req.query.nums;
    // check that nums is included
    if(!nums) throw new CalcError("Nums are required.", 400);
    // remove ,
    const a = nums.split(',');
    // create number counter object
    const nCount = {};
    let mode = 0;
    // loop through arr adding frequency to number count obj
    for(let i = 0; i < a.length; i++) {
        // store current val
        let curr = Number(a[i]);
        // check that curr is a number
        if(!curr) throw new CalcError(`${a[i]} is not a number`, 400);
        // add true val to numCount obj if this is the first time num has been checked
        if(nCount[a[i]]) {
            continue;
        } else {
            nCount[a[i]] = true;
            let freq = a.filter((x) => x === a[i]).length;
            mode = mode < freq ? curr : mode;
        }
    }
    // send JSON response with mode val
    return res.json({response : {
        operation : "mode",
        value : mode
    }});
})
// Error Handlers

// G.E.H.
app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    // send err in JSON
    res.status(status).json({error : {message, status}});
})

// Establish Active Server
app.listen(3000, () => {
    logBug("At port", 3000);
})