import{useState,useEffect} from 'react'


function Getdata() {
    const [data,setData]=useState({});

    useEffect(()=>{
fetch("/home")
.then(res=>res.json())
.then (data=>setData(data))
    },[])

    return(
<div>{data.name}</div>
    )



    }

export default Getdata;