from brownie import OnchainPlace

class deploy:
    def onchainplace(deployer):
        contract = OnchainPlace.deploy({"from": deployer})
        print(contract.address)
        return contract