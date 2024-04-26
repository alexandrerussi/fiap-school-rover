// src/components/DisplayPlayers.jsx
import React from 'react';
import './DisplayPlayers.css'; // Importa o CSS para DisplayPlayers
import { useNavigate } from 'react-router-dom';
import { usePlayers } from '../context/PlayerContext';

function DisplayPlayers() {
    const { players, resetPlayers } = usePlayers();
    const navigate = useNavigate(); // Hook para navegar entre as rotas

    const handleBack = () => {
        resetPlayers(); // Reseta os jogadores ao voltar
        navigate('/'); // Navega de volta para a página de registro
    };

    return (
        <div>
            <div className='players'>
                {players.map((player, index) => (
                    <div key={index}>
                        <img src={player.photo} alt={`Foto de ${player.nickname}`} />
                        <h2>{player.nickname}</h2>
                    </div>
                ))}
            </div>
            <button onClick={handleBack}>Voltar</button>  {/* Botão de voltar */}
        </div>
    );
}

export default DisplayPlayers;
