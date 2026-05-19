interface props {
        progress: string
    }

export default function ProgressBar({progress}: props) {
    
    
    
    return(
        <div className="w-full h-5 bg-[#C6C7FA] rounded-2xl">
            <div className={` h-5 bg-[#5B5DF0] rounded-2xl`} style={{width: progress}}>

            </div>
        </div>
    )
}