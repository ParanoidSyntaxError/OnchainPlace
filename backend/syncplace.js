import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fetch from "node-fetch";
import dotenv from "dotenv";
import scheduler from "node-schedule";

dotenv.config();

const s3Client = new S3Client({
    endpoint: "https://fra1.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.SECERT_KEY
    }
});

let scheduleLock = false;

scheduler.scheduleJob('* * * * * *', async function() {
    if(scheduleLock == false) {
        scheduleLock = true;

        try {
            await checkPlace();
        } catch(e) {
            console.log(new Date().toLocaleString() + " | sync place ERROR! " + e.toString());
        }

        scheduleLock = false;
    }
});

function setChatAt(str, index, chr) {
    return str.substring(0, index) + chr + str.substring(index + 1);
}

async function checkPlace() {
    let place = await getPlace();
    const startTotalChanges = place["totalChanges"];

    for(let i = 0; i < 10; i++) {
        const latestPixels = await queryLatestPixels(place["totalChanges"]);

        if(latestPixels.length == 0) {
            break;
        } 

        for(let i = 0; i < latestPixels.length; i++) {
            let position = parseInt(latestPixels[i]["position"]);
            let color = parseInt(latestPixels[i]["color"]).toString(16);
            place["place"] = setChatAt(place["place"], position, color);
        }
    
        place["totalChanges"] = latestPixels[latestPixels.length - 1]["totalChanges"];
    }

    if(startTotalChanges != place["totalChanges"]) {
        await updatePlace(place);
    }
}

async function updatePlace(place) {
    const params = {
        Bucket: "onchainplace",
        Key: "place.json",
        Body: JSON.stringify(place),
        ACL: "public-read",
        ContentType: "application/json"  
    };

    await s3Client.send(new PutObjectCommand(params));

    console.log(new Date().toLocaleString() + " | place updated! total changes: " + place["totalChanges"].toString());
}

async function getPlace() {
    let place;
    
    await fetch('https://onchainplace.fra1.digitaloceanspaces.com/place.json', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseJson => {
        place = responseJson;
    });

    return place;
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

    let queryResponse;

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