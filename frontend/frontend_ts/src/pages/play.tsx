import React, {useCallback, useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import Agent from '../components/guide'
import './play.css'
import Chat from '../components/chat'
import useStore from '../../Store'
import { TransactionDefault } from "@coinbase/onchainkit/transaction"
import Transaction from '../components/transaction'
import {calls} from '../calls/calls'
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import Leaderboard  from '../components/Leaderboard'


const url =
  "https://api.studio.thegraph.com/query/103275/hacking-leaderboard/version/latest";

function play() {
  const index = useStore((state) => state.index);
  const [agentAdress, setAgentAdress] = useState("");
  const [winner, setWinner] =useState(false);
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false); 
  
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);
  const [contract, setContract] = useState(true);
  const toggle =()=> {
    setContract((prev) => !prev);
  }
  console.log("index",index)

        const fetchAgentAddress = async () => {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_AGENT_URL}/wallet_details`, {
                credentials: 'include'
            });
            const data = await response.json();
            let a =(data.wallet_details);
            let address=(JSON.parse(a).default_address_id);
            if (address !== undefined && address !== null && address !== "" && address !== "null"){
                setAgentAdress(address);
            }
            console.log(address);
        }
    

        fetchAgentAddress();
        const query = gql`
    {
  wins(
    first: 1
    orderBy: blockTimestamp
    orderDirection: desc
    where: {player: ""}
  ) {
    id
    player
    blockTimestamp
  }
}
      `; 

        const { data, isLoading, error } = useQuery({
          queryKey: ["wins"],
          queryFn: async () => request(url, query),
        });
        console.log("winner", data?.wins)
        useEffect(() => {
          if (data?.wins && data.wins.length !== 0) {
            setWinner(true);
          }
        }, [data]); 
        
      
  return (
    <div className='play'>
    <Navbar/>
    <div className='extra_nav'>
    <button className='nav_btn'>Join Community</button>
    <button className='nav_btn' onClick={() => setIsLeaderboardOpen(true)}>Leaderboard</button>
    <button className='nav_btn'>Invite Friends</button>
    </div>
    <div className='Cover2'></div>
    <img src={`bg${index}.webp`} className='bg'></img>
    <div className='Left'>
        <h2>LEVEL 0</h2>
        <h3>Challenge Guide</h3>
        <Agent/>
     
    </div>
    <div className='down'>
       <h3 >{(winner)?"You have Won":"Still not won"}</h3>
        {/* <button className='sol-btn'>Solved</button> */}
    </div>
        {/* <Transaction/> */}
        <button onClick={toggle} className='toggler'>{contract?"Show AI":"ShowContract"}</button>
        {/* <TransactionDefault chainId={84532} calls={calls} onStatus={handleOnStatus} className='iswon' /> */}
    <Chat contract={contract}/>
    {isLeaderboardOpen && <Leaderboard isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />}

</div>
  )
}

export default play