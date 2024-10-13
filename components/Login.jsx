"use client"
import React from 'react'
import { Fugaz_One, Open_Sans} from "next/font/google";
import Button from './Button';
import { useAuth } from '@/context/AuthContext';


const fugazOne = Fugaz_One({
  subsets: ["latin"],
  variable: "--font-fugaz-one",
  weight: "400",
});
const opensans = Open_Sans({ 
  subsets: ["latin"],
  weight: "600"
});



export default function Login() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isRegistered, setIsRegistered] = React.useState(false)
  const [authenticating, setAuthenticating] = React.useState(false)

  const {signup, login} = useAuth()

  async function handleSubmit(){
    if(!email || !password || password.length < 6){
      return
    } 
    setAuthenticating(true)
    try{
      if(isRegistered){
        console.log("Signing up a new user")
        await signup (email, password)
      } else {
        console.log("Logging in existing user")
        await login (email, password)
      }
    } catch(err){
      console.error(err)
    } finally {
      setAuthenticating(false)
    }
   
  }
  return (
    <div className={"flex flex-col flex-1 justify-center items-center gap-4 " + opensans.className}>
      <h3 className={"text-4xl sm:text-5xl md:6xl " + fugazOne.className}> {isRegistered ? "Register" : "Log In"}</h3>
      <p>You are one step away!</p>
      <input className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 py-2 sm:py-3 border-2 border-indigo-400 rounded-full outline-none"
      placeholder="Email"
      value = {email}
      onChange={(e)=> {setEmail(e.target.value)}}
      />
      <input className="w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 py-2 sm:py-3 border-2 border-indigo-400 rounded-full outline-none"
      placeholder="Password"
      type="password"
      value = {password}
      onChange={(e)=> {setPassword(e.target.value)}}
      />
      
      <div className="max-w-[400px] w-full mx-auto">
        <Button 
        text={authenticating ?"Submiting" : "Submit"} 
        full
        clickHandler = {handleSubmit}
        />
      </div>
        
        <p>{isRegistered ? "Already have an account? " : "Don't have an account? " }<button onClick={()=> setIsRegistered(!isRegistered)} className="text-indigo-600 underline underline-offset-2 hover:text-indigo-400 cursor-pointer">{isRegistered ? "Sign In" : "Sign Up"}</button></p>

    </div>
  )
}
