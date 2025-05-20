import React, { useEffect, useState } from 'react';

const FileHandler = () => {
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    // Kiểm tra xem có phải là file handler launch không
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (!launchParams.files.length) {
          return;
        }

        const fileHandle = launchParams.files[0];
        const file = await fileHandle.getFile();
        setFileType(file.type);

        if (file.type.startsWith('text/')) {
          const text = await file.text();
          setFileContent(text);
        } else if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          setFileContent(url);
        }
      });
    }
  }, []);

  const renderContent = () => {
    if (!fileContent) return <div>No file opened</div>;

    if (fileType?.startsWith('text/')) {
      return <pre>{fileContent}</pre>;
    }

    if (fileType?.startsWith('image/')) {
      return <img src={fileContent} alt="Opened file" style={{ maxWidth: '100%' }} />;
    }

    return <div>Unsupported file type</div>;
  };

  return (
    <div className="file-handler">
      <h1>File Handler</h1>
      {renderContent()}
    </div>
  );
};

export default FileHandler; 