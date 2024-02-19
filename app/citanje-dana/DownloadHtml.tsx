import React from 'react';
import {ActionButton} from "@adobe/react-spectrum";
import Download from "@spectrum-icons/workflow/Download";

type DownloadHtmlProps = {
    content: string;
    filename: string;
}

/**
 * Gumb čija akcija sprema dohvaćeni sadržaja u HTML datoteku koja se preuzima na uređaj
 * @param content
 * @param filename
 * @constructor
 */
export const DownloadHtml = ({ content, filename }: DownloadHtmlProps) => {
    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
    };

    return (
        <ActionButton type="button" onPress={handleDownload}>
            <Download/>
            Preuzmi sadržaj na svoj uređaj (mobitel ili računalo)
        </ActionButton>
    );
};
