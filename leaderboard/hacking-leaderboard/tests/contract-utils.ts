import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { Win } from "../generated/Contract/Contract"

export function createWinEvent(player: Address): Win {
  let winEvent = changetype<Win>(newMockEvent())

  winEvent.parameters = new Array()

  winEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )

  return winEvent
}
