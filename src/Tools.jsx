import React from "react";
import { FaPen } from "react-icons/fa";
import { MdOutlineTextFields } from "react-icons/md";
import { FaSlash } from "react-icons/fa";
import { RiRectangleLine } from "react-icons/ri";
import { IoEllipseOutline } from "react-icons/io5";
import { PiSelectionLight } from "react-icons/pi";
import { GiLaserBurst } from "react-icons/gi";
import { LuEraser } from "react-icons/lu";
import { HiCursorClick } from "react-icons/hi";

function Tools({ currentTool, onClick, setColor, selectedColor }) {
    const tools = [
        {
            name: "Pen",
            tool: FaPen,
            type: 1
        },

        {
            name: "Text",
            tool: MdOutlineTextFields,
            type: 2
        },
        {
            name: "Line",
            tool: FaSlash,
            type: 4
        },
        {
            name: "Rectangle",
            tool: RiRectangleLine,
            type: 8
        },
        {
            name: "Ellipse",
            tool: IoEllipseOutline,
            type: 16
        },
        {
            name: "Select",
            tool: PiSelectionLight,
            type: 32
        },
        {
            name: "Eraser",
            tool: LuEraser,
            type: 64
        },
        {
            name: "Laser",
            tool: GiLaserBurst,
            type: 128
        },
        {
            name: "Click",
            tool: HiCursorClick,
            type: 256
        }

    ]
    const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00'];
    return (
        <div className='w-[80px] h-[90vh] bg-white rounded-3xl py-6 gap-4 z-[100] flex flex-col'>
            {tools.map((tool, index) => {
                const isSelected = currentTool == tool.type
                return <div className={`p-3 rounded-xl cursor-pointer transition-all duration-200
                ease-in-out group shadow-xl shadow-gray-300 ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`
                } key={index} onClick={() => onClick(tool)}>
                    <tool.tool className={`w-6 h-6 transition-colors duration-200
                         ${isSelected ? "text-blue-600" : "text-gray-600 group-hover:bg-blue-600"}`} />
                </div>
            })}
            <div className='mt-4 flex flex-col gap-2'>
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setColor(color)}
                    />
                ))}
            </div>

        </div>
    )
}
export default Tools;