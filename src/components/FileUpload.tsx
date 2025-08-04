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
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden group
          ${disabled 
            ? 'border-slate-700 bg-slate-900/40 cursor-not-allowed'
            : isDragging 
              ? 'border-fuchsia-500 bg-fuchsia-500/10 shadow-[inset_0_0_20px_rgba(217,70,239,0.3)]' 
              : 'border-slate-600 bg-slate-900/60 hover:border-violet-500 hover:bg-slate-800/80 cursor-pointer'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className={`relative flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 z-10 ${disabled ? 'opacity-50' : ''}`}>
          <UploadIcon className={`w-10 h-10 mb-4 text-slate-400 transition-colors ${!disabled && 'group-hover:text-violet-300'}`} />
          <p className="mb-2 text-sm text-slate-400">
             {disabled ? (
              <span className="font-semibold text-slate-300">Select a category to begin</span>
            ) : isDragging ? (
               <span className="font-semibold text-fuchsia-300">Drop to unleash the AI!</span>
            ) : (
              <><span className={`font-semibold text-violet-400 ${!disabled && 'group-hover:text-violet-300'}`}>Click to upload</span> or drag & drop</>
            )}
          </p>
          <p className="text-xs text-slate-500">CSV or XLSX (MAX. 5MB)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={disabled} accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv" />
      </label>
      {error && !disabled && <p className="mt-4 text-sm text-red-400 animate-fade-in">{error}</p>}
    </div>
  );
};

export default FileUpload;