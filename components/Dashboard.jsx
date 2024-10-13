"use client"
import React from 'react'
import { Fugaz_One } from "next/font/google";
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';

const fugazOne = Fugaz_One({
  subsets: ["latin"],
  variable: "--font-fugaz-one",
  weight: "400",
});

export default function Dashboard() {
  const { currentUser, userDataObj, setUserDataObj, Loading } = useAuth()
  const [data, setData] = React.useState({})
  const now = new Date()


    const moods = {
      "&^*@$": "😤",
      Sad: "😔",
      Existing: "😐",
      Good: "🙂",
      Happy: "😁"
  }
    const moodsArr = [ "😤", "😔", "😐", "🙂", "😁"]


  function countValues(){
    let total_number_of_days = 0
    let sum_moods = 0
    for(let year in data){
      for(let month in data[year]){
        for(let day in data[year][month]){
          let days_mood = data[year][month][day]
          total_number_of_days++
          sum_moods += days_mood
        }
      }
    }
    let recordedDays = total_number_of_days
    let avgMood = sum_moods/total_number_of_days
    return {
      recorded_days: recordedDays, 
      average_mood: `${moodsArr[Math.floor(avgMood)]}`
    }
  }
  const statuses = {
    ...countValues(),
    time_remaining: `${23- now.getHours()}h${60-now.getMinutes()}min`,
  }
  
  async function handleSetMood(mood){
    
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    try{
      const newData = {...userDataObj}
      if(!newData?.[year]){
       newData[year] = {}
      }
      if(!newData?.[year]?.[month]){
        newData[year][month] = {}
      }

      newData [year][month][day] = mood
      //update the current state
      setData(newData)
      // update the global state
      setUserDataObj(newData)
      // update firebase
      const docRef = doc(db, 'users', currentUser.uid)
      const res = await setDoc(docRef,{
        [year]:{
          [month]:{
            [day]: mood
          }
        }
      }, {merge: true})
  } catch(err){
      console.error(err)
    }
  }
  

  

  React.useEffect(()=>{
    if(!currentUser || !userDataObj){
      return
    }
    setData(userDataObj)
  },[currentUser, userDataObj])

if(Loading){
  return <Loading/>
}

if(!currentUser){
  return <Login/>
}


  return (
  <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
    <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg p-4 gap-4'>
      {Object.keys(statuses).map((status,index) => {
        return(
          <div 
            key = {index} 
            className="flex flex-col gap-1 sm:gap-2"
          >
            <p className="font-medium capitalize text-xs sm:text-sm truncate ">{status.replaceAll("_", " ")}</p>
            <p className={"text-base sm:text-lg truncate " + fugazOne.className}>{statuses[status]}{statuses[status] === countValues().recorded_days ? "🔥" : ""}</p>
          </div>
        )
      })}
    </div>
    <h4 className={"text-4xl sm:text-5xl md:text-6xl " + fugazOne.className}> 
      How do you <span className="textGradiant">feel</span> today?
    </h4>
    <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood,index) => {
          return (
            <button 
              onClick ={()=>{
                const currentMoodValue = index + 1
                handleSetMood(currentMoodValue)
              }}
              className = "p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1 "
              key = {index}
            >
              <p className="text-4xl sm:text-5xl md:text-6xl mb-1 ">
                {moods[mood]}
              </p>

              <p 
              className={"text-indigo-500 text-xs  sm:text-sm md:text-base " + fugazOne.className}
              >
              {mood}
              </p>
            </button>
        )})}
    </div>
        <Calendar completeData={data} handleSetMood = {handleSetMood}/>
  </div>
  )
}
