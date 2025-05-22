import { useRecoilState } from "recoil"
import {mathAtom} from "../store/math"
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
export function InputD(){
    const [math,setMath]=useAtom(mathAtom);
    
    const [temp,setTemp]=useState("");
    const navigate=useNavigate();
    
        return <div className="">   
                <div>{math}</div>
             <input onChange={(e)=>{setTemp(math+e.target.value)}} type="text" id="first_name" className="m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="2+3" required />
            <button onClick={()=>{
                setMath(temp+";");
                console.log(math)
            }} className="m-2 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"><span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
ADD
</span>
</button>
<button onClick={()=>{
    navigate("/result")
}} className="m-2 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"><span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
Submit
</span>
</button>

        </div>

}