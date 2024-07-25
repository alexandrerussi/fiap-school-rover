import React, { useState, useEffect } from 'react';
import './DisplayPlayers.css';
import { useNavigate } from 'react-router-dom';
import { usePlayers } from '../context/PlayerContext';
import soundEffect from '../assets/effect.mp3';
import interstelarSoundEffect from '../assets/FirstStepMin.mp3';
import astronautMask from '../assets/astronaut.png'; // Ensure the path is correct

function DisplayPlayers() {
    const { players, resetPlayers } = usePlayers();
    const navigate = useNavigate();
    const [rovers, setRovers] = useState([
        { nome: "Wall-E", turma: "7EFA" },
        { nome: "Pinguenos", turma: "7EFA" },
        { nome: "R2D2", turma: "7EFA" },
        { nome: "Mystic", turma: "7EFA" },
        { nome: "Mistérios S.A.", turma: "7EFA" },
        { nome: "BBB", turma: "7EFA" },
        { nome: "Esquadrão Squirtle", turma: "7EFB" },
        { nome: "DWL", turma: "7EFB" },
        { nome: "Guardiões da Respiração", turma: "7EFB" },
        { nome: "Capivaras", turma: "7EFB" },
        { nome: "VERIFICAR Meu Malvado", turma: "7EFB" },
        { nome: "Siri Cascudo", turma: "7EFC" },
        { nome: "VERIFICAR Robô Ana/Valen/Gui", turma: "7EFC" },
        { nome: "Cosmic Rover", turma: "7EFC" },
        { nome: "95 Queen", turma: "7EFC" },
        { nome: "BOB BOOM", turma: "7EFC" }
    ]);
    const [assignedRovers, setAssignedRovers] = useState([]);
    const [currentRoverIndex, setCurrentRoverIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(80); // 60 seconds for 1 minute
    const [timerActive, setTimerActive] = useState(false);
    const [sound, setSound] = useState(null);
    const [interstelarSound, setInterstelarSound] = useState(null);

    useEffect(() => {
        setSound(new Audio(soundEffect));
        setInterstelarSound(new Audio(interstelarSoundEffect));

        return () => {
            sound && sound.pause();
            interstelarSound && interstelarSound.pause();
        };
    }, []);

    useEffect(() => {
        let interval = null;
        if (timerActive && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (!timerActive && timerSeconds !== 0) {
            clearInterval(interval);
            interstelarSound && interstelarSound.pause();
            interstelarSound && (interstelarSound.currentTime = 0);
        } else if (timerSeconds === 0) {
            // Quando o timer chega a zero
            interstelarSound && interstelarSound.pause();
            interstelarSound && (interstelarSound.currentTime = 0);
            setTimerActive(false);  // Desativa o timer
            clearInterval(interval);
            setTimerSeconds(80); // Reset to 1 minutes
        }
        return () => clearInterval(interval);
    }, [timerActive, timerSeconds, interstelarSound]);

    useEffect(() => {
        if (animating) {
            const interval = setInterval(() => {
                setCurrentRoverIndex(Math.floor(Math.random() * rovers.length));
            }, 200); // Fast enough to create a "spinning" effect

            sound && sound.play();

            const randomTimeout = Math.random() * (8000 - 4000) + 4000; // Random duration between 4 and 8 seconds
            setTimeout(() => {
                clearInterval(interval);
                sound && sound.pause();
                sound && (sound.currentTime = 0);
                finalizeAssignment();
            }, randomTimeout);

            return () => {
                clearInterval(interval);
                sound && sound.pause();
                sound && (sound.currentTime = 0);
            };
        }
    }, [animating, rovers.length]);  // Depend on animating and rovers.length only

    const finalizeAssignment = () => {
        if (assignedRovers.length < players.length) {
            const selectedRover = rovers[currentRoverIndex];
            const newRovers = rovers.filter(rover => rover.nome !== selectedRover.nome);
            const updatedAssignedRovers = [
                ...assignedRovers,
                { ...players[assignedRovers.length], rover: selectedRover }
            ];
            setAssignedRovers(updatedAssignedRovers);
            setRovers(newRovers);
            setAnimating(false);
        }
    };

    const handleAssignRover = () => {
        setCurrentRoverIndex(Math.floor(Math.random() * rovers.length)); // Set initial random index here
        setAnimating(true);
    };

    const handleStartTimer = () => {
        interstelarSound && interstelarSound.play();
        setTimerActive(true);
    };

    const handlePauseTimer = () => {
        interstelarSound && interstelarSound.pause();
        setTimerActive(false);
    };

    const handleStopTimer = () => {
        interstelarSound && interstelarSound.pause();
        interstelarSound && (interstelarSound.currentTime = 0);
        setTimerActive(false);
        setTimerSeconds(80); // Reset to 1 minutes
    };

    const handleBack = () => {
        resetPlayers();
        navigate('/');
    };

    return (
        <div>
            <div className='grid'>
                <div className='players'>
                    {players.map((player, index) => (
                        <div key={index}>
                            <div className='player-container'>
                                <img src={player.photo} alt={`Foto de ${player.nickname}`} className='player-photo' />
                                <img src={astronautMask} alt="Astronaut Mask" className="astronaut-mask" />
                            </div>
                            <h2>{player.nickname}</h2>
                            {assignedRovers[index] && assignedRovers[index].rover ? (
                                <p>{`${assignedRovers[index].rover.nome} (${assignedRovers[index].rover.turma})`}</p>
                            ) : <p>Aguardando sorteio...</p>}
                        </div>
                    ))}
                </div>
                <div className='sort-reel'>
                    <ul>
                        {rovers.map((rover, index) => (
                            <li key={index} style={{ color: currentRoverIndex === index ? '#e3135c' : 'white', textAlign: 'left' }}>
                                {`${rover.turma}: ${rover.nome}`}
                                {currentRoverIndex === index && animating && <span> ←</span>}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleAssignRover} disabled={assignedRovers.length >= players.length || animating}>
                        Sortear Rover
                    </button>

                    <div className="timer-controls">
                        <p>Timer: {Math.floor(timerSeconds / 60)}:{("0" + (timerSeconds % 60)).slice(-2)}</p>
                        <button onClick={handleStartTimer} disabled={timerActive}>Play</button>
                        <button onClick={handlePauseTimer} disabled={!timerActive}>Pause</button>
                        <button onClick={handleStopTimer}>Stop</button>
                    </div>
                </div>
            </div>
            <button onClick={handleBack}>Voltar</button>
        </div>
    );
}

export default DisplayPlayers;
