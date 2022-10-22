import fetch from "node-fetch";
import dotenv from "dotenv";
import mysql from "mysql";
import scheduler from "node-schedule";
import util from "util";

dotenv.config();

var scheduleLock = false;

scheduler.scheduleJob('* * * * * *', async function() {
    if(scheduleLock == false) {
        scheduleLock = true;

        await checkDatabase();

        scheduleLock = false;
    }
});

var sqlConnection = mysql.createConnection({
    host: "localhost",
    user: "viewer",
    password: process.env.SQL_PASSWORD,
    database: "onchainplace",
    charset: 'utf8mb4'
});

sqlConnection.connect();

async function checkDatabase() {   
    const query = util.promisify(sqlConnection.query).bind(sqlConnection);

    var rowCountResponse = await query("SELECT COUNT(*) FROM changes");
    var rowCount = JSON.parse(JSON.stringify(rowCountResponse))[0]["COUNT(*)"];

    const pixels = await queryPixels(rowCount);

    if(pixels.length > 0) {
        updateDatabase(pixels);

        console.log(new Date().toLocaleString() + " | database updated! total changes: " + (rowCount + pixels.length));
    }
}

function updateDatabase(pixels) {
    for(let i = 0; i < pixels.length; i++) {
        const sqlQuery = 'INSERT INTO changes (position, color, author, totalchanges) VALUES (' + 
        parseInt(pixels[i]["position"]) + ',' + 
        parseInt(pixels[i]["color"]) + ',"' + 
        pixels[i]["author"].toString() + '",' + 
        parseInt(pixels[i]["totalChanges"]) + ')';

        sqlConnection.query(sqlQuery, function (err, result) {
            if (err) throw err;
        });
    }
}

async function queryPixels(lower) {
    lower = parseInt(lower);

    const query = `query response($lower:Int) {
        changes(orderBy:totalChanges where:{totalChanges_gt:$lower}) {
            author
            position
            color
            totalChanges
        }
    }`;

    var queryResponse;

    await fetch('https://api.thegraph.com/subgraphs/name/paranoidsyntaxerror/onchain-place', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { lower },
        })
    })
    .then(response => response.json())
    .then(responseJson => {
        queryResponse = responseJson["data"]["changes"];
    });

    return queryResponse;
}