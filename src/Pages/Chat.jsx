import { dataContext, prevUser } from "../Context/UserContext";
import { useContext, useEffect } from "react";

export default function Chat() {
    let { resultOutput,  prevFeature,genImageUrl } = useContext(dataContext);
    useEffect(() => {
        console.log("prevFeature updated:", prevFeature);
    }, [prevFeature]);

    function ImgDownloadHandler() {
        if (!genImageUrl) return;
    
        const link = document.createElement("a");
        link.href = genImageUrl;
        link.download = "generated-image.jpg"; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function ImgCopyHandler(){

        navigator.clipboard.writeText(resultOutput);
        alert("Copied")
    }
    

    return (
        <>
            <div className="min-w-screen text-2xl text-sm pl-2 gap-2 mt-10 pt-10 flex flex-col justify-start min-h-[70vh] ">
                {/* User Input */}
                <div className="border-2 rounded-[20px] p-[20px] w-[97vw] ">
                    {prevFeature === "upload" ? (
                        <>
                            <img className="w-[100px] rounded-3xl mb-2 float" src={prevUser.img_URL} alt="" />
                            <span className="text-2xl">{prevUser.prompt}</span>
                        </>
                    ) : (
                        <span className="text-2xl">{prevUser.prompt}</span>
                    )}
                </div>

                {/* AI Response */}
                <div className="border-2 rounded-[20px] p-[20px] w-[97vw]">
                    {prevFeature === "image" ? 
                        <>{console.log(prevFeature)}
                            {!genImageUrl?<span>Generating Image...</span>:<div className="relative" ><img className="w-[40vw]" src={genImageUrl} alt=""/><button className="border-2 p-2 cursor-pointer font-bold bg-white absolute top-0 right-0 text-black  w-auto rounded  sm:text-2xl text-sm" onClick={ImgDownloadHandler}>Download</button></div>}
                                
                        </>
                    : (
                        <>
                            {resultOutput ? (
                                resultOutput.includes("\n") ? (
                                    // If output contains newlines, format as preformatted text
                                    <><button className="border-2 p-1 active:bg-black active:text-white cursor-pointer font-bold bg-white text-black  w-auto rounded  sm:text-xl text-sm" onClick={ImgCopyHandler}>Copy</button>
                                    <pre className="text-lg whitespace-pre-wrap">
                                        <code>{resultOutput}</code>
                                    </pre> </>
                                ) : (
                                  <><button className="border-2 p-1 active:bg-black active:text-white cursor-pointer font-bold bg-white text-black  w-auto rounded  sm:text-xl text-sm" onClick={ImgCopyHandler}>Copy</button>  <span className="text-lg">{resultOutput}</span></>
                                )
                            ) : (
                                <h1 className="text-3xl">Generating...</h1>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
