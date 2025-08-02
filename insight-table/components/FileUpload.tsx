import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File | null) => {
    if (disabled || !file) return;

    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (allowedTypes.includes(file.type) || fileExtension === 'csv' || fileExtension === 'xlsx') {
      setError(null);
      onFileSelect(file);
    } else {
      setError('Invalid file type. Please upload a CSV or XLSX file.');
    }
  }, [onFileSelect, disabled]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors
          ${disabled 
            ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed'
            : isDragging 
              ? 'border-purple-400 bg-gray-700/50 cursor-pointer' 
              : 'border-gray-600 bg-gray-800 hover:bg-gray-700/80 cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={`flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 ${disabled ? 'opacity-50' : ''}`}>
          <UploadIcon className="w-10 h-10 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-400">
             {disabled ? (
              <span className="font-semibold text-gray-300">Select a category above to enable file upload</span>
            ) : (
              <><span className="font-semibold text-purple-400">Click to upload</span> or drag and drop</>
            )}
          </p>
          <p className="text-xs text-gray-500">CSV or XLSX (MAX. 5MB)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={disabled} accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv" />
      </label>
      {error && !disabled && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default FileUpload;