import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

function setChatAt(str, index, chr) {
    return str.substring(0, index) + chr + str.substring(index + 1);
}

buildPlace();

async function buildPlace() {
    var placeJson = await getPlaceFile();

    console.log(new Date().toLocaleString() + " | building json...");

    for(let p = 0; p < 200; p++) {
        var promises = [];

        for(let i = 0; i < 50; i++) {
            let lower = (p * 5000) + (i * 100);
            let upper = lower + 100;

            promises.push(queryLatestPixels(lower, upper));
        }

        const responses = await Promise.all(promises);

        for(let r = 0; r < responses.length; r++) {
            for(let i = 0; i < responses[r].length; i++) {
                var position = parseInt(responses[r][i]["position"]);
                var color = parseInt(responses[r][i]["color"]).toString(16);
                placeJson["place"] = setChatAt(placeJson["place"], position, color);
            }
        }
    }

    const lastPixel = await queryLastPixel();

    placeJson["totalChanges"] = lastPixel[0]["totalChanges"];

    console.log(new Date().toLocaleString() + " | json built!");

    updatePlace(placeJson);
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

async function queryLatestPixels(lower, upper) {
    const query = `query response($lower:BigInt $upper:BigInt) {
        pixels(orderBy:position where:{position_gte:$lower position_lt:$upper}) {
            position
            color
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
            variables: { lower, upper }
        })
    })
    .then(response => response.json())
    .then(responseJson => {
        queryResponse = responseJson["data"]["pixels"];
    });

    return queryResponse;
}

async function queryLastPixel() {
    const query = `{ changes(first:1 orderBy:totalChanges orderDirection:desc) {
        totalChanges
    }}`;

    var queryResponse;

    await fetch('https://api.thegraph.com/subgraphs/name/paranoidsyntaxerror/onchain-place', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query
        })
    })
    .then(response => response.json())
    .then(responseJson => {
        queryResponse = responseJson["data"]["changes"];
    });

    return queryResponse;
}