import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  Mint,
  PixelSet,
  Transfer
} from "../generated/Contract/Contract"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createMintEvent(owner: Address, id: BigInt): Mint {
  let mintEvent = changetype<Mint>(newMockEvent())

  mintEvent.parameters = new Array()

  mintEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  mintEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return mintEvent
}

export function createPixelSetEvent(
  author: Address,
  chunk: BigInt,
  position: BigInt,
  color: string,
  totalChanges: BigInt
): PixelSet {
  let pixelSetEvent = changetype<PixelSet>(newMockEvent())

  pixelSetEvent.parameters = new Array()

  pixelSetEvent.parameters.push(
    new ethereum.EventParam("author", ethereum.Value.fromAddress(author))
  )
  pixelSetEvent.parameters.push(
    new ethereum.EventParam("chunk", ethereum.Value.fromUnsignedBigInt(chunk))
  )
  pixelSetEvent.parameters.push(
    new ethereum.EventParam(
      "position",
      ethereum.Value.fromUnsignedBigInt(position)
    )
  )
  pixelSetEvent.parameters.push(
    new ethereum.EventParam("color", ethereum.Value.fromString(color))
  )
  pixelSetEvent.parameters.push(
    new ethereum.EventParam(
      "totalChanges",
      ethereum.Value.fromUnsignedBigInt(totalChanges)
    )
  )

  return pixelSetEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
