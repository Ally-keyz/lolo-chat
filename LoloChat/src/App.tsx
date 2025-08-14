import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket';

function App() {
  const [isConnected , setIsConnected] = useState(false);
  const [messages , setMessages] = useState<string[]>([]);
  const [inputs , setInputs] = useState('');

  useEffect(()=>{

    const onConnection = ()=>{
      setIsConnected(true)
    }

    const onDisconect = ()=>{
      setIsConnected(false);
    }

    const onChatMessage = (message:string)=>{
      setMessages(prev => [...prev , message])
    }
    socket.on('connect', onConnection);
    socket.on('disconect' , onDisconect);
    socket.on('chat message' , onChatMessage);


  },[])
  
  function sendMessage(){
    socket.emit('chat message', inputs);
  }

  return (
    <>
      <div className="h-screen p-5 bg-gradient-to-r from-amber-600 to-gray-800 ">
        <div className="p-4 flex justify-end">
          <div className="flex">
            <div className={`rounded-full p-3 h-5 ${isConnected ? 'bg-orange-600' : 'bg-red-600' } `}></div>
            <p className='text-white font-mono ml-2'>{isConnected ? 'Active' :'Disconected'}</p>
          </div>
        </div>

        <div className="p-10 absolute left-72 bottom-20 flex justify-center ">
          <input type="text" onChange={(e)=> setInputs(e.target.value)} placeholder='Type your message here...' className='sm:w-[600px] h-[100px] px-5 rounded-2xl bg-gray-800 font-mono text-white placeholder:text-white/70' />
          <button onClick={sendMessage} className="rounded-2xl absolute left-[530px] bottom-16 w-[100px] h-[40px] bg-black text-white font-mono">send</button>
        </div>
      </div>
    </>
  )
}

export default App
