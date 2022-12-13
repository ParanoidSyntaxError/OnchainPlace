async function getLatestPixels(lower) {  
    lower = parseInt(lower);

    const query = `query response($lower:Int) {
        pixels(orderBy:totalChanges where:{totalChanges_gt:$lower}) {
            position
            color
            totalChanges
        }
    }`;

    let pixels;

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
        pixels = responseJson["data"]["pixels"];
    });

    return pixels;
}

async function getPlace() {
    var placeJson;

    await fetch('https://onchainplace.fra1.cdn.digitaloceanspaces.com/place.json', {
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

async function getMint(id) {
    var mintJson;

    await fetch('https://onchainplace.fra1.cdn.digitaloceanspaces.com/mints/place_' + id + '.json', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
    .then(response => response.json())
    .then(responseJson => {
        mintJson = responseJson;
    });

    return mintJson;
}

async function totalMints() {
    const query = `query {
        tokens(orderBy:totalChanges orderDirection:desc first:1) {
            id
            owner
            totalChanges
        }
    }`;

    let total;

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
        total = responseJson["data"]["tokens"][0]["id"];
    });

    return parseInt(total) + 1;
}

async function ownedMints(owner) {
    const query = `query response($owner:Bytes) {
        tokens(where:{owner:$owner}) {
            id
            totalChanges
        }
    }`;

    let mints;

    await fetch('https://api.thegraph.com/subgraphs/name/paranoidsyntaxerror/onchain-place', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { owner }
        })
    })
    .then(response => response.json())
    .then(responseJson => {
        mints = responseJson["data"]["tokens"];
    });

    return mints;
}