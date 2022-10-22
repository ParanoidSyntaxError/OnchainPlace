from brownie import accounts, reverts
from scripts.deploy import deploy
from scripts.ocp_values import ocp_values
import random

def test_set_pixel():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    for i in range(1, 10):
        onchainplace.setPixel(random.randint(0, ocp_values.MAX_POSITION), random.randint(0, ocp_values.MAX_COLOR), {"from": user})

    onchainplace.setPixel(0, 0, {"from": user})
    onchainplace.setPixel(ocp_values.MAX_POSITION, ocp_values.MAX_COLOR, {"from": user})
    onchainplace.setPixel(ocp_values.MAX_POSITION, 0, {"from": user})
    onchainplace.setPixel(0, ocp_values.MAX_COLOR, {"from": user})

    with reverts():
        onchainplace.setPixel(ocp_values.MAX_POSITION + 1, 0, {"from": user})
        onchainplace.setPixel(0, ocp_values.MAX_COLOR + 1, {"from": user})

def test_mint():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    onchainplace.mint(0, {"from": user, "value": ocp_values.MINT_FEE})

def test_mint_offset():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    onchainplace.mint(100, {"from": user, "value": ocp_values.MINT_FEE})

def test_total_supply():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedSupply = random.randint(1, 10)

    for i in range(0, expectedSupply):
        onchainplace.setPixel(random.randint(0, ocp_values.MAX_POSITION), random.randint(0, ocp_values.MAX_COLOR), {"from": user})
        onchainplace.mint(0, {"from": user, "value": ocp_values.MINT_FEE})

    assert onchainplace.totalSupply() == expectedSupply

def test_total_changes():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedChanges = random.randint(1, 10)

    for i in range(0, expectedChanges):
        onchainplace.setPixel(random.randint(0, ocp_values.MAX_POSITION), random.randint(0, ocp_values.MAX_COLOR), {"from": user})

    assert onchainplace.totalChanges() == expectedChanges

def test_mint_fee():
    ocpDeployer = accounts[0]

    onchainplace = deploy.onchainplace(ocpDeployer)

    assert onchainplace.mintFee() == ocp_values.MINT_FEE

def test_token_uri():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    onchainplace.setPixel(0, 11, {"from": user})
    onchainplace.setPixel(1, 7, {"from": user})

    onchainplace.mint(0, {"from": user, "value": ocp_values.MINT_FEE})

    onchainplace.tokenURI(0)
    