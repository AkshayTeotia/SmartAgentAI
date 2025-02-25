import { useContext, useRef } from "react";
import { MdImageSearch } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
import { FaPlus, FaArrowUp } from "react-icons/fa";
import Chat from "./Chat";
import { dataContext, prevUser, user } from "../Context/UserContext";
import { query } from "../API/Huggingface.js";
import Gemini from "../API/Gemini.js";

export default function Home() {
    let { startRes, setStartRes, popUp, setPopUp, input, setInput, feature, setFeature, setResultOutput, setPrevFeature, prevFeature, setGenImageUrl } = useContext(dataContext);
    let Img = useRef();

    // Handles form submission for text input
    async function submitHandler(e) {
        e.preventDefault();
        console.log("button Submitted");
        setStartRes(true);
        setPrevFeature(feature);
        setResultOutput("");

        // Store user input and image data
        prevUser.data = user.data;
        prevUser.mime_type = user.mime_type;
        prevUser.img_URL = user.img_URL;
        prevUser.prompt = input;

       
        // Clear user data
        user.data = null;
        user.mime_type = null;
        user.img_URL = null;

         // Call the Gemini API
        const result = await Gemini();
        setResultOutput(result);
         
        
        setFeature("chat");
        setInput("");

       
    }

    // Handles input changes
    function inputHandler(e) {
        setInput(e.target.value);
    }

    // Handles image file input changes
    function Imagehandler(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result.split(",")[1];
                user.data = base64;
                user.mime_type = file.type;
                user.img_URL = `data:${user.mime_type};base64,${base64}`;
            };
            reader.readAsDataURL(file);
        }
    }

    // Handles image generation
    async function handleGenerateImage() {
        console.log("Generating image with prompt:", input);
        setPrevFeature("image");
        setStartRes(true);
        prevUser.prompt = input;

        try {
            let result = await query();
            if (result) {
                const url = URL.createObjectURL(result);
                setGenImageUrl(url);
            } else {
                console.error("No result returned from image generation.");
            }
        } catch (error) {
            console.error("Error generating image:", error);
        }

        setInput("");
        setFeature("chat");
    }

    return (
        <div className="min-w-screen bg-black text-white min-h-screen">
            <div className="mx-10 pt-10 cursor-pointer text-white">
                <h1 onClick={() => { setFeature("chat");
                     setStartRes(false);
                      setPopUp(false); 
                      setResultOutput(null);
                        user.data = null;
                        user.mime_type = null;
                        user.img_URL = null; 
                        }} className="text-4xl font-mono">SmartAgent</h1>
            </div>

            <input type="file" accept="image/*" hidden ref={Img} onChange={Imagehandler} />

            {!startRes ? (
                <div className="min-w-screen min-h-[70vh] flex flex-col items-center justify-center">
                    <h1 className="sm:text-4xl text-2xl text-gray-200 mb-8">What can I Help with?</h1>
                    <div className="flex sm:flex-row flex-col gap-7 text-2xl">
                        <button onClick={() => { setFeature("upload"); Img.current.click(); }} className="p-3 hover:text-gray-600 cursor-pointer transition-all duration-[0.2s] ease-in-out rounded-3xl border-2 flex gap-2 items-align justify-center">
                            <LuImagePlus className="mt-1.5 text-green-600" />Upload Image
                        </button>
                        <button onClick={() => setFeature("image")} className="p-3 cursor-pointer hover:text-gray-600 transition-all duration-[0.2s] ease-in-out rounded-3xl border-2 flex gap-2 items-align justify-center">
                            <MdImageSearch className="mt-1.5 text-blue-600" />Generate Image
                        </button>
                        <button onClick={() => setFeature("chat")} className="p-3 cursor-pointer hover:text-gray-600 transition-all duration-[0.2s] ease-in-out rounded-3xl border-2 flex gap-2 items-align justify-center">
                            <CiChat1 className="mt-1.5 text-orange-900" /> <span>Let's Chat</span>
                        </button>
                    </div>
                </div>
            ) : <Chat />}

            <div>
                
                <div className="min-w-screen p-3 flex justify-center ">
                    
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (input) {
                            if (feature === 'image') {
                                handleGenerateImage();
                            } else {
                                submitHandler(e);
                            }
                        }
                    }}

                    
                    className="w-auto sm:bottom-5 bottom-5 fixed flex flex-col  items-center justify-center">

                    <img src={user.img_URL} className="w-[100px] rounded-xl absolute left-0 bottom-18"  alt="" />   
                        
                        {popUp ? (
                            <div className="text-white bg-gray-900 gap-2 h-[130px] flex flex-col justify-center items-center absolute left-0 border-1 p-1 rounded-xl sm:bottom-18 bottom-15 gap-2">
                                <div>
                                    <button type="button" onClick={() => { setFeature("upload"); setPopUp(false); Img.current.click(); }} className="cursor-pointer transition-all duration-[0.3s] ease-in-out flex hover:bg-gray-300 p-2 border-1 rounded-3xl hover:text-gray-900">
                                        <LuImagePlus className="m-1.5 text-green-600" />Upload Image
                                    </button>
                                </div>
                                <div>
                                    <button type="button" onClick={() => { setFeature("image"); setPopUp(false); }} className="cursor-pointer transition-all duration-[0.3s] ease-in-out flex hover:bg-gray-300 p-2 border-1 rounded-3xl hover:text-gray-900">
                                        <MdImageSearch className="m-1.5 text-blue-600" />Generate Image
                                    </button>
                                </div>
                            </div>
                        ) : ""}
                        <div className="flex sm:gap-5 gap-1">
                            <button type="button" onClick={() => setPopUp((prev) => !prev)} className={`active:border-white bg-gray-900 active:text-white border-2 border-gray-600 hover:text-gray-600 transition-all duration-[0.2s] cursor-pointer ease-in-out sm:p-4 p-4 sm:text-3xl text-sm rounded-full 
                                ${feature === "upload" ? "text-green-600" : feature === "image" ? "text-blue-600" : "text-white"}`}>
                                {feature === "image" ? <MdImageSearch /> : feature === "upload" ? <LuImagePlus /> : <FaPlus />}
                            </button>

                            <input onChange={inputHandler} type="text" name="" value={input} placeholder="Ask Something..." className="w-[60vw] bg-gray-900 sm:h-[65px] h-[50px] rounded-4xl sm:text-xl text-sm sm:px-6 px-2 text-white border-2 border-gray-600" />

                            {input ? (
                                <button type="submit" className="active:border-white bg-gray-900 active:text-white border-2 hover:text-gray-600 transition-all duration-[0.2s] ease-in-out cursor-pointer sm:p-4 p-4 sm:text-3xl border-gray-600 text-sm rounded-full">
                                    <FaArrowUp />
                                </button>
                            ) : null}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}