import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Camera, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PatientTelemedicine: React.FC = () => {
    const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const requestPermissions = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setStream(mediaStream);
            setCameraPermission('granted');
            setMicPermission('granted');

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            setCameraPermission('denied');
            setMicPermission('denied');
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup: stop all tracks when component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const handleConnect = () => {
        setIsConnecting(true);
        // Simulate connection
        setTimeout(() => {
            setIsConnecting(false);
            alert('Telemedicine feature coming soon! This will connect you to your doctor.');
        }, 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Telemedicine</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Connect with your doctor via video consultation</p>
                </div>
            </div>

            {cameraPermission === 'pending' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center shadow-sm border border-slate-200 dark:border-slate-800"
                >
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Camera className="text-blue-600 dark:text-blue-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Camera Access Required</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            To start a video consultation, we need access to your camera and microphone.
                            Your privacy is important to us.
                        </p>
                        <button
                            onClick={requestPermissions}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            Enable Camera & Microphone
                        </button>
                    </div>
                </motion.div>
            )}

            {cameraPermission === 'denied' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-900/20 rounded-[2rem] p-12 text-center border border-red-200 dark:border-red-900/30"
                >
                    <AlertCircle className="text-red-600 dark:text-red-400 mx-auto mb-4" size={48} />
                    <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2">Permission Denied</h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">
                        Camera or microphone access was denied. Please enable it in your browser settings.
                    </p>
                    <button
                        onClick={requestPermissions}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                    >
                        Try Again
                    </button>
                </motion.div>
            )}

            {cameraPermission === 'granted' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Video Preview */}
                    <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-800 relative aspect-video">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!videoEnabled && (
                            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                <div className="text-center">
                                    <VideoOff className="text-slate-400 mx-auto mb-2" size={48} />
                                    <p className="text-slate-400">Camera is off</p>
                                </div>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-500 rounded-full flex items-center gap-2 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="text-white font-bold text-sm">Ready</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={toggleVideo}
                                className={`p-6 rounded-2xl font-bold transition-all ${videoEnabled
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                            >
                                {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                            </button>

                            <button
                                onClick={toggleAudio}
                                className={`p-6 rounded-2xl font-bold transition-all ${audioEnabled
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                            >
                                {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                            </button>

                            <button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="px-12 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                            >
                                {isConnecting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Phone size={24} />
                                        Start Consultation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] p-6 border border-blue-200 dark:border-blue-900/30">
                        <div className="flex items-start gap-4">
                            <CheckCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Ready for Consultation</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Your camera and microphone are working properly. Click "Start Consultation" to connect with your doctor.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default PatientTelemedicine;
