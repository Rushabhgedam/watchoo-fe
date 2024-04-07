import React, { useEffect, useRef, useState } from 'react';
import "./App.css";
import io from 'socket.io-client';
import { sendMessage } from './helper';

const VideoUploader = () => {
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);
    const wsRef = useRef()
    const videoRef = useRef(null);
    // const socket = io('http://localhost:8080');

    wsRef.current = new WebSocket('ws://localhost:3002');
    useEffect(() => {
        wsRef.current.onmessage = (event) => {
            handleUploadedVideo(event.data)
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
            const response = await fetch('http://192.168.1.5:3002/upload', {
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

    const handleUploadedVideo = (message) => {
        const resp = JSON.parse(message)
        console.log(message, videoRef.current)

        if(resp.type === "video_uploaded"){
            setVideoSrc(resp.url)
        }
        else if (resp.type === "video_started_1"){
            videoRef.current.play()
        }
        else if (resp.type === "video_paused_1"){
            videoRef.current.pause()
        }
        else if (resp.type === "video_seek_1"){
            videoRef.current.currentTime = resp.currentTime
        }
    }

    useEffect(() => {
        try {
        const videoPlayer = videoRef.current;

        console.log(videoPlayer, wsRef)
        const handlePause = () => {
          if (videoPlayer) {
            sendMessage(wsRef.current, { type:"video_paused_1",currentTime: videoPlayer.currentTime } )
          }
        };
    
        const handlePlay = () => {
            sendMessage(wsRef.current, { type:"video_started_1",currentTime: videoPlayer.currentTime } )
        };

        const handleSeeking = () => {
            sendMessage(wsRef.current, { type:"video_seek_1",currentTime: videoPlayer.currentTime } )
          };
    
        if (videoPlayer) {
          videoPlayer.addEventListener('pause', handlePause);
          videoPlayer.addEventListener('play', handlePlay);
          videoPlayer.addEventListener('seeking', handleSeeking);

        }
    
        return () => {
          if (videoPlayer) {
            videoPlayer.removeEventListener('pause', handlePause);
            videoPlayer.removeEventListener('play', handlePlay);
            videoPlayer.removeEventListener('seeking', handleSeeking);
          }
        };

    } catch (error) {
     console.log(error)       
    }
      }, [videoSrc]);
    return (
        <div className="container">
            <div className="video-wrapper">
                
                {
                    videoSrc ?
                        <video ref={videoRef} controls={true} controlsList="nodownload" className="video">
                            <source src={videoSrc} type="video/mp4" />
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
