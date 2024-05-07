// src/components/DisplayPlayers.jsx
import React, { useState } from 'react';
import './DisplayPlayers.css';
import { useNavigate } from 'react-router-dom';
import { usePlayers } from '../context/PlayerContext';

function DisplayPlayers() {
    const { players, resetPlayers } = usePlayers();
    const navigate = useNavigate();
    const [rovers, setRovers] = useState([
        { nome: "95 Queen", turma: "7A" },
        { nome: "Wall-E", turma: "7C" },
        { nome: "Barco", turma: "7A" },
        { nome: "BBB", turma: "7B" }
    ]);
    const [assignedRovers, setAssignedRovers] = useState([]);

    const handleBack = () => {
        resetPlayers();
        navigate('/');
    };

    const handleAssignRover = () => {
        if (assignedRovers.length < players.length) {
            const remainingRovers = rovers.filter(rover => !assignedRovers.some(ar => ar.rover.nome === rover.nome));
            const randomIndex = Math.floor(Math.random() * remainingRovers.length);
            const selectedRover = remainingRovers[randomIndex];
            const updatedAssignedRovers = [
                ...assignedRovers,
                { ...players[assignedRovers.length], rover: selectedRover }
            ];
            setAssignedRovers(updatedAssignedRovers);
        }
    };

    return (
        <div>
            <div className='grid'>
                <div className='players'>
                    {players.map((player, index) => (
                        <div key={index}>
                            <img src={player.photo} alt={`Foto de ${player.nickname}`} />
                            <h2>{player.nickname}</h2>
                            {assignedRovers[index] && assignedRovers[index].rover ? (
                                <p>{`${assignedRovers[index].rover.nome} (${assignedRovers[index].rover.turma})`}</p>
                            ) : <p>Aguardando sorteio...</p>}
                        </div>
                    ))}
                </div>
                <div className='sort-reel'>
                    <button onClick={handleAssignRover} disabled={assignedRovers.length >= players.length}>
                        Sortear Rover
                    </button>
                </div>
            </div>
            <button onClick={handleBack}>Voltar</button>
        </div>
    );
}

export default DisplayPlayers;
