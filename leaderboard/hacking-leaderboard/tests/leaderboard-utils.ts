import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  PrizePoolFunded,
  RewardWithdrawn,
  ScoreSubmitted
} from "../generated/Leaderboard/Leaderboard"

export function createPrizePoolFundedEvent(
  sender: Address,
  amount: BigInt
): PrizePoolFunded {
  let prizePoolFundedEvent = changetype<PrizePoolFunded>(newMockEvent())

  prizePoolFundedEvent.parameters = new Array()

  prizePoolFundedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  prizePoolFundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return prizePoolFundedEvent
}

export function createRewardWithdrawnEvent(
  player: Address,
  amount: BigInt
): RewardWithdrawn {
  let rewardWithdrawnEvent = changetype<RewardWithdrawn>(newMockEvent())

  rewardWithdrawnEvent.parameters = new Array()

  rewardWithdrawnEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  rewardWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return rewardWithdrawnEvent
}

export function createScoreSubmittedEvent(
  player: Address,
  score: BigInt,
  reward: BigInt,
  timestamp: BigInt
): ScoreSubmitted {
  let scoreSubmittedEvent = changetype<ScoreSubmitted>(newMockEvent())

  scoreSubmittedEvent.parameters = new Array()

  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("player", ethereum.Value.fromAddress(player))
  )
  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("score", ethereum.Value.fromUnsignedBigInt(score))
  )
  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )
  scoreSubmittedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return scoreSubmittedEvent
}
