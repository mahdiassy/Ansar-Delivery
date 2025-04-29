import React, { useState, useRef } from 'react';
import { FaUpload, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';

const ImageUploader = ({ onImageUploaded }) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = (file) => {
    // Reset states
    setUploadStatus(null);
    setIsUploading(true);
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      setIsUploading(false);
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Simulate upload (replace with actual upload logic)
    uploadImage(file)
      .then(imageUrl => {
        setIsUploading(false);
        setUploadStatus('success');
        if (onImageUploaded) {
          onImageUploaded(imageUrl);
        }
      })
      .catch(error => {
        console.error('Upload error:', error);
        setIsUploading(false);
        setUploadStatus('error');
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // This would be your actual upload function
  const uploadImage = async (file) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append('image', file);
    
    // In a real implementation, you would send this to your server
    // For now, we'll simulate a successful upload after a delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Generate a fake URL for the uploaded image
        const fakeImageUrl = URL.createObjectURL(file);
        resolve(fakeImageUrl);
        
        // In a real implementation, you would do something like:
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData
        // });
        // if (!response.ok) throw new Error('Upload failed');
        // const data = await response.json();
        // return data.imageUrl;
      }, 1500);
    });
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        } ${uploadStatus === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''} 
        ${uploadStatus === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            <div className="mt-2">
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <FaSpinner className="animate-spin text-primary-500" />
                  <span className="text-gray-600 dark:text-gray-300">{t('uploadingImage')}</span>
                </div>
              ) : uploadStatus === 'success' ? (
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                  <FaCheck />
                  <span>{t('imageUploaded')}</span>
                </div>
              ) : uploadStatus === 'error' ? (
                <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400">
                  <FaTimes />
                  <span>{t('imageUploadFailed')}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="py-4">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('dragAndDrop')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 