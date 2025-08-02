import React, { useState, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { AnalysisResult, AppState, Status } from './types';
import { analyzeReviews } from './services/geminiService';
import FileUpload from './components/FileUpload';
import AnalysisDisplay from './components/AnalysisDisplay';
import { CATEGORIES, DEFAULT_CATEGORY_VALUE } from './config/categories';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: Status.Idle,
    analysisResult: null,
    error: null,
    fileName: null,
    selectedCategory: DEFAULT_CATEGORY_VALUE,
  });

  const { status, analysisResult, error, fileName, selectedCategory } = state;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prevState => ({ ...prevState, selectedCategory: e.target.value }));
  };

  const handleFileParse = useCallback(async (file: File) => {
    if (!selectedCategory.trim()) {
      setState(prevState => ({ ...prevState, error: 'Please select a category first.' }));
      return;
    }

    setState(prevState => ({ ...prevState, status: Status.Processing, analysisResult: null, error: null, fileName: file.name }));

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let reviewsText: string = '';

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const fileContent = event.target?.result;
          if (!fileContent) {
            throw new Error("Failed to read file content.");
          }

          if (fileExtension === 'csv') {
            const parsedData = Papa.parse(fileContent as string, { header: false });
            reviewsText = parsedData.data.map((row: string[]) => row.join(' ')).join('\n');
          } else if (fileExtension === 'xlsx') {
            const workbook = XLSX.read(fileContent, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            reviewsText = jsonData.map((row: any[]) => row.join(' ')).join('\n');
          } else {
            throw new Error('Unsupported file type. Please upload a CSV or XLSX file.');
          }

          if (!reviewsText.trim()) {
            throw new Error('The uploaded file appears to be empty or does not contain text.');
          }

          const result = await analyzeReviews(reviewsText, selectedCategory);
          setState(prevState => ({ ...prevState, status: Status.Success, analysisResult: result, error: null }));
        } catch (err) {
          console.error(err);
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
          setState(prevState => ({ ...prevState, status: Status.Error, analysisResult: null, error: errorMessage }));
        }
      };

      reader.onerror = () => {
        setState(prevState => ({ ...prevState, status: Status.Error, analysisResult: null, error: 'Failed to read the file.' }));
      };

      if (fileExtension === 'xlsx') {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during file processing.';
      setState(prevState => ({ ...prevState, status: Status.Error, analysisResult: null, error: errorMessage }));
    }
  }, [selectedCategory]);

  const handleReset = () => {
    setState({
      status: Status.Idle,
      analysisResult: null,
      error: null,
      fileName: null,
      selectedCategory: DEFAULT_CATEGORY_VALUE,
    });
  };
  
  const categoryGroups = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
        (acc[category.group] = acc[category.group] || []).push(category);
        return acc;
    }, {} as Record<string, typeof CATEGORIES>);
  }, []);

  const selectedCategoryLabel = useMemo(() => {
    return CATEGORIES.find(c => c.value === selectedCategory)?.label || 'Reviews';
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Review Insights AI
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Upload your product reviews to unlock powerful summaries and sentiment analysis.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/20 border border-gray-700 mb-8">
          {status === Status.Idle && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <label htmlFor="category-select" className="block text-sm font-medium text-gray-300 mb-2">
                  1. Choose an analysis category
                </label>
                <select
                  id="category-select"
                  name="category-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                >
                  {Object.entries(categoryGroups).map(([groupName, categories]) => (
                    <optgroup key={groupName} label={groupName} className="bg-gray-800 text-gray-400">
                      {categories.map(category => (
                        <option key={category.value} value={category.value} className="bg-gray-900 text-white">
                          {category.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
               <div>
                 <label className={`block text-sm font-medium text-gray-300 mb-2 ${!selectedCategory.trim() ? 'opacity-50' : ''}`}>
                    2. Upload your reviews file
                  </label>
                <FileUpload onFileSelect={handleFileParse} disabled={!selectedCategory.trim()} />
              </div>
            </div>
          )}
          
          {(status === Status.Processing || status === Status.Error || status === Status.Success) && (
             <AnalysisDisplay
                status={state.status}
                analysisResult={state.analysisResult}
                error={state.error}
                fileName={state.fileName}
                categoryLabel={selectedCategoryLabel}
                onReset={handleReset}
             />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;