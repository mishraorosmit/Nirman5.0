import React, { useState, useRef } from 'react';
import { User } from '../types';
import { uploadProfilePicture, updateUserProfile } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { Camera, Loader2, CheckCircle, User as UserIcon, Mail, Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileEditorProps {
    user: User;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user }) => {
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('Image size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
            setSelectedFile(file);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError('');

        try {
            await uploadProfilePicture(user.id, selectedFile);
            await refreshUser();
            setSuccess(true);
            setPreviewImage(null);
            setSelectedFile(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const cancelImageUpload = () => {
        setPreviewImage(null);
        setSelectedFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            await updateUserProfile(user.id, {
                name: formData.name,
                email: formData.email
            });
            await refreshUser();
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
                {success && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full"
                    >
                        <CheckCircle size={16} />
                        <span className="text-sm font-bold">Saved!</span>
                    </motion.div>
                )}
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                    {/* Current/Preview Image */}
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-xl bg-slate-100 dark:bg-slate-800">
                        <img
                            src={previewImage || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=160&background=6366f1&color=fff&bold=true`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Camera Button Overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <button
                            onClick={handleImageClick}
                            disabled={uploading}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                        </button>
                    </div>

                    {/* Upload Badge */}
                    {!previewImage && (
                        <div className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-lg">
                            <Upload size={18} />
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center max-w-xs">
                    Click on your photo to upload a new picture
                    <br />
                    <span className="text-slate-400 dark:text-slate-500">Supported: JPG, PNG, GIF (max 5MB)</span>
                </p>

                {/* Image Preview Actions */}
                <AnimatePresence>
                    {previewImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 flex gap-3"
                        >
                            <button
                                onClick={handleImageUpload}
                                disabled={uploading}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Upload Photo
                                    </>
                                )}
                            </button>
                            <button
                                onClick={cancelImageUpload}
                                disabled={uploading}
                                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
                <div className="group space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none font-medium text-slate-900 dark:text-white transition-all"
                            placeholder="Enter your full name"
                        />
                    </div>
                </div>

                <div className="group space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none font-medium text-slate-900 dark:text-white transition-all"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3"
                    >
                        <X size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={saving || uploading}
                className={`w-full mt-8 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${success
                        ? 'bg-emerald-500 shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:scale-[1.02] active:scale-95 shadow-purple-500/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
                {saving ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Saving Changes...
                    </>
                ) : success ? (
                    <>
                        <CheckCircle size={20} />
                        Changes Saved!
                    </>
                ) : (
                    <>
                        <CheckCircle size={20} />
                        Save Profile Changes
                    </>
                )}
            </button>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl flex items-start gap-3">
                <ImageIcon className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                    Your profile picture is stored securely in Firebase Storage and will be displayed across the entire application until you change it.
                </p>
            </div>
        </div>
    );
};

export default ProfileEditor;
