import { Win as WinEvent } from "../generated/Contract/Contract"
import { Win } from "../generated/schema"

export function handleWin(event: WinEvent): void {
  let entity = new Win(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.player = event.params.player

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
