import React, { useEffect, useRef, useState } from 'react';
import "./App.css";


const Buffer = require("buffer").Buffer

const VideoUploader = () => {
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);
    const wsRef = useRef()


    wsRef.current = new WebSocket('ws://localhost:3002');



    useEffect(() => {

        wsRef.current.onmessage = (event) => {
            console.log(JSON.parse(event.data))
        };

    }, [])


    const handleUpload = async (event) => {
        event.preventDefault();

        const fileInput = event.target.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append('video', file);

        setUploading(true);
        try {
            const response = await fetch('http://192.168.1.18:3002/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploaded(true);
                setUploading(false);
                const res = await response.json()
                console.log(res)
            } else {
                console.error('Failed to upload video');
                setUploading(false);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setUploading(false);
        }
    };

    const senderMessage = () => {
        return <div className='chat-item-receiver chat-item' style={{}}>
            <p >Helsd knjdl msdvj nbfhuv jncksdsjn fbhdj ksijduvfhbj sloHelsd knjdl msdvj nbfhuv jncksdsjn fbhdj ksijduvfhbj sloHelsd knjdl msdvj nbfhuv jncksdsjn fbhdj ksijduvfhbj sloHelsd knjdl msdvj nbfhuv jncksdsjn fbhdj ksijduvfhbj slo</p>
        </div>
    }

    const receiverMessage = () => {
        return <div className='chat-item-sender chat-item'>
            <p >Hello</p>
        </div>
    }

    return (
        <div className="container">
            <div className="video-wrapper">
                {
                    videoSrc ?
                        <video controls className="video">
                            <source src="your_video_source.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        :
                        <>
                            <form onSubmit={handleUpload}>
                                <input type="file" name="video" accept="video/mp4" />
                                <button type="submit" disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </form>
                        </>
                }
            </div>
            <div className="chat-box">
                {
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, index) => {
                        return (
                            index % 2 === 0 ? senderMessage() : receiverMessage()
                        )
                    })
                }
            </div>
        </div>
    );
};

export default VideoUploader;
