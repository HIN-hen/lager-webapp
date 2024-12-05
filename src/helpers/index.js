/* Date formatting, Required format: YYYY-MM-DD_HH:MM.jpg */
const formatDate = (mTime) => {
    const dt = new Date(parseInt(mTime));
    return dt.toLocaleString('de-DE');
};

export { 
    formatDate
};