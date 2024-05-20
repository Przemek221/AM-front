export const formatDate = (argDate) => {
    const date = new Date(argDate);
    const minutes = (date.getMinutes().toString().length === 1) ? `0${date.getMinutes()}` : date.getMinutes();
    const month = ((date.getMonth() + 1).toString().length === 1) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${date.getDate()}/${month}/${date.getFullYear()} ${date.getHours()}:${minutes}`;
}
