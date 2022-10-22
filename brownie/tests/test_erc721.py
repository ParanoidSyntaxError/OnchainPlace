from brownie import accounts
from scripts.deploy import deploy
from scripts.ocp_values import ocp_values
import random

def test_balance_of():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedBalance = random.randint(1, 10)

    for i in range(0, expectedBalance):
        onchainplace.setPixel(random.randint(0, ocp_values.MAX_POSITION), random.randint(0, ocp_values.MAX_COLOR), {"from": user})
        onchainplace.mint(0, {"from": user, "value": ocp_values.MINT_FEE})

    assert onchainplace.balanceOf(user) == expectedBalance

def test_owner_of():
    ocpDeployer = accounts[0]

    onchainplace = deploy.onchainplace(ocpDeployer)

    expectedOwner = accounts[random.randint(1, 9)]

    onchainplace.mint(0, {"from": expectedOwner, "value": ocp_values.MINT_FEE})

    assert onchainplace.ownerOf(0) == expectedOwner