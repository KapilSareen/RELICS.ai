import {
  PrizePoolFunded as PrizePoolFundedEvent,
  RewardWithdrawn as RewardWithdrawnEvent,
  ScoreSubmitted as ScoreSubmittedEvent
} from "../generated/Leaderboard/Leaderboard"
import {
  PrizePoolFunded,
  RewardWithdrawn,
  ScoreSubmitted
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
  let entity = new ScoreSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.player = event.params.player
  entity.score = event.params.score
  entity.reward = event.params.reward
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
