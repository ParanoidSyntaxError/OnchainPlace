from brownie import OnchainPlace, Parser

class deploy:
    def onchainplace(deployer):
        Parser.deploy({"from": deployer})
        contract = OnchainPlace.deploy({"from": deployer})
        print(contract.address)
        return contract