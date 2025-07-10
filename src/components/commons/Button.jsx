import React from 'react';

const Button = ({ type, loading, loadingText, text, onClick, buttonStyle }) => {
  return (
    <button
      onClick={onClick}
      type={`${type || 'button'}`}
      disabled={loading}
      className={`h-10 rounded-md text-md text-white px-2 ${loading ? 'cursor-not-allowed' : 'hover:bg-blue-shadow1'} items-center justify-center ${buttonStyle || 'bg-primary'}`}
    >
      {loading ? (
        <>
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-1 border-t-3 border-t-text-blue border-white rounded-full mr-2"></div>
          <span>{loadingText}</span>
        </>
      ) : (
        `${text || 'Submit'}`
      )}
    </button>
  );
};

export default Button;
