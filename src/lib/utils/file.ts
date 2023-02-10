/**
 * @file file.ts
 * @author James Bennion-Pedley
 * @brief Helper functions for file handlers
 * @date 10/02/2023
 *
 * @copyright Copyright (c) 2023
 *
 */

/*-------------------------------- Imports -----------------------------------*/

/*--------------------------------- State ------------------------------------*/

/*------------------------------- Functions ----------------------------------*/

function download(blob: Blob, filename: string) : void {
    /* Create hidden download link and programatically click */
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function upload(callback: ((files: File[]) => void), ext: string, multiple?: boolean) : void {
    const i = document.createElement('input');

    i.type = "file";
    i.accept = ext;
    if(multiple) {
        i.multiple = true;
    }
    document.body.appendChild(i);
    i.click();
    document.body.removeChild(i);

    /* Create hook for re-focus (if no files are added) */
    document.body.onfocus = (() => {
        document.body.onfocus = null;
        window.setTimeout(() => {
            if(i.files && i.files.length == 0) {
                callback([]);   // Pass no files to callback
                i.remove();
            }
        }, 100);
    });

    /* File upload handler */
    i.addEventListener('change', () => {
        if(i.files === null)
            return;

        callback(Array.from(i.files));
        i.remove();
    });
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    upload,
    download,
};
