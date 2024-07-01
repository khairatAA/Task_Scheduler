import { ReactNode } from "react";

interface SurfaceUIProps {
    children: ReactNode;
}
const SurfaceUI = ({ children }: SurfaceUIProps) => {
    return (
        <div className=" flex items-center justify-center min-h-screen w-full">
            <div className=" bg-light-gray p-10 my-10 rounded-xl w-[50%] max-md:w-[90%]">
                {children}
            </div>
        </div>
    )
}

export default SurfaceUI
