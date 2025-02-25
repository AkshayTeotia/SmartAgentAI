
import { prevUser } from "../Context/UserContext";


 const URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_KEY1}`




async function Gemini(){

    let requestData={
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [{
    "parts":[
      {"text": prevUser.prompt},
      prevUser.data?[{
        "inline_data": {
          "mime_type":prevUser.mime_type,
          "data": prevUser.data
        }
      }]:[]
      
    ]
  }]
        })
    }
        try{
            let response=await fetch(URL,requestData);
            let data= await response.json();
            let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();  
            
            console.log(data);
            return apiResponse;
    
        }
        catch(e){
            console.log(e);   
         }

    }
    
    
    



  

export default Gemini
