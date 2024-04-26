// src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import './RegistrationForm.css'; // Importa o CSS para RegistrationForm
import Webcam from 'react-webcam';
import { usePlayers } from '../context/PlayerContext';

function RegistrationForm() {
    const { addPlayer, players, resetPlayers } = usePlayers();
    const [nickname, setNickname] = useState('');
    const webcamRef = React.useRef(null);

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        return imageSrc;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const photoBase64 = capturePhoto();
        addPlayer({ nickname, photo: photoBase64 });
        setNickname(''); // Limpa o campo de nickname após o registro
    };

    const handleReset = () => {
        resetPlayers(); // Reseta a lista de jogadores
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nickname:</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    className='webcam'
                />
                <div>
                    <button type="submit">Registrar</button>
                    <button type="button" onClick={handleReset}>Resetar</button>  {/* Botão de reset */}
                </div>
            </form>
            <div>
                <p>Jogadores cadastrados: {players.length}</p>
                {/* {players.length > 0 && <p>Jogadores cadastrados: {players.length}</p>} */}
            </div>
        </div>
    );
}

export default RegistrationForm;
