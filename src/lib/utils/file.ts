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

function read(file: File): Promise<unknown> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsText(file);
    })
}

function validName(str: string): string {
    return (str.replace(/[\/|\\:*?"<>]/g, " "));
}

function incrementName(name: string, list: string[]): string {
    let inc = 1;
    let regex = /\((.*?)\)/;

    while (list.some((t: any) => (t === name))) {
        /* Add numbered increment to patch name */
        let ext = regex.exec(name);
        if (ext && name.endsWith(ext[0])) {
            inc = parseInt(ext[1]) + 1;
            name = name.slice(0, -(ext[0].length + 1))
        }
        name = name + " (" + inc + ")";
    }

    return name;
}

function download(blob: Blob, filename: string): void {
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

function upload(callback: ((files: File[]) => void), ext: string, multiple?: boolean): void {
    const i = document.createElement('input');

    i.type = "file";
    i.accept = ext;
    if (multiple) {
        i.multiple = true;
    }
    document.body.appendChild(i);
    i.click();
    document.body.removeChild(i);

    /* Create hook for re-focus (if no files are added) */
    document.body.onfocus = (() => {
        document.body.onfocus = null;
        window.setTimeout(() => {
            if (i.files && i.files.length == 0) {
                callback([]);   // Pass no files to callback
                i.remove();
            }
        }, 100);
    });

    /* File upload handler */
    i.addEventListener('change', () => {
        if (i.files === null)
            return;

        callback(Array.from(i.files));
        i.remove();
    });
}

/*-------------------------------- Exports -----------------------------------*/

export default {
    upload,
    download,
    read,
    validName,
    incrementName,
};
