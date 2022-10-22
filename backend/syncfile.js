import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fetch from "node-fetch";
import dotenv from "dotenv";
import scheduler from "node-schedule";

dotenv.config();

function setChatAt(str, index, chr) {
    return str.substring(0, index) + chr + str.substring(index + 1);
}

var scheduleLock = false;

scheduler.scheduleJob('*/1 * * * * *', async function() {
    if(scheduleLock == false) {
        scheduleLock = true;

        await checkFile();

        scheduleLock = false;
    }
});

async function checkFile() {
    var placeJson = await getPlaceFile();
    const startTotalChanges = placeJson["totalChanges"];

    for(let i = 0; i < 10; i++) {
        const latestPixels = await queryLatestPixels(placeJson["totalChanges"]);

        if(latestPixels.length == 0) {
            break;
        } 

        for(let i = 0; i < latestPixels.length; i++) {
            var position = parseInt(latestPixels[i]["position"]);
            var color = parseInt(latestPixels[i]["color"]).toString(16);
            placeJson["place"] = setChatAt(placeJson["place"], position, color);
        }
    
        placeJson["totalChanges"] = latestPixels[latestPixels.length - 1]["totalChanges"];
    }

    if(startTotalChanges != placeJson["totalChanges"]) {
        await updatePlace(placeJson);
    }
}

async function updatePlace(placeJson) {
    const s3Client = new S3Client({
        endpoint: "https://fra1.digitaloceanspaces.com",
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.KEY_ID,
          secretAccessKey: process.env.SECERT_KEY
        }
    });

    const params = {
        Bucket: "onchainplace",
        Key: "place.json",
        Body: JSON.stringify(placeJson),
        ACL: "public-read",
        ContentType: "application/json"  
    };

    await s3Client.send(new PutObjectCommand(params));

    console.log(new Date().toLocaleString() + " | file updated! total changes: " + placeJson["totalChanges"].toString());
}

async function getPlaceFile() {
    var placeJson;
    
    await fetch('https://onchainplace.fra1.digitaloceanspaces.com/place.json', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseJson => {
        placeJson = responseJson;
    });

    return placeJson;
}

async function queryLatestPixels(lower) {
    lower = parseInt(lower);

    const query = `query response($lower:Int) {
        pixels(orderBy:totalChanges where:{totalChanges_gt:$lower}) {
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
            variables: { lower }
        })
    })
    .then(response => response.json())
    .then(responseJson => {
        queryResponse = responseJson["data"]["pixels"];
    });

    return queryResponse;
}