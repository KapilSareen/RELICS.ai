import { BigInt } from "@graphprotocol/graph-ts"
import {
  PrizePoolFunded as PrizePoolFundedEvent,
  RewardWithdrawn as RewardWithdrawnEvent,
  ScoreSubmitted as ScoreSubmittedEvent
} from "../generated/Leaderboard/Leaderboard"
import {
  PrizePoolFunded,
  RewardWithdrawn,
  Player
} from "../generated/schema"

export function handlePrizePoolFunded(event: PrizePoolFundedEvent): void {
  let entity = new PrizePoolFunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardWithdrawn(event: RewardWithdrawnEvent): void {
  let player = Player.load(event.params.player)

  if (player == null) {
    return
  }
  player.reward = player.reward.minus(event.params.amount)

  let entity = new RewardWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

}

export function handleScoreSubmitted(event: ScoreSubmittedEvent): void {
  let entity = Player.load(event.params.player)

  if (entity == null) {
    entity = new Player(event.params.player)
    entity.reward = new BigInt(0)
  }

  entity.score = event.params.score
  entity.reward = entity.reward.plus(event.params.reward)
  entity.timestamp = event.params.timestamp

  entity.save()
}
