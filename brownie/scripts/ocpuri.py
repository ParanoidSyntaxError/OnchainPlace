from brownie import accounts
from scripts.deploy import deploy
from scripts.ocp_values import ocp_values

def main():
    ocpDeployer = accounts[0]
    user = accounts[1]

    onchainplace = deploy.onchainplace(ocpDeployer)

    onchainplace.setPixel(0, 11, {"from": user})
    onchainplace.setPixel(1, 7, {"from": user})

    onchainplace.mint(0, {"from": user, "value": ocp_values.MINT_FEE})

    print(onchainplace.tokenURI(0))