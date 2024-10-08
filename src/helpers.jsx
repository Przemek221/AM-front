
export const formatDate = (argDate) => {
    const date = new Date(argDate);
    const minutes = (date.getMinutes().toString().length === 1) ? `0${date.getMinutes()}` : date.getMinutes();
    const month = ((date.getMonth() + 1).toString().length === 1) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${date.getDate()}/${month}/${date.getFullYear()} ${date.getHours()}:${minutes}`;
}

export const authTokenNames = {
    access_token: 'access_token',
    refresh_token: 'refresh_token'
}

export const isImage = (uri) => {
    const supportedImageTypes = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];
    const uriParts = uri.toLowerCase().split('.');
    const fileType = uriParts[uriParts.length - 1];
    return supportedImageTypes.includes(fileType);
}
