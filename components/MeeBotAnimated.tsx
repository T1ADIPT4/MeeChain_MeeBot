import React from "react";

export default function MeeBotAnimated() {
    return (
        <div className="flex flex-col items-center space-y-2">
            <img
                src="/meebot-avatar.png"
                alt="MeeBot"
                className="w-24 h-24 rounded-full shadow-lg animate-bounce"
            />
            <p className="text-[#00E0CA] font-bold">MeeBot พร้อมช่วยคุณแล้ว!</p>
        </div>
    )
}
