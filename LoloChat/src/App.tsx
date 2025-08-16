import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket';
import { FaAirbnb } from 'react-icons/fa6';

function App() {
  const [isConnected , setIsConnected] = useState(false);
  const [messages , setMessages] = useState<string[]>([]);
  const [myMessages , setMyMessages] = useState<string[]>([])
  const [ActiveUsers , setActiveUsers] = useState<string[]>([])
  const [inputs , setInputs] = useState('');

  useEffect(()=>{

    const onConnection = ()=>{
      setIsConnected(true)
      socket.emit('active users')
    }

    const onDisconect = ()=>{
      setIsConnected(false);
    }

    const onSentMessage = (message:string)=>{
      setMyMessages(prev => [...prev , message])
    }
    socket.on('sent msg',onSentMessage)
    const onChatMessage = (message:string)=>{
      setMessages(prev => [...prev , message])
    }
    const onActiveUsers = (user:{id:string}[])=>{
       setActiveUsers(user.map(u => u.id))
    }
    socket.on('connect', onConnection);
    socket.on('disconnect' , onDisconect);
    socket.on('chat message' , onChatMessage);
    socket.on('active users',onActiveUsers);

  return () => {
  socket.off('connect', onConnection);
  socket.off('disconnect', onDisconect);
  socket.off('chat message', onChatMessage);
  socket.off('sent msg',onSentMessage)
  socket.off('active users',onActiveUsers)
};


  },[])
  
  function sendMessage(){
    socket.emit('chat message', inputs);
  }

  console.log(ActiveUsers)

  return (
    <>
      <div className="h-screen p-5 bg-gradient-to-r from-zinc-800 to-gray-800 ">
        <div className="p-4 flex justify-end">
          <div className="flex">
            <div className={`rounded-full p-2 w-6 ${isConnected ? 'bg-blue-600/50' : 'bg-red-600/50' } `}></div>
            <p className='text-white font-mono ml-2'>{isConnected ? 'Active' :'Disconected'}</p>
          </div>
        </div>
        <div className="w-[600px] h-full flex justify-end">
          <div className="space-y-5">
        {myMessages.map((msg)=> (
          <div  className="w-[400px] h-[80px] bg-zinc-900/60 p-3 text-white rounded-2xl">
              <p className='text-[10px] font-mono'>You</p>
              <div className="flex w-full justify-center p-3">
                <p className='text-[17px] font-mono'>{msg}</p>
              </div>
          </div>
        ))}
        </div>
        </div>
        <div className="p-10 absolute left-72 bottom-20 flex justify-center ">
          <input type="text" onChange={(e)=> setInputs(e.target.value)} placeholder='Type your message here...' className='sm:w-[600px] border border-black h-[60px] px-5 rounded-2xl bg-zinc-900/60 font-mono text-white placeholder:text-white/70' />
          <button onClick={sendMessage} className="rounded-2xl absolute left-[580px] bottom-12 p-3 cursor-pointer hover:bg-black transition-colors duration-700 bg-gray-700/70 text-white font-mono">
          <FaAirbnb className='w-5 h-5' />
          </button>
        </div>
      </div>
    </>
  )
}

export default App
