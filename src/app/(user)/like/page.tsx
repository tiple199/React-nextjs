'use client'
import { useState } from "react";

const LikePage = () => {
    const [name,setName] = useState("Tiep");
    return (
        <div>like page : with name {name}</div>
    )
}

export default LikePage;