import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Timeout for copied message (2 seconds)
  };

  return (
    <div className="absolute grid grid-cols-8 gap-2 w-full max-w-[23rem] m-4">
      <label htmlFor="npm-install" className="sr-only">
        Label
      </label>
      <input
        id="npm-install"
        type="text"
        className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={textToCopy}
        disabled
        readOnly
      />
      <CopyToClipboard text={textToCopy} onCopy={onCopy}>
        <button
          data-copy-to-clipboard-target="npm-install"
          className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 items-center inline-flex justify-center"
        >
          <span id="default-message">{isCopied ? "Copied!" : "Copy Id"}</span>
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default CopyButton;
