import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

function Home() {

    const navigator = useNavigate();


    return (
        <div>
            <h1>Playbook</h1>

            <div className="funds-button">
                <button type="button" onClick={() => navigator("/funds")}>Funds</button>
            </div>
        </div>
    )
}

export default Home