from brownie import accounts, reverts
from scripts.deploy import deploy
from scripts.ocp_constants import ocp_constants
import random

def test_set_pixel():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    for i in range(0, 100):
        onchainplace.setPixel(random.randint(0, ocp_constants.MAX_POSITION), random.randint(0, ocp_constants.MAX_COLOR), {"from": user})

    onchainplace.setPixel(0, 0, {"from": user})
    onchainplace.setPixel(ocp_constants.MAX_POSITION, ocp_constants.MAX_COLOR, {"from": user})
    onchainplace.setPixel(ocp_constants.MAX_POSITION, 0, {"from": user})
    onchainplace.setPixel(0, ocp_constants.MAX_COLOR, {"from": user})

    with reverts():
        onchainplace.setPixel(ocp_constants.MAX_POSITION + 1, 0, {"from": user})
        onchainplace.setPixel(0, ocp_constants.MAX_COLOR + 1, {"from": user})

def test_mint():
    ocpDeployer = accounts[0]
    user = accounts[1]

    accounts[2].transfer(user, "99 ether")

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedSupply = 100

    for i in range(0, expectedSupply):
        onchainplace.mint(0, {"from": user, "value": ocp_constants.MINT_FEE})
        onchainplace.setPixel(random.randint(0, ocp_constants.MAX_POSITION), random.randint(0, ocp_constants.MAX_COLOR), {"from": user})

def test_mint_fee():
    ocpDeployer = accounts[0]

    onchainplace = deploy.onchainplace(ocpDeployer)

    assert onchainplace.mintFee() == ocp_constants.MINT_FEE

def test_total_supply():
    ocpDeployer = accounts[0]
    user = accounts[1]

    accounts[3].transfer(user, "99 ether")

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedSupply = random.randint(1, 100)

    for i in range(0, expectedSupply):
        onchainplace.setPixel(random.randint(0, ocp_constants.MAX_POSITION), random.randint(0, ocp_constants.MAX_COLOR), {"from": user})
        onchainplace.mint(0, {"from": user, "value": ocp_constants.MINT_FEE})

    assert onchainplace.totalSupply() == expectedSupply

def test_total_changes():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedChanges = random.randint(1, 100)

    for i in range(0, expectedChanges):
        onchainplace.setPixel(random.randint(0, ocp_constants.MAX_POSITION), random.randint(0, ocp_constants.MAX_COLOR), {"from": user})

    assert onchainplace.totalChanges() == expectedChanges

def test_withdraw():
    ocpDeployer = accounts[0]
    user = accounts[1]
    
    accounts[4].transfer(user, "99 ether")

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedSupply = 100

    for i in range(0, expectedSupply):
        onchainplace.setPixel(random.randint(0, ocp_constants.MAX_POSITION), random.randint(0, ocp_constants.MAX_COLOR), {"from": user})
        onchainplace.mint(0, {"from": user, "value": ocp_constants.MINT_FEE})

    startBalance = ocpDeployer.balance()

    tx = onchainplace.withdraw("0x0000000000000000000000000000000000000000", {"from": ocpDeployer})

    assert ocpDeployer.balance() == (startBalance + (ocp_constants.MINT_FEE * expectedSupply)) - (tx.gas_used * tx.gas_price)    